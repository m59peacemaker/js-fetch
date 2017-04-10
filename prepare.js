var qsReplace = require('@m59/qs/replace')
var qsStringify = require('@m59/qs/stringify')

var isType = function (type, v) {
  const typeString = '[object ' + type + ']'
  return v && v.toString ?
    v.toString() === typeString :
    Object.prototype.toString.call(v) === typeString
}

var addHeader = function (k, v, opts) {
  opts.headers = opts.headers || {}
  opts.headers[k] = v
  return opts
}

var accepts = {
  json: 'application/json',
  text: 'text/plain, text/html'
}

var prepareUrl = function (url, params) {
  if (!url || !params) { return url }
  return qsReplace(url, function (string) {
    return qsStringify(params)
  })
}

var prepareOptions = function (opts, extra) {
  delete opts.url
  delete opts.query
  if (opts.body && typeof opts.body === 'object') {
    var contentType
    if (isType('FormData', opts.body)) {
      contentType = 'multipart/form-data'
    } else {
      opts.body = JSON.stringify(opts.body)
      contentType = 'application/json'
    }
    addHeader('Content-Type', contentType, opts)
  }
  if (extra.accept) {
    var accept = accepts[extra.accept]
    addHeader('Accept', accept, opts)
  }
  return opts
}

var prepare = function (x, options, extra) {
  extra = extra || {}

  if (isType('Request', x)) {
    return [ x, options ]
  }

  var args = typeof x === 'string' ?
    { url: x, options: options } :
    { options: x }
  args.options = Object.assign({}, args.options) // copy so internal mutation is safe

  return [
    prepareUrl(args.url || args.options.url, args.options.query),
    prepareOptions(args.options, extra)
  ]
}

module.exports = prepare
