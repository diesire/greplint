import nodeCLI from 'shelljs-nodecli'

export default class Grep {
  find(text, dirname) {
    return nodeCLI.exec("nak", ` --ackmate -G *.* -d */* -i ${text} ${dirname}`, {async:true});
  }
}
