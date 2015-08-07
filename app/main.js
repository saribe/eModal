$(document).ready(function () {/* activate scrollspy menu */

    var hashTimer;

    /* smooth scrolling sections */
    $('#navbar-collapsible li')
        .on('activate.bs.scrollspy', scrollspy)
        .find('a[href*=#]:not([href=#])')
            .click(hrefClick);

    $('.glyphicon-cloud')       .click(ajaxDemo);
    $('.glyphicon-comment')     .click(alertDemo);
    $('.glyphicon-ok')          .click(confirmDemo);
    $('.glyphicon-pencil')      .click(promptDemo);
    $('.glyphicon-screenshot')  .click(iframeDemo);
    ///////////////////* Implementation *///////////////////


    function ajaxDemo() {
        var title = 'Ajax modal';
        var params = {
            size: 'lg',
            url: 'http://maispc.com/app/proxy.php?url=http://loripsum.net/api/' + Math.floor((Math.random() * 7) + 1) + '/short/ul/bq/prude/code/decorete',
            buttons: [
                { text: 'Close', close: true, style: 'danger' },
                { text: 'New contenet', close: false, style: 'success', click: ajaxDemo }
            ],
            title: title
        };

        return eModal
            .ajax(params)
            .then(function () { toastr8.info('Ajax Request complete!!!!', title) });
    }

    function alertDemo() {
        return eModal.alert('You welcome! Want clean code ?', 'Alert modal');
    }

    function confirmDemo() {
        var title = 'Confirm modal callback feedback';
        return eModal
            .confirm('It is simple enough?', 'Confirm modal')
            .then(function (/*DOM */) { toastr8.success('Thank you for your OK pressed!', title); })
            .catch(function (/*null*/) { toastr8.error('Thank you for your Cancel pressed!', title) });
    }

    function iframeDemo() {
        return eModal
            .iframe('https://www.youtube.com/embed/VTkvN51OPfI', 'Insiders')
            .then(function () { toastr8.success('iFrame loaded!!!!', 'Load complete') });
    }

    function promptDemo() {
        var title = 'Prompt modal callback feedback';
        return eModal
            .prompt({ size: eModal.size.sm, message: 'What\'s your name?', title: title })
            .then(function (input) { toastr8.github({ message: 'Hi ' + input + '!', title: title, imgURI: 'https://avatars0.githubusercontent.com/u/4276775?v=3&s=89' }) })
            .catch(function (input) { toastr8.android('Prompt dismissed by ' + input + '!', title); });
    }

    function hrefClick(e) {
        e.preventDefault();
        var hash = this.hash;

        if (hash != location.hash) {
            var scroll = $(this.hash).offset().top - 50 + $('#main').scrollTop();

            $('#main').stop().animate({
                scrollTop: scroll
            }, 1000);
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
});