$(document).ready(function () {/* activate scrollspy menu */

    var hashTimer;

    /* smooth scrolling sections */
    $('#navbar-collapsible li')
        .on('activate.bs.scrollspy', function () {

            var el = this;
            clearTimeout(hashTimer);
            hashTimer = setTimeout(function () {

                var hash = $(el).find('a').get(0).hash;
                var $el = $(hash).prop('id', '');

                window.location.hash = hash;
                $el.prop('id', hash.slice(1));
            }, 400);
        })
        .find('a[href*=#]:not([href=#])').click(function (e) {
            e.preventDefault();
            var hash = this.hash;

            if (hash != location.hash) {
                var scroll = $(this.hash).offset().top - 50 + $('#main').scrollTop();

                $('#main').stop().animate({
                    scrollTop: scroll
                }, 1000);
            }
        });


    $('.glyphicon-cloud').click(ajaxRequest);

    $('.glyphicon-comment').click(function () {
        eModal.alert('You welcome! Want clean code ?', 'Alert modal');
    });

    $('.glyphicon-screenshot').click(function () {
        eModal.iframe({
            url: 'https://www.youtube.com/embed/VTkvN51OPfI',
            //    size: eModal.size.sm,
            title: 'Insiders'
        });
    });

    $('.glyphicon-ok').click(function () {
        eModal.confirm('It is simple enough?', 'Confirm modal', function (bool) {
            var title = 'Confirm modal callback feedback';
            return bool
                ? toastr8.success('Thank you for your OK pressed!', title)
                : toastr8.error('Thank you for your Cancel pressed!', title);
        });
    });

    $('.glyphicon-pencil').click(function () {
        eModal.prompt({
            size: 'sm', message: 'What\'s your name?', title: 'Prompt modal', callback: function (name) {

                var title = 'Prompt modal callback feedback';
                return name
                    ? toastr8.github({ message: 'Hi ' + name + '!', title: title, imgURI: 'https://avatars0.githubusercontent.com/u/4276775?v=3&s=89' })
                    : toastr8.android('Prompt dismissed!', title);
            }
        });
    });

    //$("[title]").tooltip();

    function ajaxRequest() {
        eModal.ajax({
            size: 'lg',
            url: 'http://maispc.com/app/proxy.php?url=http://loripsum.net/api/' + Math.floor((Math.random() * 7) + 1) + '/short/ul/bq/prude/code/decorete',
            buttons: [
                { text: 'Close', close: true, style: 'danger' },
                { text: 'New contenet', close: false, style: 'success', click: ajaxRequest }
            ]
        }, 'Ajax modal');
    }
});