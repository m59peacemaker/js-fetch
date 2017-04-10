# @m59/fetch

Fetch API with conveniences I like.

This is shimmed for server side usage with [`node-fetch`](https://github.com/bitinn/node-fetch). The server code is ignored when bundling for the browser.

## install

```sh
$ npm install @m59/fetch
```

## example

```js
const fetch = require('@m59/fetch')

fetch.json({
  url: URL + '/posts',
  query: { userId: 1 }
}).then(({response, body}) => body[0].id) // 1
```

## api

### `fetch([url], options)`

The first argument can be a url or options object. If you pass only an options object, it should have a url property. Put your [normal `fetch` options](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters) in `options`.


#### `options.query`

`options.query` is an object that will be used to create a query string that will set or overwrite the query string in the given url

```js
{
  url: '/foo'
  query: { bar: 123 }
} // => /foo?bar=123
```

#### `options.body`

If you set `options.body` to an instance of `FormData`, the form data content type header will be set automatically. If you set `options.body` to a regular object, it will be JSON stringified and the json content type header will be set automatically.

#### helpers

If you want the response body in a certain format, save some code by using the corresponding helper. `json()` and `text()` will also set the appropriate `accept` header to ensure the server knows what format you want. The result will be in the format `{ response, body }`.

```js
fetch.arrayBuffer()
fetch.blob()
fetch.json()
fetch.text()
fetch.formData()
```
