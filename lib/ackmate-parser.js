'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); //From https://github.com/alexgorbatchev/ackmate-parser/blob/master/lib/ackmate-parser.js

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

var _bragi = require('bragi');

var _bragi2 = _interopRequireDefault(_bragi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  _bragi2.default.options.groupsEnabled = options.groupsEnabled || false;
  _bragi2.default.options.groupsDisabled = options.groupsDisabled || true;

  var surroundLine = /^(\d+):(.*)$/;
  var matchLine = /^(\d+);(\d+) (\d+):(.*)$/;
  var matchComposeLine = /^(\d+);(\d+ \d+(?:,\d+ \d+)*):(.*)$/;
  var emptyLine = /^\s*$/;
  var newline = /\n|\r\n/;
  var stream = _through2.default.obj(transform, flush);
  var filename = null;
  var tail = null;

  function push(data) {
    return stream.push(data);
  }

  function processLine(line) {
    var index = undefined,
        length = undefined,
        lineNumber = undefined,
        matches = undefined,
        value = undefined;

    if (line[0] === ':') {
      _bragi2.default.log('Parser:processLine', 'case filename only');
      filename = line.slice(1);
    } else if (matches = line.match(surroundLine)) {
      _bragi2.default.log('Parser:processLine', 'case surroundLine');
      var _matches = matches;

      var _matches2 = _slicedToArray(_matches, 3);

      var _lineNumber = _matches2[1];
      var _value = _matches2[2];

      push({
        filename: filename,
        lineNumber: _lineNumber,
        value: _value
      });
    } else if (matches = line.match(matchComposeLine)) {
      (function () {
        _bragi2.default.log('Parser:processLine', 'case matchComposeLine');
        _bragi2.default.log('Parser:processLine:debug', matches);
        var _matches3 = matches;

        var _matches4 = _slicedToArray(_matches3, 4);

        var lineNumber = _matches4[1];
        var pairStr = _matches4[2];
        var value = _matches4[3];

        var pairs = pairStr.split(',');
        pairs.forEach(function (pair) {
          var _pair$split = pair.split(' ');

          var _pair$split2 = _slicedToArray(_pair$split, 2);

          var index = _pair$split2[0];
          var length = _pair$split2[1];

          push({
            filename: filename,
            lineNumber: lineNumber,
            index: index,
            length: length,
            value: value
          });
        });
      })();
    } else if (emptyLine.test(line)) {
      _bragi2.default.log('Parser:processLine', 'empty line');
    } else {
      _bragi2.default.log('Parser:processLine', 'unhandled case');
      _bragi2.default.log('Parser:processLine:debug', line);
      stream.emit('error', new Error('Invalid case'));
    }
  }

  function transform(data, encoding, callback) {
    var hasTail = undefined,
        line = undefined,
        lines = undefined,
        _len = undefined;

    _bragi2.default.log('Parser:transform:debug', data.toString());

    data = data.toString();
    if (tail != null) {
      data = tail + data;
    }
    // hasTail = data[data.length - 1] !== '\n'
    hasTail = !newline.test(data[data.length - 1]);
    lines = data.split(newline);
    tail = hasTail && lines.pop() || null;
    lines.forEach(function (line) {
      return processLine(line);
    });
    return callback();
  }

  function flush(callback) {
    if (tail != null) {
      _bragi2.default.log('Parser:flush:debug', 'tail', tail);
      processLine(tail);
    }
    _bragi2.default.log('Parser:flush:debug');
    return callback();
  }

  return stream;
};
//# sourceMappingURL=ackmate-parser.js.map