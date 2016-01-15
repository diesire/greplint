//From https://github.com/alexgorbatchev/ackmate-parser/blob/master/lib/ackmate-parser.js

import through2 from 'through2'
import npmlog from 'npmlog'

export default (options = {}) => {
  const surroundLine = /^(\d+):(.*)$/
  const matchLine = /^(\d+);(\d+) (\d+):(.*)$/
  const matchComposeLine = /^(\d+);(\d+ \d+(?:,\d+ \d+)*):(.*)$/
  const emptyLine = /^\s*$/
  let stream = through2.obj(transform, flush)
  let filename = null
  let tail = null

  npmlog.level = options.verbose? 'silly': 'error'

  function push(data) {
    return stream.push(data)
  }

  function processLine (line) {
      let index, length, lineNumber, matches, value

      if (line[0] === ':') {
        npmlog.silly('ackmate-parser:processLine', `case only filename`)
        filename = line.slice(1)
      } else if (matches = line.match(surroundLine)) {
        npmlog.silly('ackmate-parser:processLine', `case surroundLine`)
        const [,lineNumber, value] = matches
        push({
          filename,
          lineNumber,
          value
        })
      } else if (matches = line.match(matchComposeLine)) {
        npmlog.silly('ackmate-parser:processLine', `case matchComposeLine`, matches)
        const [,lineNumber, pairStr, value] = matches
        const pairs = pairStr.split(',')
        pairs.forEach(pair => {
          const [index, length] = pair.split(' ')
          push({
            filename,
            lineNumber,
            index,
            length,
            value
          })
        })
      } else if (emptyLine.test(line)) {
        npmlog.silly('ackmate-parser:processLine', `empty line`)
      } else {
        npmlog.error('ackmate-parser:processLine', `unhandled case`, line)
        stream.emit('error', new Error('Invalid case'))
      }
    }

  function transform(data, encoding, callback) {
    let hasTail, line, lines, _len

    npmlog.verbose('ackmate-parser:transform', data.toString())

    data = data.toString();
    if (tail != null) {
      data = tail + data;
    }
    hasTail = data[data.length - 1] !== '\n';
    lines = data.split('\n');
    tail = hasTail && lines.pop() || null;
    lines.forEach(line => processLine(line))
    return callback();
  }

  function flush(callback) {
    if (tail != null) {
      npmlog.silly('ackmate-parser:flush', `tail`, tail)
      processLine(tail);
    }
    npmlog.silly('ackmate-parser:flush')
    return callback();
  }

  return stream
}
