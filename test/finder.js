import path from 'path'
import chai from 'chai'
import Finder from '../lib/finder'

const should = chai.should();

describe('Finder', function() {
  describe('#constructor()', function () {
    it('should exists', function () {
      (new Finder()).should.not.be.null;
    });
  });

  describe('#find()', function () {
    describe('in a directory', function () {
      it('should find something', function () {
        let fixtures = path.join(__dirname, 'fixtures')
        new Finder().find(fixtures)
        .then(values => values.should.have.length.above(0))
      });
    });

    describe('in a file', function () {
      it('should be empty', function () {
        let fixtures = path.join(__dirname, 'fixtures/input.txt')
        new Finder().find(fixtures)
        .then(values => values.should.be.empty)
      });
    });
  });
});
