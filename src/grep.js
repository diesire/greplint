import nodeCLI from 'shelljs-nodecli'
import ackmateParser from './ackmate-parser'
import npmlog from 'npmlog'

export default class Grep {
  constructor(options = {}) {
    this.options = options
    npmlog.level = options.verbose? 'silly': 'error'
  }

  find(text, path, filename = '*.*') {
    return new Promise((resolve, reject) => {
      let lines = []
      const stream = ackmateParser(this.options)

      const options = ` --ackmate -G ${filename} -d */* -i ${text} ${path}`
      npmlog.verbose('Grep', `running command nak`, options)
      const cmd = nodeCLI.exec("nak", options, {async:true, silent:true});

      cmd.stdout.pipe(stream)

      cmd.stdout.on('data', data => {
        npmlog.warn('Grep stdout:data', '', data)
      })

      cmd.stderr.on('data', data => {
        npmlog.warning('Grep stderr:data', '', data)
      })

      stream.on('data', data => {
        npmlog.silly('Grep parser:data', 'match', data)
        if (data.lineNumber && data.value) {
          lines.push(data)
          // npmlog.silly('Grep parser:data', 'pushed', lines)
        }
      })
      .on('end', () => {
        npmlog.silly('Grep parser:end', 'lines', lines)
      })
      .on('close', code => {
        npmlog.warn('Grep parser close')
        npmlog.silly('Grep parser close', 'code', code)
        resolve(lines)
      })
      .on('error', err => {
        reject(`Grep#find parser error ${err}`)
      })

      cmd.on('error', err => {
        reject(`Grep#find process error ${err}`)
      })
      cmd.on('close', code => {
        npmlog.warn('Grep process close')
        // npmlog.silly('Grep process close', 'code', code)
        resolve(lines)
      })
    })
  }
}
