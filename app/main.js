$(document).ready(function () {/* activate scrollspy menu */

    var hashTimer;
    var iconPrefix = '.glyphicon-';
    var t8 = window.toastr8;

    /* smooth scrolling sections */
    $('#navbar-collapsible li')
        .on('activate.bs.scrollspy', scrollspy)
        .find('a[href*=#]:not([href=#])')
            .click(hrefClick);

    $(iconPrefix + 'cloud')       .click(ajaxDemo);
    $(iconPrefix + 'comment')     .click(alertDemo);
    $(iconPrefix + 'ok')          .click(confirmDemo);
    $(iconPrefix + 'pencil')      .click(promptDemo);
    $(iconPrefix + 'screenshot')  .click(iframeDemo);
    ///////////////////* Implementation *///////////////////

    // Demos
    function ajaxDemo() {
        var title = 'Ajax modal';
        var params = {
            buttons: [
               { text: 'Close', close: true, style: 'danger' },
               { text: 'New contenet', close: false, style: 'success', click: ajaxDemo }
            ],
            size: eModal.size.lg,
            title: title,
            url: 'http://maispc.com/app/proxy.php?url=http://loripsum.net/api/' + Math.floor((Math.random() * 7) + 1) + '/short/ul/bq/prude/code/decorete'
        };

        return eModal
            .ajax(params)
            .then(function () { t8.info('Ajax Request complete!!!!', title) });
    }

    function alertDemo() {
        var title = 'Alert modal';
        return eModal
            .alert('You welcome! Want clean code ?', title)
            .then(function() { t8.facebook('Alert modal is visible.', title); });
    }

    function confirmDemo() {
        var title = 'Confirm modal callback feedback';
        return eModal
            .confirm('It is simple enough?', 'Confirm modal')
            .then(function (/* DOM */) { t8.success('Thank you for your OK pressed!', title); })
            .fail(function (/*null*/) { t8.skype('Thank you for your Cancel pressed!', title) });
    }

    function iframeDemo() {
        var title = 'Insiders';
        return eModal
            .iframe('https://www.youtube.com/embed/VTkvN51OPfI', title)
            .then(function () { t8.success('iFrame loaded!!!!', title) });
    }

    function promptDemo() {
        var title = 'Prompt modal callback feedback';
        return eModal
            .prompt({ size: eModal.size.sm, message: 'What\'s your name?', title: title })
            .then(function (input) { t8.github({ message: 'Hi ' + input + '!', title: title, imgURI: 'https://avatars0.githubusercontent.com/u/4276775?v=3&s=89' }) })
            .fail(function (/**/) { t8.android('Why don\'t you tell me your name?', title); });
    }

    //#region Page Events
    function hrefClick(e) {
        e.preventDefault();
        var hash = this.hash;

        if (hash !== location.hash) {
            var query = '#main';
            var scroll = $(this.hash).offset().top - 50 + $(query).scrollTop();

            $(query)
                .stop()
                .animate({ scrollTop: scroll }, 1000);
        }
    }

    function scrollspy() {
        var el = this;
        clearTimeout(hashTimer);
        hashTimer = setTimeout(function () {
            var hash = $(el).find('a').get(0).hash;
            var $el = $(hash).prop('id', '');

            window.location.hash = hash;
            $el.prop('id', hash.slice(1));
        }, 400);
    }
    //#endregion
});