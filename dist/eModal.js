/* ========================================================================
 * SaRibe: eModal.js v1.2.05
 * http://saribe.github.io/eModal
 * ========================================================================
 * Copyright Samuel Ribeiro.
 * Licensed under MIT.
 * ======================================================================== */

; (function (define) {
    define(['jquery'], function ($) {
        /// <summary>
        /// @params allowed elements:
        ///     buttons  {array}:           An array of objects to configure buttons to modal footer; only able if message == string
        ///     css      {object}:          CSS object try apply into message body; only able if message == string
        ///     loading  {boolean}:         Set loading progress as message.
        ///     message  {string|object}:   The body message string or the HTML element. e.g.: $(selector);
        ///     size     {string}:          sm || lg || xl -> define the modal size.
        ///     subtitle {string}:          The header subtitle string. This appear in a smaller text.
        ///     title    {string}:          The header title string.
        ///     useBin   {boolean}:         Set message as recyclable.
        /// </summary>
        /// <param name="params"   >Modal options parameters of string body message.</param>
        /// <param name="title"    >The string header title or a flag to set default parameters.</param>
        /// <returns type="Promise">{ then, element }.</returns>

        var $modal;
        var bin = 'recycle-bin';
        var div = '<div>';
        var empty = '';
        var eventClick = 'click';
        var eventHide = 'hide';
        var eventShown = 'shown.bs.modal';
        var eventSubmit = 'submit';
        var footerId = 'eFooter';
        var hide = eventHide + '.bs.modal';
        var input = 'input';
        var keyDanger = 'danger';
        var label = { OK: 'Cancel', True: 'False', Yes: 'No' };
        var lastParams = {};
        var modalBody = 'modal-body';
        var options = {};
        var recModalContent = 'modal-rec';
        var size = { sm: 'sm', lg: 'lg', xl: 'xl' };
        var tmpModalContent = 'modal-tmp';

        var defaultSettings = {
            allowContentRecycle: true,
            confirmLabel: 'OK',
            size: empty,
            loadingHtml: '<h5>Loading...</h5><div class=progress><div class="progress-bar progress-bar-striped active" style="width: 100%"></div></div>',
            title: 'Attention'
        };

        return {
            ajax: ajax,
            alert: alert,
            close: close,
            confirm: confirm,
            emptyBin: emptyBin,
            iframe: iframe,
            prompt: prompt,
            setEModalOptions: setEModalOptions,
            setModalOptions: setModalOptions,
            size: size,
            version: '1.2.05'
        };
        /////////////////////////* Implementation */////////////////////////

        //#region /////////////////////////* Private Logic */////////////////////////
        /**
         * Find modal body and append message to it.
         * @param {String | DOM} message
         */
        function _build(message) {
            $modal
                .modal(options)
                .find('.modal-content')
                    .append(message);
        }

        /**
         * Will find what Promises approach the developer is using.
         * Will use Promises A+ if Q.js is present, otherwise will use Promises A from jQuery.
         * @returns {Promise}
         */
        function _createDeferred() {
            var defer;

            // try native promise
            //if (Promise) defer = Promise.defer();

            var q;

            try { q = require('Q'); }   // Load option Q by require if exist
            catch (e) { q = window.Q; }

            if (q) {                    // try Q
                defer = q.defer();
            } else {                    // Use jQuery :(
                defer = $.Deferred();
                defer.promise = defer.promise();
            }

            defer.promise.element = $modal;
            return defer;
        }

        /**
         * Will create modal DOM footer with all buttons.
         * @param {Array} buttons - all custom buttons, if none, will generate defaults
         * @returns {$DOM} footer DOM element
         */
        function _getFooter(buttons) {
            if (buttons === false) { return empty; }

            var messageFotter = $(div).addClass('modal-footer').prop('id', footerId);
            if (buttons) {
                for (var i = 0, k = buttons.length; i < k; i++) {
                    var btnOp = buttons[i];
                    var btn = $('<button>').addClass('btn btn-' + (btnOp.style || 'primary'));

                    for (var index in btnOp) {
                        if (btnOp.hasOwnProperty(index)) {
                            switch (index) {
                                case 'close':
                                    //add close event
                                    if (btnOp[index]) {
                                        btn.attr('data-dismiss', 'modal')
                                           .addClass('x');
                                    }
                                    break;
                                case eventClick:
                                    //click event
                                    var fn = btnOp.click.bind(_getModalInstance(true).find('.modal-content'));
                                    btn.click(fn);
                                    break;
                                case 'text':
                                    btn.html(btnOp[index]);
                                    break;
                                default:
                                    //all other possible HTML attributes to button element
                                    btn.attr(index, btnOp[index]);
                            }
                        }
                    }

                    messageFotter.append(btn);
                }
            } else {
                //if no buttons defined by user, add a standard close button.
                messageFotter.append('<button class="x btn btn-primary" data-dismiss=modal type=button>Close</button>');
            }
            return messageFotter;
        }

        /**
         * Extract message from arguments.
         * @param {Object | String} data - this can be the message string or the full detailed object
         * @returns {$DOM}
         */
        function _getMessage(data) {
            var $message;
            var content = data.loading ?
                defaultSettings.loadingHtml :
                (data.message || data);

            if (content.on || content.onclick) {
                $message = data.clone === true ?
                    $(content).clone() :
                    $(content);

                $message.addClass(data.useBin && !data.loading ? recModalContent : tmpModalContent);
            } else {
                $message = $(div)
                    .attr('style', 'position:relative;word-wrap:break-word;')
                    .addClass(modalBody)
                    .html(content);
            }

            return data.css && (data.css !== $message.css && $message.css(data.css)), $message;
        }

        /**
         * Return a new modal object if is the first request or the already created model.
         * @param {boolean} skipEventChageIfExists
         * @returns {jQuery Object}
         */
        function _getModalInstance(skipEventChageIfExists) {
            if (!$modal) {
                //add recycle bin container to document
                if (!document.getElementById(bin)) {
                    $('body').append($(div).prop('id', bin).hide());
                }

                $modal = createModalElement();
            }

            if (skipEventChageIfExists && $modal) {
                return $modal;
            }

            return $modal
                .on(eventShown, function () {
                    $(this).find(input).first().focus();
                });

            function createModalElement() {
                /// <summary></summary>
                /// <returns type="jQuery object"></returns>

                return $('<div class="modal fade" tabindex="-1"><style>.modal-xl{width:96%;}</style>'
                + '<div class=modal-dialog>'
                + '<div class=modal-content>'
                + ' <div class=modal-header><button type=button class="x close" data-dismiss=modal><span aria-hidden=true>&times;</span><span class=sr-only>Close</span></button><h4 class=modal-title></h4></div>'
                + '</div>'
                + '</div>'
                + '</div>')
                .on('hidden.bs.modal', _recycleModal)
                .on(eventClick, 'button.x', function (ev) {
                    var btn = $(ev.currentTarget);

                    if (btn.prop('type') !== eventSubmit)
                        return $modal.modal(eventHide);

                    try {
                        if (btn.closest('form')[0].checkValidity())
                            return close();
                    } catch (e) {
                        return close();
                    }

                    return $modal;
                });
            }
        }

        /**
         * Move content to recycle bin if is a DOM object defined by user,
         * delete it if is a simple string message.
         * All modal messages can be deleted if default setting "allowContentRecycle" = false.
         */
        function _recycleModal() {
            if (!$modal) return;

            var $content = $modal.find('.' + recModalContent).removeClass(recModalContent)
                   .appendTo('#' + bin);

            $modal
                .off(hide)
                .off(eventShown)
                .find('.modal-content > div:not(:first-child)')
                .remove();

            if (!defaultSettings.allowContentRecycle || lastParams.clone) {
                $content.remove();
            }
        }

        /**
         * Handle default values and toggle between {Object | String}.
         * Create or get Modal element
         * @param {Object | String} data - this can be the message string or the full detailed object
         * @param {String} title - the string that will be shown in modal header
         * @returns {Promise} Promise with modal $DOM element
         */
        function _setup(params, title) {
            if (!params) throw new Error('Invalid parameters!');

            _recycleModal();
            lastParams = params;

            // Lazy loading
            var $ref = _getModalInstance();

            //#region change size
            $ref.find('.modal-dialog')
                .removeClass('modal-sm modal-lg modal-xl')
                .addClass(params.size ? 'modal-' + params.size : defaultSettings.size);
            //#endregion

            //#region change title
            $ref.find('.modal-title')
                .html((params.title || title || defaultSettings.title) + ' ')
                .append($('<small>').html(params.subtitle || empty));
            //#endregion

            $ref.on(hide, params.onHide);
        }
        //#endregion

        //#region /////////////////////////* Public Methods */////////////////////////
        /**
         * Gets data from URL to eModal body
         * @param {Object | String} data - this can be the message string or the full detailed object
         * @param {String} title - the string that will be shown in modal header
         * @returns {Promise} Promise with modal $DOM element
         */
        function ajax(data, title) {
            var dfd = _createDeferred();

            var params = {
                async: true,
                deferred: dfd,
                loading: true,
                title: data.title || title || defaultSettings.title,
                url: data.url || data
            };

            if (data.url) { $.extend(params, data); }

            $.ajax({ url: params.url, dataType: 'text' })
                .success(ok)
                .fail(error);

            return alert(params, title);

            function ok(html) {
                $modal
                    .find('.' + modalBody)
                    .html(html);

                return dfd.resolve($modal);
            }
            function error(responseText/*, textStatus*/) {
                var msg = '<div class="alert alert-danger">' +
                    '<strong>XHR Fail: </strong>URL [ ' + params.url + '] load fail.' +
                    '</div>';

                $modal
                   .find('.' + modalBody)
                   .html(msg);
                return dfd.reject(responseText);
            }
        }

        /**
         * Non blocking alert whit bootstrap.
         * @param {Object | String} data - this can be the message string or the full detailed object.
         * @param {String} title - the string that will be shown in modal header.
         * @returns {Promise} Promise with modal $DOM element
         */
        function alert(data, title) {
            _setup(data, title);

            var dfd = data.deferred || _createDeferred();
            var $message = $(div).append(_getMessage(data), _getFooter(data.buttons));

            _build($message);

            if (!data.async) { $modal.on(eventShown, dfd.resolve); }

            return dfd.promise;
        }

        /**
         * Non blocking confirm dialog with bootstrap.
         * @param {Object | String} data - this can be the message string or the full detailed object.
         * @param {String} title - the string that will be shown in modal header.
         * @returns {Promise} Promise with modal $DOM element
         */
        function confirm(data, title) {
            var dfd = _createDeferred();

            return alert({
                async: true,
                buttons: [
                    { close: true, click: click, text: label[data.label] ? label[data.label] : label[defaultSettings.confirmLabel], style: keyDanger },
                    { close: true, click: click, text: label[data.label] ? data.label : defaultSettings.confirmLabel }
                ],
                deferred: dfd,
                message: data.message || data,
                onHide: click,
                size: data.size,
                title: data.title || title
            });

            function click(ev) {
                close();

                var key = $(ev.currentTarget).html();
                return label[key] ? dfd.resolve() : dfd.reject();
            }
        }

        /**
         * Will load a URL in iFrame inside the modal body.
         * @param {Object | String} data - this can be the URL string or the full detailed object.
         * @param {String} title - the string that will be shown in modal header.
         * @returns {Promise} Promise with modal $DOM element
         */
        function iframe(params, title) {
            var dfd = _createDeferred();
            var html = ('<div class=modal-body style="position: absolute;width: 100%;background-color: rgba(255,255,255,0.8);height: 100%;">%1%</div>' +
                        '<iframe class="embed-responsive-item" frameborder=0 src="%0%" style="width:100%;height:75vh;display:block;"/>')
                .replace('%0%', params.message || params.url || params)
                .replace('%1%', defaultSettings.loadingHtml);

            var message = $(html)
                .load(iframeReady);

            return alert({
                async: true,
                buttons: params.buttons || false,
                deferred: dfd,
                message: message,
                size: params.size || size.xl,
                title: params.title || title
            });
            //////////

            function iframeReady() {
                $(this)
                    .parent()
                    .find('div.' + tmpModalContent)
                    .fadeOut(function () {
                        $(this).remove();
                    });

                return dfd.resolve();
            }
        }

        /**
         * Remove all Dom elements in recycle bin.
         * @returns {Array} All removed elements
         */
        function emptyBin() {
            return $('#' + bin + ' > *').remove();
        }

        /**
         * Provides one value form.
         * @param {Object | String} data - this can be the value string label or the full detailed object.
         * @param {String} title - the string that will be shown in modal header.
         * @returns {Promise} Promise with modal $DOM element
         */
        function prompt(data, title) {
            var dfd = _createDeferred();
            var params = {
                deferred: dfd
            };

            if (typeof data === 'object') {
                $.extend(params, data);
            }
            else {
                params.message = data;
                params.title = title;
            }

            params.async = true;

            if (params.buttons) {
                var btn;
                for (var i = 0, k = params.buttons.length; i < k; i++) {
                    btn = params.buttons[i];
                    btn.style = (btn.style || 'default') + ' pull-left';
                    btn.type = btn.type || 'button';
                }
            }

            var buttons = _getFooter([
                { close: true, type: 'reset', text: label.OK, style: keyDanger },
                { close: false, type: eventSubmit, text: defaultSettings.confirmLabel }
            ].concat(params.buttons || []));

            params.buttons = false;
            params.onHide = submit;

            params.message = $('<form role=form style="margin-bottom:0;">' +
                    '<div class=modal-body>' +
                    '<label for=prompt-input class=control-label>' + (params.message || empty) + '</label>' +
                    '<input type=text class=form-control required autocomplete="on" value="' + (params.value || empty) + (params.pattern ? '" pattern="' + params.pattern : empty) + '">' +
                    '</div></form>')
                .append(buttons)
                .on(eventSubmit, submit);

            return alert(params);

            function submit(ev) {
                var value = $modal.find(input).val();
                close();

                //TODO:
                ev.type !== eventSubmit ?
                    dfd.reject(value) :
                    dfd.resolve(value);

                return false;
            }
        }

        /**
         * Set or change eModal options.
         * @param {Object} overrideOptions
         * @returns {Object} merged eModal options
         */
        function setEModalOptions(overrideOptions) {
            /// <summary></summary>
            /// <param name="overrideOptions"></param>
            /// <returns type=""></returns>

            return $.extend(defaultSettings, overrideOptions);
        }

        /**
         * Set or change bootstrap modal options.
         * @param {Object} overrideOptions
         * @returns {Object} merged eModal options
         */
        function setModalOptions(overrideOptions) {
            /// <summary></summary>
            /// <param name="overrideOptions"></param>
            /// <returns type=""></returns>

            $modal && $modal.remove();

            return $.extend(options, overrideOptions);
        }

        /**
         * Close the current open eModal
         * @returns {$DOM} eModal DOM element
         */
        function close() {
            if ($modal) {
                $modal.off(hide).modal(eventHide);
            }
            return $modal;
        }
        //#endregion
    });
}(typeof define == 'function' && define.amd ?
    define :
    function (n, t) {
        typeof window.module != 'undefined' && window.module.exports ?
            window.module.exports = t(window.require(n[0])) :
            window.eModal = t(window.$);
    }));
