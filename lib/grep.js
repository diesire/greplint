'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _shelljsNodecli = require('shelljs-nodecli');

var _shelljsNodecli2 = _interopRequireDefault(_shelljsNodecli);

var _ackmateParser = require('./ackmate-parser');

var _ackmateParser2 = _interopRequireDefault(_ackmateParser);

var _bragi = require('bragi');

var _bragi2 = _interopRequireDefault(_bragi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Grep = function () {
  function Grep() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Grep);

    _bragi2.default.options.groupsEnabled = options.groupsEnabled || false;
    _bragi2.default.options.groupsDisabled = options.groupsDisabled || true;

    this.options = options;
  }

  _createClass(Grep, [{
    key: 'find',
    value: function find(text, basepath) {
      var _this = this;

      var filename = arguments.length <= 2 || arguments[2] === undefined ? '*.*' : arguments[2];

      return new Promise(function (resolve, reject) {
        var lines = [];
        var stream = (0, _ackmateParser2.default)(_this.options);

        var options = ' --ackmate -G ' + filename + ' -d */* -i "' + text + '" ' + basepath;
        _bragi2.default.log('Grep', 'running command nak', options);
        var cmd = _shelljsNodecli2.default.exec('nak', options, { async: true, silent: true });

        cmd.stdout.pipe(stream);

        cmd.stdout.on('data', function (data) {
          _bragi2.default.log('Grep:stdout:data', '', data);
        });

        cmd.stderr.on('data', function (data) {
          _bragi2.default.log('Grep:stderr:data', '', data);
        });

        stream.on('data', function (data) {
          _bragi2.default.log('Grep:parser:data', 'match', data);
          if (data.lineNumber && data.value) {
            data.filename = _path2.default.resolve(data.filename);
            lines.push(data);
            // logger.log('Grep parser:data', 'pushed', lines)
          }
        }).on('end', function () {
          _bragi2.default.log('Grep:parser:end', 'lines', lines);
        }).on('close', function (code) {
          _bragi2.default.log('Grep:parser:close');
          _bragi2.default.log('Grep:parser:close', 'code', code);
          resolve(lines);
        }).on('error', function (err) {
          reject('Grep#find parser error ' + err);
        });

        cmd.on('error', function (err) {
          reject('Grep#find process error ' + err);
        });
        cmd.on('close', function (code) {
          _bragi2.default.log('Grep:process:close');
          // logger.log('Grep process close', 'code', code)
          resolve(lines);
        });
      });
    }
  }]);

  return Grep;
}();

exports.default = Grep;
//# sourceMappingURL=grep.js.map