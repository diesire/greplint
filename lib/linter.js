'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _bragi = require('bragi');

var _bragi2 = _interopRequireDefault(_bragi);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _finder = require('./finder');

var _finder2 = _interopRequireDefault(_finder);

var _grep = require('./grep');

var _grep2 = _interopRequireDefault(_grep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Linter = function () {
  function Linter(pathname) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Linter);

    _bragi2.default.options.groupsEnabled = options.groupsEnabled || false;
    _bragi2.default.options.groupsDisabled = options.groupsDisabled || true;

    this.pathname = pathname;
    this.options = options;
    this.finder = new _finder2.default(this.options);
    this.grep = new _grep2.default(this.options);
  }

  _createClass(Linter, [{
    key: 'lint',
    value: function lint(grepExpression) {
      var _this = this;

      this.grepExpression = grepExpression;
      return this.finder.find(this.pathname).then(function (values) {
        return _this.grepDirs([_this.pathname].concat(values));
      }).catch(function (err) {
        return Promise.reject('Linter#lint error ' + err);
      });
    }
  }, {
    key: 'grepDirs',
    value: function grepDirs(pathnames) {
      var _this2 = this;

      _bragi2.default.log('Linter', 'grepDirs on ' + pathnames);
      return Promise.all(pathnames.map(function (pathname) {
        return _this2.grepDir(pathname);
      })).then(function (values) {
        var filtered = values.reduce(function (a, b) {
          return a.concat(b);
        }, []);
        _bragi2.default.log('Linter', 'matches found', filtered);
        return filtered;
      });
    }

    /**
    * @return {Object}
    */

  }, {
    key: 'grepDir',
    value: function grepDir(pathname) {
      _bragi2.default.log('Linter:grepDir', 'working on ' + pathname);
      var dirname = pathname;
      var basename = undefined;
      var config = undefined;
      var grepExpression = this.grepExpression;

      if (_fs2.default.statSync(pathname).isFile()) {
        var parse = _path2.default.parse(pathname);
        dirname = parse.dir;
        basename = parse.base;
        _bragi2.default.log('Linter:grepDir', 'file detected');
      }

      _bragi2.default.log('Linter:grepDir:debug', 'paths', dirname, basename);

      if (!grepExpression) {
        _bragi2.default.log('Linter:grepDir:debug', 'looking config file');
        config = new _config2.default(pathname, this.options);
        if (config.data.rules.todo) {
          grepExpression = '' + config.data.rules.todo.join('|');
        }
      }

      if (grepExpression) {
        _bragi2.default.log('Linter:grepDir:debug', 'params', grepExpression, dirname, basename);
        return this.grep.find(grepExpression, dirname, basename).then(function (lines) {
          _bragi2.default.log('Linter:grepDir', 'found lines', lines);
          return Promise.resolve(lines);
        }).catch(function (err) {
          return Promise.reject('Linter#grepDir error ' + err);
        });
      }

      _bragi2.default.log('warning:Linter', 'incorrect grep expression');
      return Promise.resolve([]);
    }
  }]);

  return Linter;
}();

exports.default = Linter;
//# sourceMappingURL=linter.js.map