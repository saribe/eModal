var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dom = new JSDOM('<html></html>');
const win = dom.window;
global.document = win.document;
global.window = win;

global.Node = win.Node;
global.$ = global.jquery = global.jQuery = require('jquery');

chai = require('chai');
assert = chai.assert;
expect = chai.expect;

require('bootstrap');
require('../dist/eModal.js');

require('./eModal.spec.js');
