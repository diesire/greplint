import RcFinder from 'rcfinder'
import assert from 'assert'

export default class Config {
  constructor(dirname) {
    assert.equal(typeof (dirname), 'string',
      "argument 'dirname' must be a string");

    this.dirname = dirname;
    this.data = null;

    const rcFinder = new RcFinder('.greplintrc')

    //TODO: make it async
    this.data = rcFinder.find(this.dirname)
  }
}
