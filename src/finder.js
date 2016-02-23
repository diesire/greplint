import dir  from 'node-dir'
import fs from 'fs'
import logger from 'bragi'

export default class Finder {
  constructor(options = {}) {
    logger.options.groupsEnabled = options.groupsEnabled || false
    logger.options.groupsDisabled = options.groupsDisabled || true

    this.options = options
  }

  find(path) {
    logger.log('Finder', `searching directories on ${path}`)

    if (fs.statSync(path).isFile()) {
      logger.log('Finder', `file detected`)
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

    logger.log('Finder', `dirs found`, subdirs)
    return resolve(subdirs)
  }
}
