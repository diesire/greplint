import chai from 'chai'
import Cli from '../lib/cli'

const should = chai.should();

describe.skip('Cli', function() {
  describe('#constructor()', function () {
    it('should return 0', function () {
      new Cli().run('C:/Users/NG52D87/github/greplint/test/fixtures')
    });
  });
});
