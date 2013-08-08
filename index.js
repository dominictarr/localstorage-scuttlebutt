var Scuttlebutt = require('scuttlebutt')
var sort = require('scuttlebutt/util').sort
var inherits = require('util').inherits

module.exports = LocalStorageScuttlebutt

inherits(LocalStorageScuttlebutt, Scuttlebutt)

function LocalStorageScuttlebutt (opts) {
  opts = opts || {}
  this.store = opts.store || localStorage
  this.opts = opts
  this.prefix = opts.prefix || '_lss'

  var id = (
          opts.id
        || localStorage['_id:' + this.prefix]
        || 'ID_' + Date.now() + Math.random()
      )

  this.store['_id:' + this.prefix] = opts.id

  this.rx = new RegExp('^' + this.prefix)

  Scuttlebutt.call(this, id)

  if('undefined' !== typeof window) {
    var self = this
    window.addEventListener('storage', function (ev) {
      if(!ev) ev = window.event //Internet Explorer WTF
      if(!self.rx.test(ev.key)) return
      var key = ev.key.substring(self.prefix.length)
      try {
        var value = JSON.parse(ev.newValue)

        if(self.store[self.prefix + ev.key] === value)
          return

        self.emit('change', key, value[0])
        self.emit('change:'+key, value[0])
      } catch (err) {
        console.error(err)
      }
    })
  }
}

var LSS = LocalStorageScuttlebutt.prototype

LSS.keys = function () {
  var l = this.prefix.length
  var length = this.store.length
  var keys = []
  for(var i = 0; i < length; i++) {
    var k = this.store.key(i)
    if(this.rx.test(k))
      keys.push(k.substring(l))
  }
  return keys.sort()
}

LSS.history = function () {
  var hist = []
  var l = this.prefix.length
  var length = this.store.length
  for(var i = 0; i < length; i++) {
    var k = this.store.key(i)
    if(this.rx.test(k)) {
      try {
        var val = JSON.parse(this.store[k])

        //[value, source, ts] <-- stored like this
        val[0] = [k.substring(l), val[0]]
        hist.push(val)
      } catch (err) {
        console.error(err)
      }
    }
  }
  return sort(hist)
}

LSS.applyUpdate = function (update) {
  update = update.slice()
  var change = update[0]
  var key    = change[0]
  update[0] = change[1]
  var k = this.prefix + key
  var v = JSON.stringify(update)
  if(this.store[k] === v) return
  this.store[k] = v

  this.emit('change', key, change[1])
  this.emit('change:'+key, change[1])

  return true
}

LSS.get = function (key) {
  var val = this.store[this.prefix + key]
  if(!val) return
  try {
    return JSON.parse(val)[0]
  } catch (err) {
    console.error(err)
    return
  }
}

LSS.set = function (key, value) {
  this.localUpdate([key, value])
  return this
}


