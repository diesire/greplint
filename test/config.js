// http://jamesknelson.com/testing-in-es6-with-mocha-and-babel-6/

import chai from 'chai'
import path from 'path'
import fs from 'fs'
import Config from '../lib/config'

const should = chai.should()

describe('Config', function () {
  describe('#constructor()', function () {
    it('should return an error when called without params', function () {
      (() => {
        new Config()
      }).should.throw(Error)
    })

    it('should return data', function () {
      const PATH = '../test'
      let config = new Config(PATH)
      config.should.have.property('dirname', PATH)
      config.should.have.property('rules').that.is.empty;
    })
  })

  describe('#load()', function () {
    it('should not return data when the path is not present', function () {
      const PATH = '../test'
      let config = new Config(PATH).load()
      config.should.have.property('dirname', PATH)
      config.should.have.property('rules').that.is.empty;
    })

    it('should return data when the path is present and config file exists', function () {
      let config = new Config(__dirname).load()
      const RESULT = fs.readFileSync(path.join(__dirname, '.greplintrc'))
      config.should.have.property('dirname', __dirname)
      config.should.have.deep.property('rules[0]').that.is.deep.equal(JSON.parse(RESULT).rules)
    })
  })

  describe('Config.parse()', function () {
    it('should handle empty data', function () {
      const caseNull = Config.parse(null)
      caseNull.should.have.property('rules').that.is.empty;

      const caseUndef = Config.parse()
      caseUndef.should.have.property('rules').that.is.empty;
    })

    it('should handle object in rules', function () {
      const OBJECT_RULE = {todo: ["TODO"]}
      const DATA = {rules: OBJECT_RULE}
      const parsed = Config.parse(DATA)
      parsed.should.have.deep.property('rules[0]').that.is.deep.equal(OBJECT_RULE);
      parsed.should.have.property('rules').that.is.lengthOf(1);
    })

    it('should handle array in rules', function () {
      const ARRAY_RULE = [{todo: ["TODO"]}]
      const DATA = {rules: ARRAY_RULE}
      const parsed = Config.parse(DATA)
      parsed.should.have.property('rules').that.is.deep.equal(ARRAY_RULE);
      parsed.should.have.property('rules').that.is.lengthOf(1);
    })

    it('should handle multiple rules', function () {
      const ARRAY_RULE = [{todo: ["TODO"]}, {fixme: ["FIXME"]}]
      const DATA = {rules: ARRAY_RULE}
      const parsed = Config.parse(DATA)
      parsed.should.have.property('rules').that.is.deep.equal(ARRAY_RULE);
      parsed.should.have.property('rules').that.is.lengthOf(ARRAY_RULE.length);
    })
  })
})
