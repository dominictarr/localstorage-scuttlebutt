
var Scuttlebutt = require('scuttlebutt')
var sort = require('scuttlebutt/util').sort

function LocalStorageScuttlebutt (id, prefix) {
  this.prefix = prefix || '_lss'

  this.rx = new RegExp('^' + prefix)

  Scuttlebutt.call(this, id)
  if('undefined' !== typeof window) {
    var self = this
    window.addEventListener('storage', function (ev) {
      if(!ev) ev = window.event //Internet Explorer WTF
      try {
        var key = ev.key
        var value = JSON.parse(ev.newValue)
        self.emit('change', key, value[0])
        self.emit('change:'+key, value[0])
      } catch (err) {
        console.error(err)
      }
    }
  }
}

var LSS = LocalStorageScuttlebutt.prototype

LSS.history = function () {
  var hist = []
  var l = this.prefix.length
  var length = localStorage.length
  for(var i = 0; i < length; i++) {
    var k = localStorage.key(i)
    if(this.rx.test(k)) {
      try {
        var val = JSON.parse(localStorage[k])

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
  localStorage[this.prefix + key] = JSON.stringify(update)
  return true
}
