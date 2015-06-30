/* ========================================================================
 * SaRibe: eModal.js v1.1.0
 * http://saribe.github.io/eModal
 * ========================================================================
 * Copyright Samuel Ribeiro.
 * Licensed under.
 * ======================================================================== */

; (function (define) {
    define(['jquery'], function ($) {
        /// <summary>
        /// @params allowed elements:
        ///     title    {string}:          The header title string.
        ///     message  {string|object}:   The body message string or the html element. eg: $(selector);
        ///     subtitle {string}:          The header subtitle string. This apper in a smaller text.
        ///     size     {string}:          sm || lg -> define the modal size.
        ///     loading  {bool}:            set loading progress as message.
        ///     useBin   {bool}:            set message as recycable.
        ///     css      {object}:          css objext try apply into message body; only able if message == string
        ///     buttons  {array}:           An array of objects to configure buttons to modal footer; only able if message == string
        /// </summary>
        /// <param name="params"            >Modal options parameters os string body message.</param>
        /// <param name="title"             >The string header title or a flag to set default params.</param>
        /// <returns type="jQuery Element"  >The modal element.</returns>

        //The modal element UX and events.
        var $modal;
        var defaultSettings = {
            allowContentRecycle: true,
            size: '',
            loadingHtml: '<h5>Loading...</h5><div class=progress><div class="progress-bar progress-bar-striped active" role=progressbar aria-valuenow=100 aria-valuemin=0 aria-valuemax=100 style="width: 100%"><span class=sr-only>100% Complete</span></div></div>',
            title: 'Attention'
        };
        var options = {};
        var lastParams = {};

        var tmpModalContent = 'tmp-modal-content';
        var recModalContent = 'rec-modal-content';
        var modalBody = 'modal-body';
        var footerId = 'eModalFooter';
        var bin = 'recycle-bin';
        var div = '<div>';
        var size = { sm: 'sm', lg: 'lg' };

        return {
            ajax: ajax,
            alert: alert,
            confirm: confirm,
            close: close,
            emptyBin: emptyBin,
            prompt: prompt,
            iframe: iframe,
            version: '1.1.0',
            setEModalOptions: setEModalOptions,
            setModalOptions: setModalOptions,
            size: size
        };

        //#region Public Methods
        function ajax(data, title, callback) {
            /// <summary></summary>
            /// <param name="data"></param>
            /// <param name="title"></param>
            /// <returns type=""></returns>

            var params = {
                callback: data.callback || callback,
                loading: true,
                url: data.url || data,
                title: data.title || title || defaultSettings.title
            };

            if (data.url) { $.extend(params, data); }

            return alert(params, title)
                .find('.' + modalBody)
                .load(params.url, error)
                .closest('.modal-dialog');

            function error(responseText, textStatus) {
                if (textStatus === 'error') {
                    var msg = '<div class="alert alert-danger">' +
                        '<strong>XHR Fail: </strong>Url [ ' + params.url + '] load fail.' +
                        '</div>';
                    alert(msg, 'Loading: ' + params.title);
                } else {
                    if (params.callback) params.callback($modal);
                }
            }
        }
        function alert(params, title) {
            /// <summary></summary>
            /// <param name="params"></param>
            /// <param name="title"></param>
            /// <returns type=""></returns>

            setup(params, title);

            var $message = $(div).append(getMessage(params), getFooter(params.buttons));

            return build($message, params);
        }
        function confirm(params, title, callback) {
            /// <summary></summary>
            /// <param name="params"></param>
            /// <param name="title"></param>
            /// <param name="callback"></param>
            /// <returns type=""></returns>

            var label = {
                OK: 'Cancel',
                Yes: 'No',
                True: 'False'
            };
            var defaultLable = 'OK';

            return alert({
                message: params.message || params,
                title: params.title || title,
                onHide: click,
                size: params.size,
                buttons: [
                    { close: true, click: click, text: label[params.label] ? label[params.label] : label[defaultLable], style: 'danger' },
                    { close: true, click: click, text: label[params.label] ? params.label : defaultLable }
                ]
            });

            function click(ev) {
                var fn = params.callback || callback;

                close();

                if (typeof fn === 'function') {
                    var key = $(ev.currentTarget).html();
                    return fn(label[key] ? true : false);
                }

                throw new Error('No callback provided to execute confim modal action.');
            }
        }

        function iframe(params, title, callback) {
            /// <summary></summary>
            /// <param name="data"></param>
            /// <param name="title"></param>
            /// <returns type=""></returns>

            var html = ('<iframe class="embed-responsive-item" src="0" style="width:100%;height:75vh;display:none;" />' +
                '<div class=modal-body>1</div>')
                .replace('"0"', params.message || params.url || params)
                .replace('>1<', defaultSettings.loadingHtml);

            var message = $(html)
                .load(iframeReady);

            return alert({
                message: message,
                title: params.title || title,
                size: params.size || size.lg,
                buttons: params.buttons || false
            });
            //////////

            function iframeReady() {
                $(this).fadeIn()
                .parent()
                .find('div')
                .remove();

                callback = params.callback || callback;
                if (typeof (callback) === 'function') {
                    callback(message);
                }
            }
        }

        function emptyBin() {
            /// <summary></summary>

            return $('#' + bin + ' > *').remove();
        }

        function prompt(data, title, callback) {

            var params = {};
            if (typeof data === 'object') {
                $.extend(params, data);
            }
            else {
                params.message = data;
                params.title = title;
                params.callback = callback;
            }

            params.buttons = false;
            params.onHide = submit;

            var buttons = getFooter([
                { close: true, type: 'reset', text: 'Cancel', style: 'danger' },
                { close: false, type: 'submit', text: 'OK' }
            ]);

            params.message = $('<form role=form style="margin-bottom:0;">' +
                    '<div class=modal-body>' +
                    '<label for=prompt-input class=control-label>' + (params.message || '') + '</label>' +
                    '<input type=text class=form-control id=prompt-input required autofocus value="' + (params.value || '') + (params.pattern ? '" pattern="' + params.pattern : '') + '">' +
                    '</div></form>')
                .append(buttons)
                .on('submit', submit);

            return alert(params);

            function submit(ev) {
                var fn = params.callback || callback;

                close();

                if (typeof fn === 'function') {
                    return fn($(ev.currentTarget).html() === 'Cancel' ? null : $modal.find('input').val());
                }

                throw new Error('No callback provided to execute prompt modal action.');
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
            return $modal.off('hide.bs.modal').modal('hide');
        }
        //#endregion

        //#region Private Logic
        function build(message) {

            $modal.find('.modal-content')
               .append(message);

            return $modal.modal(options);
        }

        function getModalInstance() {
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
            }

            return $modal;

            function createModalElement() {
                /// <summary></summary>
                /// <returns type="jQuery object"></returns>

                return $('<div class="modal fade" tabindex="-1">'
                + '<div class=modal-dialog>'
                + '<div class=modal-content>'
                + ' <div class=modal-header><button type=button class="x close" data-dismiss=modal><span aria-hidden=true>&times;</span><span class=sr-only>Close</span></button><h4 class=modal-title></h4></div>'
                + '</div>'
                + '</div>'
                + '</div>')
                .on('hidden.bs.modal', recycleModal)
                .on('click', 'button.x', function (ev) {
                    var btn = $(ev.currentTarget);

                    if (btn.prop('type') !== 'submit')
                        return close();

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

        function getFooter(buttons) {
            /// <summary></summary>
            /// <returns type=""></returns>

            if (buttons === false) { return ''; }

            var messageFotter = $(div).addClass('modal-footer').prop('id', footerId);
            if (buttons) {
                for (var i = 0, k = buttons.length; i < k; i++) {
                    var btnOp = buttons[i];
                    var btn = $('<button>').addClass('btn btn-' + (btnOp.style || 'info'));

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
                                case 'click':
                                    //click event
                                    btn.click(btnOp.click);
                                    break;
                                case 'text':
                                    btn.html(btnOp[index]);
                                    break;
                                default:
                                    //all other possible html attributes to button element
                                    btn.attr(index, btnOp[index]);
                            }
                        }
                    }

                    messageFotter.append(btn);
                }
            } else {
                //if no buttons defined by user, add a standard close button.
                messageFotter.append('<button class="x btn btn-info" data-dismiss=modal type=button>Close</button>');
            }
            return messageFotter;
        }

        function getMessage(params) {
            /// <summary></summary>
            /// <param name="params"></param>
            /// <returns type=""></returns>

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

        function recycleModal() {
            /// <summary>
            /// Move content to recycle bin if is a DOM object defined by user,
            /// delete itar if is a simple string message.
            /// All modal messages can be deleted if default setting "allowContentRecycle" = false.
            /// </summary>

            if (!$modal) return $modal;

            var $content = $modal.find('.' + recModalContent).removeClass(recModalContent)
                   .appendTo('#' + bin);

            $modal
                .off('hide.bs.modal')
                .find('.modal-content > div:not(:first-child)')
                .remove();

            if (!defaultSettings.allowContentRecycle || lastParams.clone) {
                $content.remove();
            }

            return $modal;

            // closeOpenPopover();
            // closeOpenTooltips);
        }

        function setup(params, title) {
            /// <summary></summary>
            /// <param name='params'></param>
            /// <param name='title'></param>
            /// <returns type=''></returns>

            if (!params) throw new Error('Invalid parameters!');

            recycleModal();
            lastParams = params;

            // Lazy loading
            var $ref = getModalInstance();

            //#region change size
            $ref.find('.modal-dialog')
                .removeClass('modal-sm modal-lg')
                .addClass(params.size ? 'modal-' + params.size : defaultSettings.size);
            //#endregion

            //#region change title
            $ref.find('.modal-title')
                .html((params.title || title || defaultSettings.title) + ' ')
                .append($('<small>').html(params.subtitle || ''));
            //#endregion

            $ref.on('hide.bs.modal', params.onHide);
            return $ref;
        }
        //#endregion
    });

}(typeof define == 'function' && define.amd ? define : function (n, t) {
    typeof window.module != 'undefined' && window.module.exports ?
        window.module.exports = t(window.require(n[0])) :
        window.eModal = t(window.jQuery);
}));
