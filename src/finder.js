import dir  from 'node-dir'

export default class Finder {
  find(path) {
    return new Promise((resolve, reject) => {
      dir.subdirs(path, (err, subdirs) => {
        this.setSubDirs(err, subdirs, resolve, reject)
      })
    })
  }

  setSubDirs(err, subdirs, resolve, reject) {
    if (err) return reject(`Finder#setSubDirs error ${err}`)
    return resolve(subdirs)
  }
}
