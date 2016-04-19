'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Rule = function Rule(obj) {
  _classCallCheck(this, Rule);

  var keys = Object.keys(obj);
  _assert2.default.equal(keys.length, 1, 'Invalid rule');
  this.name = keys[0];
  this.value = obj[this.name];
  _assert2.default.equal(Array.isArray(this.value), true, 'Rule value must be an array of strings');
};

exports.default = Rule;
//# sourceMappingURL=rule.js.map