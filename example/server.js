
var ecstatic = require('ecstatic')
var shoe     = require('shoe')
var http     = require('http')

var Model = require('scuttlebutt/model')

var model = new Model()
.on('change', console.log)

shoe(function (stream) {
  stream.pipe(model.createStream()).pipe(stream)
})
.install(http.createServer(ecstatic(__dirname)).listen(3000), '/shoe')

