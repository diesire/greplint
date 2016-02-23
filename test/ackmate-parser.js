import chai from 'chai'
import sinon from 'sinon'
import sinonChai  from 'sinon-chai'
import ackmateParser from '../lib/ackmate-parser'
import MemStream from 'memorystream'


const should = chai.should()
chai.use(sinonChai)

const FILE_ONLY = {
  input : `:C:\\Users\\NG52D87\\github\\greplint\\test\\fixtures\\input.txt`,
  output: []
}

const MATCH = {
  input : `:C:\\Users\\NG52D87\\github\\greplint\\test\\fixtures\\input.txt\n2;3 4:-- TODO call something`,
  output: [
    {
      filename: `C:\\Users\\NG52D87\\github\\greplint\\test\\fixtures\\input.txt`,
      lineNumber: '2',
      index: '3',
      length: '4',
      value: '-- TODO call something'
    }
  ]
}

const MATCHES = {
  input : `:C:\\Users\\NG52D87\\github\\greplint\\test\\fixtures\\input.txt\n2;3 4:-- TODO call something\n3;3 3:-- XXX roo`,
  output: [
    {
      filename: `C:\\Users\\NG52D87\\github\\greplint\\test\\fixtures\\input.txt`,
      lineNumber: '2',
      index: '3',
      length: '4',
      value: '-- TODO call something'
    }, {
      filename: `C:\\Users\\NG52D87\\github\\greplint\\test\\fixtures\\input.txt`,
      lineNumber: '3',
      index: '3',
      length: '3',
      value: '-- XXX roo'
    }
  ]
}

const COMPLEX_MATCH = {
  input : `:C:\\Users\\NG52D87\\github\\greplint\\test\\fixtures\\input.txt\n2;3 4,9 1,12 2:-- TODO call something`,
  output: [
    {
      filename: `C:\\Users\\NG52D87\\github\\greplint\\test\\fixtures\\input.txt`,
      lineNumber: '2',
      index: '3',
      length: '4',
      value: '-- TODO call something'
    }, {
      filename: `C:\\Users\\NG52D87\\github\\greplint\\test\\fixtures\\input.txt`,
      lineNumber: '2',
      index: '9',
      length: '1',
      value: '-- TODO call something'
    }, {
      filename: `C:\\Users\\NG52D87\\github\\greplint\\test\\fixtures\\input.txt`,
      lineNumber: '2',
      index: '12',
      length: '2',
      value: '-- TODO call something'
    }
  ]
}

describe('ackmate-parser', () => {
  let spy = null
  let memStream = null
  let parser = null

  describe('#ackmateparser()', () => {
    beforeEach(() => {
      spy = sinon.spy()
      memStream = new MemStream()
      parser = ackmateParser({verbose:true})
    })

    it('should handle filename only', (done) => {
      parser.on('data', spy).on('end', () => {
        spy.should.have.been.not.called
        done()
      })

      memStream.pipe(parser)
      memStream.end(FILE_ONLY.input)
    })

    it('should handle one match', (done) => {
      parser.on('data', spy).on('end', () => {
        spy.should.have.been.calledOnce
        spy.firstCall.should.have.been.calledWithExactly(MATCH.output[0])
        done()
      })

      memStream.pipe(parser)
      memStream.end(MATCH.input)
    })

    it('should handle several matches', (done) => {
      parser.on('data', spy).on('end', () => {
        spy.should.have.been.calledTwice
        spy.firstCall.should.have.been.calledWithExactly(MATCHES.output[0])
        spy.secondCall.should.have.been.calledWithExactly(MATCHES.output[1])
        done()
      })

      memStream.pipe(parser)
      memStream.end(MATCHES.input)
    })

    it('should handle several matches in the same line', (done) => {
      parser.on('data', spy).on('end', () => {
        spy.should.have.been.calledThrice
        spy.firstCall.should.have.been.calledWithExactly(COMPLEX_MATCH.output[0])
        spy.secondCall.should.have.been.calledWithExactly(COMPLEX_MATCH.output[1])
        spy.thirdCall.should.have.been.calledWithExactly(COMPLEX_MATCH.output[2])
        done()
      })

      memStream.pipe(parser)
      memStream.end(COMPLEX_MATCH.input)
    })
  })
})
