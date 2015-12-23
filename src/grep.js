import nodeCLI from 'shelljs-nodecli'

export default class Grep {
  find(text, dirname) {
    let lines = []
    return new Promise((resolve, reject) => {
      const cmd = nodeCLI.exec("nak", ` --ackmate -G *.* -d */* -i ${text} ${dirname}`, {async:true});

      cmd.stdout.on('data', data => lines.push(data))
      cmd.stderr.on('data', data => lines.push(data))
      cmd.on('error', err => reject(`Grep#find error ${err}`))
      cmd.on('close', code => resolve(lines))
    })
  }
}
