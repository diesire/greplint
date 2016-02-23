import path from 'path'
import chai from 'chai'
import Grep from '../lib/grep'

const should = chai.should();

describe('Grep', function() {
  describe('#find() in a directory', function () {
    it('should bring some results', function (done) {
      let fixtures = path.join(__dirname, 'fixtures')
      return new Grep().find('hello|root', fixtures)
        .then(values => {
          values.should.have.length.above(0)
          values[0].should.have.property('filename').which.contain('input.txt')
          values[0].should.have.property('lineNumber', '1')
          values[0].should.have.property('value', '-- Hello, world!')
          values[1].should.have.property('filename').which.contain('input.txt')
          values[1].should.have.property('lineNumber', '3')
          values[1].should.have.property('value', '-- XXX root')
          done()
        })
    });
  });

  describe('#find() in a file', function () {
    it('should bring some results', function (done) {
      let fixtures = path.join(__dirname, 'fixtures')
      return new Grep().find('hello|root', fixtures, 'input.txt')
        .then(values => {
          values.should.have.length.above(0)
          values[0].should.have.property('filename').which.contain('input.txt')
          values[0].should.have.property('lineNumber', '1')
          values[0].should.have.property('value', '-- Hello, world!')
          values[1].should.have.property('filename').which.contain('input.txt')
          values[1].should.have.property('lineNumber', '3')
          values[1].should.have.property('value', '-- XXX root')
          done()
        })
    });
  });
});
