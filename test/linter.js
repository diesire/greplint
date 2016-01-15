import chai from 'chai'
import Linter from '../lib/linter'

const should = chai.should();

describe('Linter', function() {
  describe('#lint() runs in a directory', function() {
    it('should exists', function() {
      return new Linter('C:/Users/NG52D87/github/greplint/test/fixtures').lint()
        .then(values => {
          values.should.have.length.above(0)
          values[0].should.have.property('filename').which.contain('input.txt')
          values[0].should.have.property('lineNumber', '1')
          values[0].should.have.property('value', '-- Hello, world!')
          values[1].should.have.property('filename').which.contain('input.txt')
          values[1].should.have.property('lineNumber', '3')
          values[1].should.have.property('value', '-- XXX root')
        })
    });
  });

  describe('#lint() runs in a file', function() {
    it('should exists', function() {
      return new Linter('C:/Users/NG52D87/github/greplint/test/fixtures/input.txt').lint()
        .then(values => {
          values.should.have.length.above(0)
          values[0].should.have.property('filename').which.contain('input.txt')
          values[0].should.have.property('lineNumber', '1')
          values[0].should.have.property('value', '-- Hello, world!')
          values[1].should.have.property('filename').which.contain('input.txt')
          values[1].should.have.property('lineNumber', '3')
          values[1].should.have.property('value', '-- XXX root')
        })
    });
  });
});
