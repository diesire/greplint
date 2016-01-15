// http://jamesknelson.com/testing-in-es6-with-mocha-and-babel-6/

import chai from 'chai'
import path from 'path'
import fs from 'fs'
import Config from '../lib/config'

const should = chai.should();

describe('Config', function() {
  describe('#constructor()', function () {
    it('should return an error when called without params', function () {
      (() => {new Config()}).should.throw(Error)
    });

    it('should return not return data when the path is not present', function () {
      const PATH = '../test'
      let config = new Config(PATH)
      config.should.have.property('dirname', PATH)
      config.should.have.property('data', false)
    });

    it('should return data when the path is present and config file exists', function () {
      let config = new Config(__dirname)
      const RESULT = fs.readFileSync(path.join(__dirname, '.greplintrc'))
      config.should.have.property('dirname', __dirname)
      config.should.have.property('data')
      config.data.should.deep.equal(JSON.parse(RESULT))
    });
  });
});
