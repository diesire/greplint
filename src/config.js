import RcFinder from 'rcfinder'
import assert from 'assert'
import npmlog from 'npmlog'

export default class Config {
  constructor(dirname, options = {}) {
    assert.equal(typeof (dirname), 'string',
      "argument 'dirname' must be a string");

    this.dirname = dirname;
    this.data = null;
    const rcFinder = new RcFinder('.greplintrc')
    //TODO: make it async
    this.data = rcFinder.find(this.dirname)

    npmlog.verbose('Config', `looking for config file on ${this.dirname}`)
    npmlog.verbose('Config', `config found`, this.data)
  }
}
