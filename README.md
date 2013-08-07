# localstorage-scuttlebutt

replicate localstorage through scuttlebutt.

The same api as [scuttlebutt/model](https://github.com/dominictarr/scuttlebutt#scuttlebuttmodel)
but data is saved in the browser using local storage.

## Example

``` js
var LSSB = require('localstorage-scuttlebutt')
var ls = new LSSB({prefix: prefix, id: id, store: localStorage})

ls.set(key, value)
ls.get(key)
ls.on('change', function (key, value) {

})
```

`prefix` is the name of this instance. If you are using multiple instances,
or have other data in `localStorage` you need to set this. By default,
`prefix='_lss'`.

`id` is optional, but if provided, it should represent the user session.
(by default, it's remembered in localStorage, so the same value will be used next time)

`store` defaults to `localStorage`, but `sessionStorage` may also be used. 
(store must have `length` property and a `key()` method.
 
## Replication

replicate with a normal `scuttlebutt/model`, across anything that provides a Stream api.

``` js
//client
var reconnect = require('reconnect')
var LSSB = require('localstorage-scuttlebutt')
var ls = new LSSB(ID, prefix)

reconnect(function (stream) {
  stream.pipe(ls.createStream()).pipe(stream)
}).connect('/shoe')
```

``` js
//server.js
var shoe = require('shoe')
var Model = require('scuttlebutt/model')
var model = new Model(SERVER_ID)

shoe(function (stream) {
  stream.pipe(model.createStream()).pipe(stream)
}).install(http.createServer(function (req, res) {
  fs.createReadStream(__dirname + '/index.html').pipe(res)
  req.resume()
}).listen(3000))
```

## License

MIT
