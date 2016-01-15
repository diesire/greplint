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
        new Finder().find('C:/Users/NG52D87/github/greplint/test/fixtures')
        .then(values => values.should.have.length.above(0))
      });
    });

    describe('in a file', function () {
      it('should be empty', function () {
        new Finder().find('C:/Users/NG52D87/github/greplint/test/fixtures/input.txt')
        .then(values => values.should.be.empty)
      });
    });
  });
});
