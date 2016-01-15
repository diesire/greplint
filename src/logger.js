'use strict'

const log = require('npmlog')
    , util = require('util')

log.addLevel('trace', 500, { fg: 'brightCyan' }, 'trac')
log.addLevel('verbose', 1000, { fg: 'brightBlue' }, 'verb')
log.addLevel('info', 2000, { fg: 'brightGreen' }, 'info')
log.addLevel('warn', 4000, { fg: 'brightYellow', bg: null }, 'warn')
log.addLevel('error', 5000, { fg: 'brightRed' }, 'ERR!')

var defaults = {
  prefixStyle: log.prefixStyle
, headingStyle: log.headingStyle
, loglevel: log.level
, stream: process.stderr
, timestamp: true
, heading: ''
}

var defaultLevels = [
  'silly'
, 'trace'
, 'verbose'
, 'info'
, 'http'
, 'warn'
, 'error'
, 'silent'
]

module.exports = Logger

function Logger(component, opts) {
  if (!(this instanceof Logger))
    return new Logger(component, opts)

  if (!component) component = 'app'
  this.component = component
  this.log = log
  opts = opts || {}
  if (opts.hasOwnProperty('timestamps'))
    opts.timestamp = opts.timestamps
  this.opts = util._extend(defaults, opts)
  this.log.level = this.opts.level || this.opts.loglevel
  this.log.prefixStyle = this.opts.prefixStyle
  this.log.headingStyle = this.opts.headingStyle
  this.log.stream = this.opts.stream
  this.timestamp = this.opts.timestamp
  this.heading = this.opts.heading
  this.log.heading = this.heading
  defaultLevels.forEach(function(l) {
    this[l] = function() {
      var len = arguments.length
      var args = new Array(len)
      for (var i = 0; i < len; i++) {
        args[i] = arguments[i]
      }
      this.write(l, args)
    }.bind(this)
  }.bind(this))
}

Logger.createLogger = function(comp, opts) {
  return new Logger(comp, opts)
}

Logger.prototype.child = function(comp, opts) {
  opts = opts || {}
  opts.heading = opts.heading || this.heading
  return new Logger(comp, opts)
}

Logger.prototype.pause = function() {
  this.log.pause()
}

Logger.prototype.resume = function() {
  this.log.resume()
}

Logger.prototype.rmLevel = function(level) {
  delete this.log.levels[level]
  delete this.log.style[level]
  delete this.log[level]
  delete this.log.disp[level]
  delete this[level]
}

Logger.prototype.addLevel = function(level, n, style, disp) {
  this.log.addLevel(level, n, style, disp)
  this[level] = function() {
    var len = arguments.length
    var args = new Array(len)
    for (var i = 0; i < len; i++) {
      args[i] = arguments[i]
    }
    this.write(level, args)
  }.bind(this)
}

Logger.prototype.write = function(level, args) {
  if (this.timestamp) args = [[timestamp(), this.component].join(' ')].concat(args)
  else args = [this.component].concat(args)
  this.log[level].apply(this.log, args)
}

// The following were taken straight from node core (lib/utils.js)
function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10)
}

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec']

function timestamp() {
  var d = new Date()
  var time = [ pad(d.getHours())
             , pad(d.getMinutes())
             , pad(d.getSeconds())
             ].join(':')
  return [d.getDate(), months[d.getMonth()], time].join(' ')
}
