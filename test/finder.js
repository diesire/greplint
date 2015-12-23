import chai from 'chai'
import path from 'path'
import fs from 'fs'
import Finder from '../lib/finder'

const should = chai.should();

describe('Finder', function() {
  describe('#constructor()', function () {
    it('should exists', function () {
      (new Finder()).should.not.be.null;
    });
  });

  describe('#run()', function () {
    it('ok', function () {
      const finder = new Finder()
      const found = finder.run()
      found.should.be.true
    });
  });
});
