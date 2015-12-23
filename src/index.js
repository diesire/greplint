import Linter from './linter';

new Linter('C:/Users/NG52D87/github/greplint/test/fixtures').lint().then(result => console.log(result)).catch(error => console.log(error))
