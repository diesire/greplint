import commander from 'commander'
import chalk from 'chalk'

import pack from '../package.json'
import Greplint from '../lib/index'
import npmlog from 'npmlog'

export default class Cli {
  constructor() {
    this._program = commander
    this._program.version(`${pack.version}`)
      .description(`${pack.description}`)
      .usage(`<path>`)
      .option('-C, --no-color', 'Uncolorize output')
      .option('--verbose', 'Verbose mode')
      .action(path => {
        npmlog.heading = 'greplint'
        npmlog.level = this._program.verbose? 'verbose': 'error'
        npmlog.verbose('CLI', `running on`, path)
        npmlog.verbose('CLI', `with options`, this._program.opts())

        new Greplint(path, {verbose: this._program.verbose}).lint()
          .then(values => {
            values.forEach(value => this.prettyprint(value))
          }, this)
          .catch(err => npmlog.error('CLI', err))
      })
  }

  prettyprint(found) {
    const _chalk = new chalk.constructor({enabled: this._program.color ? true : false})
    const filename = _chalk.red(`${found.filename}:`)
    const lineCol = _chalk.gray(`line ${found.lineNumber}, col ${found.index},`)
    const source = _chalk.blue(`${found.value}`)

    npmlog.info('CLI', filename, lineCol, source)
  }

  run(args) {
    if (args.length === 2) {
      this._program.help()
    }
    this._program.parse(args)
  }
}
