import RcFinder from 'rcfinder'
import assert from 'assert'
import logger from 'bragi'

const CONFIG_FILE_NAME = '.greplintrc'

export default class Config {
  constructor(dirname, options = {}) {
    assert.equal(typeof (dirname), 'string',
      "argument 'dirname' must be a string")

    logger.options.groupsEnabled = options.groupsEnabled || false
    logger.options.groupsDisabled = options.groupsDisabled || true

    this.dirname = dirname
    this.rules = []

    logger.log('Config', `looking for config file on ${this.dirname}`)
  }

  load() {
    const rcFinder = new RcFinder(CONFIG_FILE_NAME)
    // TODO: make it async
    const data = rcFinder.find(this.dirname)
    logger.log('Config', `config found`, data)

    const parsed = Config.parse(data)
    this.rules = parsed.rules

    return this
  }

  static parse(data) {
    const result = {
      rules: []
    }

    if (!data) {
      return result
    }

    if (Array.isArray(data.rules)) {
      result.rules = data.rules
    } else if (data.rules != undefined && typeof data.rules == 'object') {
      result.rules.push(data.rules)
    }
    // undefined or null => skip

    return result
  }
}
