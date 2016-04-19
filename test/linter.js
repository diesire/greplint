import path from 'path'
import chai from 'chai'
import Linter from '../lib/linter'

const should = chai.should()

describe('Linter', function () {
  describe('#lint() runs in a directory', function () {
    it('should get data', function (done) {
      let fixtures = path.join(__dirname, 'fixtures')
      new Linter(fixtures).lint()
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
        .catch(err =>  done(err))
    })
  })

  describe('#lint() runs in a file', function () {
    it('should get data', function (done) {
      let fixtures = path.join(__dirname, 'fixtures/input.txt')
      new Linter(fixtures).lint()
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
        .catch(err =>  done(err))
    })
  })

  describe('#lint()', function () {
    it('should handle multiple rules', function (done) {
      let fixtures = path.join(__dirname, 'fixtures/a/input.txt')
      new Linter(fixtures).lint()
        .then(values => {
          values.should.have.length.above(0)
          values[0].should.have.property('filename').which.contain('input.txt')
          values[0].should.have.property('lineNumber', '2')
          values[0].should.have.property('value', '-- TODO call something')
          values[1].should.have.property('filename').which.contain('input.txt')
          values[1].should.have.property('lineNumber', '4')
          values[1].should.have.property('value', '-- FIXME rot')
          done()
        })
        .catch(err =>  done(err))
    })
  })
})
