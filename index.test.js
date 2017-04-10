var test = require('tape')
var fetch = require('./')

var PORT = 4567
var URL = 'http://localhost:' + PORT

test('when response not ok', function (t) {
  t.plan(4)

  fetch(URL + '/BURNiNATE/THE/COUNTRYSIDE')
    .then(function (result) {
      t.fail('should have rejected')
    })
    .catch(function (err) {
      t.pass('rejected')
      t.equal(err.type, 'ResponseNotOk', 'err.type is ResponseNotOk')
      t.equal(err.response.status, 404, 'err.response is response')
      t.equal(err.message, err.response.status, 'err.message is response.status')
    })
})

test('fetch', function (t) {
  t.plan(2)

  // fetch the home page
  fetch(URL)
    .then(function (response) {
      t.true(response.ok, 'fetch() resolves with response')
      return response.text()
    })
    .then(function (body) {
      t.equal(typeof body, 'string')
    })

})

test('fetch.json', function (t) {
  t.plan(2)
  fetch.json(URL + '/posts/1')
    .then(function (result) {
      t.equal(result.body.id, 1, 'result.body')
      t.equal(result.response.status, 200, 'result.response')
    })
})

test('fetch.text', function (t) {
  t.plan(2)
  fetch.text(URL + '/posts/1')
    .then(function (result) {
      t.equal(typeof result.body, 'string', 'result.body is a string')
      t.equal(result.response.status, 200, 'result.response')
    })
})

test('regular fetch posts json body', function (t) {
  t.plan(1)
  var newPost = {
    title: 'foo',
    body: 'bar',
    userId: 1
  }
  fetch('http://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: newPost
  })
    .then(function (response) {
      return response.json()
    })
    .then(function (body) {
      delete body.id
      t.deepEqual(body, newPost)
    })
})

test('options object with url and query object', function (t) {
  t.plan(1)
  fetch.json({
    url: URL + '/posts',
    query: {
      userId: 1
    }
  })
    .then(function (result) {
      t.equal(result.body[0].id, 1)
    })
})
