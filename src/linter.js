import path from 'path'
import fs from 'fs'
import npmlog from 'npmlog'

import Config from './config'
import Finder from './finder'
import Grep from './grep'


export default class Linter {
  constructor(pathname, options = {}) {
    this.pathname = pathname
    this.options = options
    this.finder = new Finder()
    this.grep = new Grep(options)

    npmlog.heading = 'greplint'
    npmlog.level = options.verbose? 'silly': 'error'
    npmlog.verbose('Linter', `running on ${pathname}`)
    npmlog.verbose('Linter', `with options`, options)
  }

  lint() {
    const dirs = this.finder.find(this.pathname)
    return dirs
      .then(values => this.grepDirs([this.pathname].concat(values)))
      .catch(err => Promise.reject(`Linter#lint error ${err}`))
  }

  grepDirs(pathnames) {
    // return Promise.all(pathnames.map(pathname => this.grepDir(pathname)))
    // .then(values => {
    //   const filtered =  values.reduce((a, b) => {
    //     return a.concat(b)
    //   }, [])
    //   npmlog.verbose('Linter', `matches found`, filtered)
    //   return filtered
    // });
    const theOne = pathnames.reduce((previous, pathname) => {
      npmlog.verbose('Linter', `theOne 1`)
      return previous
        .then(results => {
          npmlog.verbose('Linter', `theOne 1111`)
          this.grepDir(pathname).then(values => {
            npmlog.verbose('Linter', `theOne 11111111`, pathname)
            Promise.resolve(results.concat(values))
          })
        })
        .catch(err => {
          Promise.reject(err)
        })
    }, Promise.resolve([]))

    theOne
      .then(values => npmlog.verbose('Linter', `matches found`, values))
      .catch(err => {
        npmlog.error('Linter', `err`, err)
        Promise.reject(err)
      })
  }

  /**
  * @return {Object}
  */
  grepDir(pathname) {
    npmlog.verbose('Linter', `working on ${pathname}`)
    const config = new Config(pathname)
    let dirname = pathname
    let basename = undefined

    if (fs.statSync(pathname).isFile()) {
      const parse = path.parse(pathname)
      dirname = parse.dir
      basename = parse.base
      npmlog.verbose('Linter', `file detected`)
    }

    // console.log(dirname, basename);

    if (config.data.rules.todo) {
      const grepExpresion = `"${config.data.rules.todo.join('|')}"`
      return this.grep.find(grepExpresion, dirname, basename)
        .then(lines => {
          return Promise.resolve(lines)
        })
        .catch(err => Promise.reject(`Linter#grepDir error ${err}`))
    }

    npmlog.warning('Linter', `incorrect config data`)
    return Promise.resolve([])
  }
}
