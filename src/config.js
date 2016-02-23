import RcFinder from 'rcfinder'
import assert from 'assert'
import logger from 'bragi'

export default class Config {
  constructor(dirname, options = {}) {
    assert.equal(typeof (dirname), 'string',
      "argument 'dirname' must be a string")

    logger.options.groupsEnabled = options.groupsEnabled || false
    logger.options.groupsDisabled = options.groupsDisabled || true

    this.dirname = dirname
    this.data = null
    const rcFinder = new RcFinder('.greplintrc')
    // TODO: make it async
    this.data = rcFinder.find(this.dirname)

    logger.log('Config', `looking for config file on ${this.dirname}`)
    logger.log('Config', `config found`, this.data)
  }
}
