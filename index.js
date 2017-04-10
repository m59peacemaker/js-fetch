var specFetch = require('./fetch')
var prepare = require('./prepare')

var ResponseNotOk = function (error, response) {
  return Object.assign(error, {
    type: 'ResponseNotOk',
    message: response.status,
    response: response
  })
}

var statusOk = function (response) {
  if (!response.ok) { throw ResponseNotOk(new Error(), response) }
  return response
}

var baseFetch = function (urlOrRequest, options, extra) {
  return specFetch.apply(this, prepare(urlOrRequest, options, extra)).then(statusOk)
}

var fetch = function (urlOrRequest, options) {
  return baseFetch(urlOrRequest, options)
}

;[
  'arrayBuffer',
  'blob',
  'json',
  'text',
  'formData'
].forEach(function (type) {
  fetch[type] = function (urlOrRequest, options) {
    return baseFetch(urlOrRequest, options, { accept: type }).then(function (response) {
      return response[type]().then(function (body) {
        return { response: response, body: body }
      })
    })
  }
})

module.exports = fetch
