import Config  from './config';
import Finder  from './finder';
import Grep  from './grep';

export default class Linter {
  constructor(path) {
    this.path = path || 'C:/Users/NG52D87/github/greplint/test/fixtures'
    this.results = new Map()
    this.finder = new Finder()
    this.grep = new Grep()
  }

  lint(){
    this.finder.find(this.path, this._foundDirs.bind(this))
  }

  _foundDirs(err, subdirs) {
    if (err) throw err;
    [this.path].concat(subdirs).forEach((path) => {
      let config = new Config(path)
      if (config.data.rules.todo) {
        if (this.results.get(path) === undefined) {
          this.results.set(path, new Array())
        }

        const text = `"${config.data.rules.todo.join('|')}"`
        const lines = new Grep().find(text, path);
        this._grepResults(path, lines)
      }
    })
  }

  _grepResults(path, cmd) {
    cmd.stdout.on('data', (data) => {
      const lines = this.results.get(path);
      lines.push(data)
      this.results.set(path, lines)
    });

    cmd.stderr.on('data', (data) => {
      const lines = this.results.get(path);
      lines.push(data)
      this.results.set(path, lines)
    });

    cmd.on('close', (code) => {
      console.log('==> child process exited with code ' + code);
      console.log(this.results);
    });

    cmd.on('error', (err) => {
      console.log('==> Failed to start child process ' + err);
    });
  }
}
