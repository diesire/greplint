import Config from './config';
import Finder from './finder';
import Grep from './grep';

export default class Linter {
  constructor(path) {
    this.path = path
    this.finder = new Finder()
    this.grep = new Grep()
  }

  lint() {
    const dirs = this.finder.find(this.path)
    console.log(dirs);
    return dirs
      .then(values => this.grepDirs([this.path].concat(values)))
      .catch(err => Promise.reject(`Linter#lint error ${err}`))
  }

  grepDirs(paths) {
    return Promise.all(paths.map(path => this.grepDir(path)));
  }

  grepDir(path) {
    const config = new Config(path)
    let grepExpresion = ""
    let matches = ""
    if (config.data.rules.todo) {
      grepExpresion = `"${config.data.rules.todo.join('|')}"`
      return this.grep.find(grepExpresion, path)
      .then(matches => ({path, grepExpresion, matches}))
      // .catch(err => Promise.reject(`Linter#grepDir error ${err}`))
    }
    return Promise.resolve({path, grepExpresion, matches})
  }
}
