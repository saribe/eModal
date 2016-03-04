var jsdom = require('jsdom').jsdom;
window = jsdom().defaultView;
document = window.document;
jQuery = require('jquery');
$ = jQuery;
chai = require('chai');
assert = chai.assert;
expect = chai.expect;
var bootstrap = require('bootstrap');
var eModal = require('../dist/eModal.js');

require('./eModal.spec.js');
