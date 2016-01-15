import chai from 'chai'
import Greplint from '../lib/index'

const should = chai.should();

describe('Greplint', function() {
  describe('#lint() exists', function () {
    it('should exists', function () {
      new Greplint('C:/Users/NG52D87/github/greplint/test/fixtures').lint()
        .then(values => values.should.not.be.null)
    });
  });
});
