'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nodeDir = require('node-dir');

var _nodeDir2 = _interopRequireDefault(_nodeDir);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _bragi = require('bragi');

var _bragi2 = _interopRequireDefault(_bragi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Finder = function () {
  function Finder() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Finder);

    _bragi2.default.options.groupsEnabled = options.groupsEnabled || false;
    _bragi2.default.options.groupsDisabled = options.groupsDisabled || true;

    this.options = options;
  }

  _createClass(Finder, [{
    key: 'find',
    value: function find(path) {
      var _this = this;

      _bragi2.default.log('Finder', 'searching directories on ' + path);

      if (_fs2.default.statSync(path).isFile()) {
        _bragi2.default.log('Finder', 'file detected');
        return Promise.resolve([]);
      }

      return new Promise(function (resolve, reject) {
        _nodeDir2.default.subdirs(path, function (err, subdirs) {
          _this.setSubDirs(err, subdirs, resolve, reject);
        });
      });
    }
  }, {
    key: 'setSubDirs',
    value: function setSubDirs(err, subdirs, resolve, reject) {
      if (err) return reject('Finder#setSubDirs error ' + err);

      _bragi2.default.log('Finder', 'dirs found', subdirs);
      return resolve(subdirs);
    }
  }]);

  return Finder;
}();

exports.default = Finder;
//# sourceMappingURL=finder.js.map