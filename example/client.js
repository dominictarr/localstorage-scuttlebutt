var reconnect = require('reconnect')
var LSS = require('../')
var l = new LSS()

var h = require('hyperscript')
var messages, input

document.body.appendChild(
  h('div',
    h('h1', 'hello'),
    input = h('input', {onchange: function () {
      l.set(Date.now(), input.value)
      input.value = ''
      input.focus()
    }}),
    messages = h('div', l.keys().map(function (key) {
      console.log('get', key, l.get(key))
      return h('pre', key+':', l.get(key), h('br'))
    }))
  )
)

l.on('change', function (key, value) {
  console.log('message', key, value)
  messages.appendChild(h('pre', key+':', value, h('br')))
})

reconnect(function (stream) {
  stream.pipe(l.createStream()).pipe(stream)
}).connect('/shoe')
