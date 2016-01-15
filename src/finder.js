import dir  from 'node-dir'
import fs from 'fs'
import npmlog from 'npmlog'

export default class Finder {
  find(path) {
    npmlog.verbose('Finder', `searching directories on ${path}`)

    if (fs.statSync(path).isFile()) {
      npmlog.verbose('Finder', `file detected`)
      return Promise.resolve([])
    }

    return new Promise((resolve, reject) => {
      dir.subdirs(path, (err, subdirs) => {
        this.setSubDirs(err, subdirs, resolve, reject)
      })
    })
  }

  setSubDirs(err, subdirs, resolve, reject) {
    if (err) return reject(`Finder#setSubDirs error ${err}`)

    npmlog.verbose('Finder', `dirs found`, subdirs)
    return resolve(subdirs)
  }
}
