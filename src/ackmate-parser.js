//From https://github.com/alexgorbatchev/ackmate-parser/blob/master/lib/ackmate-parser.js

import through2 from 'through2'
import logger from 'bragi'

export default (options = {}) => {
  logger.options.groupsEnabled = options.groupsEnabled || false
  logger.options.groupsDisabled = options.groupsDisabled || true

  const surroundLine = /^(\d+):(.*)$/
  const matchLine = /^(\d+);(\d+) (\d+):(.*)$/
  const matchComposeLine = /^(\d+);(\d+ \d+(?:,\d+ \d+)*):(.*)$/
  const emptyLine = /^\s*$/
  const newline = /\n|\r\n/
  let stream = through2.obj(transform, flush)
  let filename = null
  let tail = null

  function push(data) {
    return stream.push(data)
  }

  function processLine (line) {
      let index, length, lineNumber, matches, value

      if (line[0] === ':') {
        logger.log('Parser:processLine', `case filename only`)
        filename = line.slice(1)
      } else if (matches = line.match(surroundLine)) {
        logger.log('Parser:processLine', `case surroundLine`)
        const [,lineNumber, value] = matches
        push({
          filename,
          lineNumber,
          value
        })
      } else if (matches = line.match(matchComposeLine)) {
        logger.log('Parser:processLine', 'case matchComposeLine')
        logger.log('Parser:processLine:debug', matches)
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
        logger.log('Parser:processLine', `empty line`)
      } else {
        logger.log('Parser:processLine', `unhandled case`)
        logger.log('Parser:processLine:debug', line)
        stream.emit('error', new Error('Invalid case'))
      }
    }

  function transform(data, encoding, callback) {
    let hasTail, line, lines, _len

    logger.log('Parser:transform:debug', data.toString())

    data = data.toString()
    if (tail != null) {
      data = tail + data
    }
    // hasTail = data[data.length - 1] !== '\n'
    hasTail = !newline.test(data[data.length - 1])
    lines = data.split(newline)
    tail = hasTail && lines.pop() || null
    lines.forEach(line => processLine(line))
    return callback()
  }

  function flush(callback) {
    if (tail != null) {
      logger.log('Parser:flush:debug', `tail`, tail)
      processLine(tail)
    }
    logger.log('Parser:flush:debug')
    return callback()
  }

  return stream
}
