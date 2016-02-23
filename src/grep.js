import path from 'path'
import nodeCLI from 'shelljs-nodecli'
import ackmateParser from './ackmate-parser'
import logger from 'bragi'

export default class Grep {
  constructor(options = {}) {
    logger.options.groupsEnabled = options.groupsEnabled || false
    logger.options.groupsDisabled = options.groupsDisabled || true

    this.options = options
  }

  find(text, basepath, filename = '*.*') {
    return new Promise((resolve, reject) => {
      let lines = []
      const stream = ackmateParser(this.options)

      const options = ` --ackmate -G ${filename} -d */* -i "${text}" ${basepath}`
      logger.log('Grep', `running command nak`, options)
      const cmd = nodeCLI.exec('nak', options, {async: true, silent: true})

      cmd.stdout.pipe(stream)

      cmd.stdout.on('data', data => {
        logger.log('Grep:stdout:data', '', data)
      })

      cmd.stderr.on('data', data => {
        logger.log('Grep:stderr:data', '', data)
      })

      stream.on('data', data => {
        logger.log('Grep:parser:data', 'match', data)
        if (data.lineNumber && data.value) {
          data.filename = path.resolve(data.filename)
          lines.push(data)
        // logger.log('Grep parser:data', 'pushed', lines)
        }
      })
        .on('end', () => {
          logger.log('Grep:parser:end', 'lines', lines)
        })
        .on('close', code => {
          logger.log('Grep:parser:close')
          logger.log('Grep:parser:close', 'code', code)
          resolve(lines)
        })
        .on('error', err => {
          reject(`Grep#find parser error ${err}`)
        })

      cmd.on('error', err => {
        reject(`Grep#find process error ${err}`)
      })
      cmd.on('close', code => {
        logger.log('Grep:process:close')
        // logger.log('Grep process close', 'code', code)
        resolve(lines)
      })
    })
  }
}
