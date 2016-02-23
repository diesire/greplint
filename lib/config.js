'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _rcfinder = require('rcfinder');

var _rcfinder2 = _interopRequireDefault(_rcfinder);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _bragi = require('bragi');

var _bragi2 = _interopRequireDefault(_bragi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Config = function Config(dirname) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Config);

    _assert2.default.equal(typeof dirname === 'undefined' ? 'undefined' : _typeof(dirname), 'string', "argument 'dirname' must be a string");

    _bragi2.default.options.groupsEnabled = options.groupsEnabled || false;
    _bragi2.default.options.groupsDisabled = options.groupsDisabled || true;

    this.dirname = dirname;
    this.data = null;
    var rcFinder = new _rcfinder2.default('.greplintrc');
    // TODO: make it async
    this.data = rcFinder.find(this.dirname);

    _bragi2.default.log('Config', 'looking for config file on ' + this.dirname);
    _bragi2.default.log('Config', 'config found', this.data);
};

exports.default = Config;
//# sourceMappingURL=config.js.map