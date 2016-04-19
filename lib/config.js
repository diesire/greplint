'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rcfinder = require('rcfinder');

var _rcfinder2 = _interopRequireDefault(_rcfinder);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _bragi = require('bragi');

var _bragi2 = _interopRequireDefault(_bragi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CONFIG_FILE_NAME = '.greplintrc';

var Config = function () {
  function Config(dirname) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Config);

    _assert2.default.equal(typeof dirname === 'undefined' ? 'undefined' : _typeof(dirname), 'string', "argument 'dirname' must be a string");

    _bragi2.default.options.groupsEnabled = options.groupsEnabled || false;
    _bragi2.default.options.groupsDisabled = options.groupsDisabled || true;

    this.dirname = dirname;
    this.rules = [];

    _bragi2.default.log('Config', 'looking for config file on ' + this.dirname);
  }

  _createClass(Config, [{
    key: 'load',
    value: function load() {
      var rcFinder = new _rcfinder2.default(CONFIG_FILE_NAME);
      // TODO: make it async
      var data = rcFinder.find(this.dirname);
      _bragi2.default.log('Config', 'config found', data);

      var parsed = Config.parse(data);
      this.rules = parsed.rules;

      return this;
    }
  }], [{
    key: 'parse',
    value: function parse(data) {
      var result = {
        rules: []
      };

      if (!data) {
        return result;
      }

      if (Array.isArray(data.rules)) {
        result.rules = data.rules;
      } else if (data.rules != undefined && _typeof(data.rules) == 'object') {
        result.rules.push(data.rules);
      }
      // undefined or null => skip

      return result;
    }
  }]);

  return Config;
}();

exports.default = Config;
//# sourceMappingURL=config.js.map