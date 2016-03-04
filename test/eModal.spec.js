describe('BS eModal', function () {
    it('eModal is defined', ()=> expect(eModal).to.exist);

    //API
    it('exists alert',   ()=> expect(eModal.alert).to.exist);       // TODO:
    it('exists ajax',    ()=> expect(eModal.ajax).to.exist);        // TODO:
    it('exists confirm', ()=> expect(eModal.confirm).to.exist);     // TODO:
    it('exists prompt',  ()=> expect(eModal.prompt).to.exist);      // TODO:
    it('exists iframe',  ()=> expect(eModal.iframe).to.exist);      // TODO:

    it('Close', function (done) {
        eModal.alert('This should be closed!');

        var element = eModal.close();

        setTimeout(function () {
            var isVisible = element.prop('style').display !== 'none';
            expect(isVisible).to.be.false;
            done();
        }, 1000);
    });

    it('Message created as first argument string', function () {
        var message = 'Message created by first argument';
        var messageInModal = eModal.alert(message)
            .element
            .find('.modal-body')
            .text()
            .trim();

        assert.ok(messageInModal === message);
    });

    it('Title created as second argument string', function () {
        var title = 'title text';
        var titleInModal = eModal
            .alert(001, title)
            .element
            .find('.modal-title')
            .text()
            .trim();

        eModal.close();
        assert.ok(titleInModal === title);
    });

    it('Dump DOM element', function (done) {
        var message = $('<div id=binY />');

        eModal.alert(message);
        eModal.close();

        setTimeout(function () {
            assert.ok($('#binY').length === 0);
            done();
        }, 1000);
    });

    it('Recycle DOM element', function (done) {
        var message = $('<div id=binX />');

        eModal.alert({
            message: message,
            useBin: true
        });

        eModal.close();

        setTimeout(function () {
            assert.ok($('#binX').length > 0);
            done();
        }, 1000);
    });
});
