import assert from 'assert'

export default class Rule {
  constructor(obj) {
    const keys = Object.keys(obj)
    assert.equal(keys.length, 1,'Invalid rule')
    this.name = keys[0]
    this.value = obj[this.name]
    assert.equal(Array.isArray(this.value), true, 'Rule value must be an array of strings')
  }
}
