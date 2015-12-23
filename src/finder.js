import dir  from 'node-dir'

export default class Finder {
  find(path, callback) {
    dir.subdirs(path, callback);
  }
}
