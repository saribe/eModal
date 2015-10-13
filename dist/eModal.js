/* ========================================================================
 * SaRibe: eModal.js v1.2.03
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
        ///     css      {object}:          css object try apply into message body; only able if message == string
        ///     loading  {bool}:            set loading progress as message.
        ///     message  {string|object}:   The body message string or the HTML element. eg: $(selector);
        ///     size     {string}:          sm || lg || xl -> define the modal size.
        ///     subtitle {string}:          The header subtitle string. This appear in a smaller text.
        ///     title    {string}:          The header title string.
        ///     useBin   {bool}:            set message as recyclable.
        /// </summary>
        /// <param name="params"  >Modal options parameters of string body message.</param>
        /// <param name="title"   >The string header title or a flag to set default parameters.</param>
        /// <returns type="object">{ then, catch, element }.</returns>

        var $modal;
        var bin = 'recycle-bin';
        var div = '<div style="position:relative;word-wrap:break-word;">';
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

        var linq = null;

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
            version: '1.2.03'
        };
        /////////////////////////* Implementation */////////////////////////

        //#region Private Logic
        function _build(message) {
            $modal
                .modal(options)
                .find('.modal-content')
                    .append(message);
        }

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
                                    btn.click(btnOp.click);
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

        function _getMessage(params) {
            /// <param name='params'>object with options</param>
            /// <returns type='jQuery'>eModal body jQuery object</returns>

            var $message;
            var content = params.loading ?
                defaultSettings.loadingHtml :
                (params.message || params);

            if (content.on || content.onclick) {
                $message = params.clone === true ?
                    $(content).clone() :
                    $(content);

                $message.addClass(params.useBin && !params.loading ? recModalContent : tmpModalContent);
            } else {
                $message = $(div).addClass(modalBody)
                    .html(content);
            }

            return params.css && (params.css !== $message.css && $message.css(params.css)), $message;
        }

        function _getModalInstance() {
            /// <summary>
            /// Return a new modal object if is the first request or the already created model.
            /// </summary>
            /// <returns type="jQuery Object">The model instance.</returns>

            if (!$modal) {
                //add recycle bin container to document
                if (!document.getElementById(bin)) {
                    $('body').append($(div).prop('id', bin).hide());
                }

                $modal = createModalElement();
                linq.element = $modal;
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

        function _recycleModal() {
            /// <summary>
            /// Move content to recycle bin if is a DOM object defined by user,
            /// delete it if is a simple string message.
            /// All modal messages can be deleted if default setting "allowContentRecycle" = false.
            /// </summary>

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

        function _setup(params, title) {
            /// <summary></summary>
            /// <param name='params'>eModal body message or object with options</param>
            /// <param name='title'>Modal header title</param>
            /// <returns type='jQuery'>eModal jQuery object</returns>

            linq = $.Deferred();
            linq.catch = linq.fail;
            linq.element = $modal;

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

        //#region Public Methods
        function ajax(data, title) {
            /// <summary>Gets data from URL to eModal body</summary>
            /// <param name="data"></param>
            /// <param name="title"></param>
            /// <returns type=""></returns>

            var params = {
                async: true,
                loading: true,
                title: data.title || title || defaultSettings.title,
                url: data.url || data
            };

            if (data.url) { $.extend(params, data); }

            alert(params, title)
                .element
                .find('.' + modalBody)
                .load(params.url, error);

            return linq;

            function error(responseText, textStatus) {
                var hasError = textStatus === 'error';
                $modal.on(eventShown, hasError ? linq.reject : linq.resolve);
                if (hasError) {
                    var msg = '<div class="alert alert-danger">' +
                        '<strong>XHR Fail: </strong>URL [ ' + params.url + '] load fail.' +
                        '</div>';

                    $modal
                       .find('.' + modalBody)
                       .html(msg);
                }
            }
        }

        function alert(params, title) {
            /// <summary>Non blocking alert whit bootstrap.</summary>
            /// <param name="params"></param>
            /// <param name="title"></param>
            /// <returns type=""></returns>

            _setup(params, title);
            var $message = $(div).append(_getMessage(params), _getFooter(params.buttons));
            _build($message);

            if (!params.async) {
                $modal.on(eventShown, linq.resolve);
            }

            return linq;
        }

        function confirm(params, title) {
            /// <summary></summary>
            /// <param name="params"></param>
            /// <param name="title"></param>
            /// <param name="callback"></param>
            /// <returns type=""></returns>

            return alert({
                async: true,
                buttons: [
                    { close: true, click: click, text: label[params.label] ? label[params.label] : label[defaultSettings.confirmLabel], style: keyDanger },
                    { close: true, click: click, text: label[params.label] ? params.label : defaultSettings.confirmLabel }
                ],
                message: params.message || params,
                onHide: click,
                size: params.size,
                title: params.title || title
            });

            function click(ev) {
                close();

                var key = $(ev.currentTarget).html();
                return label[key] ? linq.resolve() : linq.reject();
            }
        }

        function iframe(params, title) {
            var html = ('<div class=modal-body style="position: absolute;width: 100%;background-color: rgba(255,255,255,0.8);height: 100%;">%1%</div>' +
                        '<iframe class="embed-responsive-item" frameborder=0 src="%0%" style="width:100%;height:75vh;display:block;"/>')
                .replace('%0%', params.message || params.url || params)
                .replace('%1%', defaultSettings.loadingHtml);

            var message = $(html)
                .load(iframeReady);

            return alert({
                async: true,
                buttons: params.buttons || false,
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

                return linq.resolve();
            }
        }

        function emptyBin() {
            /// <summary>Remove all DOM element cached in document.</summary>
            /// <returns type="Array">Array with removed elements.</returns>

            return $('#' + bin + ' > *').remove();
        }

        function prompt(data, title) {
            var params = {};
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
                    linq.reject(value) :
                    linq.resolve(value);

                return false;
            }
        }

        function setEModalOptions(overrideOptions) {
            /// <summary></summary>
            /// <param name="overrideOptions"></param>
            /// <returns type=""></returns>

            return $.extend(defaultSettings, overrideOptions);
        }

        function setModalOptions(overrideOptions) {
            /// <summary></summary>
            /// <param name="overrideOptions"></param>
            /// <returns type=""></returns>

            $modal && $modal.remove();

            return $.extend(options, overrideOptions);
        }

        function close() {
            ///<summary>Close the modal. </summary>
            if ($modal) {
                $modal.off(hide).modal(eventHide);
            }
            return $modal;
        }
        //#endregion
    });
}(typeof define == 'function' && define.amd ? define : function (n, t) {
    typeof window.module != 'undefined' && window.module.exports ?
        window.module.exports = t(window.require(n[0])) :
        window.eModal = t(window.$);
}));