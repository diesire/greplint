import path from 'path'
import fs from 'fs'
import logger from 'bragi'

import Config from './config'
import Finder from './finder'
import Grep from './grep'


export default class Linter {
  constructor(pathname, options = {}) {
    logger.options.groupsEnabled = options.groupsEnabled || false
    logger.options.groupsDisabled = options.groupsDisabled || true

    this.pathname = pathname
    this.options = options
    this.finder = new Finder(this.options)
    this.grep = new Grep(this.options)
  }

  lint(grepExpression) {
    this.grepExpression = grepExpression
    return this.finder.find(this.pathname)
      .then(values => this.grepDirs([this.pathname].concat(values)))
      .catch(err => Promise.reject(`Linter#lint error ${err}`))
  }

  grepDirs(pathnames) {
    logger.log('Linter', `grepDirs on ${pathnames}`)
    return Promise.all(pathnames.map(pathname => this.grepDir(pathname)))
    .then(values => {
      const filtered =  values.reduce((a, b) => {
        return a.concat(b)
      }, [])
      logger.log('Linter', `matches found`, filtered)
      return filtered
    })
  }

  /**
  * @return {Object}
  */
  grepDir(pathname) {
    const config = new Config(pathname)
    logger.log('Linter:grepDir', `working on ${pathname}`)
    let dirname = pathname
    let basename = undefined

    if (fs.statSync(pathname).isFile()) {
      const parse = path.parse(pathname)
      dirname = parse.dir
      basename = parse.base
      logger.log('Linter:grepDir', `file detected`)
    }

    logger.log('Linter:grepDir:debug', 'paths', dirname, basename)

    if (config.data.rules.todo) {
      const grepExpresion = `"${config.data.rules.todo.join('|')}"`
      return this.grep.find(grepExpresion, dirname, basename)
        .then(lines => {
          return Promise.resolve(lines)
        })
        .catch(err => Promise.reject(`Linter#grepDir error ${err}`))
    }

    logger.log('warning:Linter', `incorrect grep expression`)
    return Promise.resolve([])
  }
}
