var p = "Passed!";

QUnit.test("eModal", function (assert) {
    assert.ok(eModal, p);
});

QUnit.test("eModal.alert function", function (assert) {
    assert.ok(eModal.alert, p);
});

QUnit.test("eModal.ajax function", function (assert) {
    assert.ok(eModal.ajax, p);
});

QUnit.test("eModal.confirm function", function (assert) {
    assert.ok(eModal.confirm, p);
});

QUnit.test("eModal.prompt function", function (assert) {
    assert.ok(eModal.prompt, p);
});

QUnit.test("Message created by first agument", function (assert) {
    var message = "Message created by first agument";
    var c = eModal.alert(message);

    assert.ok(c.find(".modal-body").text().trim() == message, p);
});

QUnit.test("Title created by second agument", function (assert) {
    var message = "Title created by second agument";
    var title = "title text";
    var c = eModal.alert(message, title);

    assert.ok(c.find(".modal-title").text().trim() == title, p);
});

QUnit.test("Dump DOM element", function (assert) {
    var message = $("<div id=binY />");
    var done = assert.async();
    eModal.alert(message).find(".x:first").click();

    setTimeout(function () {
        assert.ok($("#binY").length == 0, p);
        done();
    }, 1000);
});

QUnit.test("Recycle DOM element", function (assert) {
    var message = $("<div id=binX />");
    var done = assert.async();
    eModal.alert({
        message: message,
        useBin: true
    }).find(".x:first").click();

    setTimeout(function () {
        assert.ok($("#binX").length > 0, p);
        done();
    }, 1000);
});

QUnit.test("Close", function (assert) {
    var message = "This should be closed!";
    var c = eModal.alert(message);

    c.find(".x:first").click();
    assert.ok(!c.find(".modal-title").is(":visible"), p);
});