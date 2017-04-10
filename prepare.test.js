var test = require('tape')
var prepare = require('./prepare')
var FormData = require('form-data')
var Request = require('./fetch').Request

test('prepare', t => {
  t.deepEqual(
    prepare('/foo', {
      query: {
        a: 'a',
        b: 'b'
      }
    }),
    [ '/foo?a=a&b=b', {} ],
    'adds query string from query object to url'
  )
  t.deepEqual(
    prepare('/foo?a=1&a=2', {
      query: {
        a: 'a',
        b: 'b'
      }
    }),
    [ '/foo?a=a&b=b', {} ],
    'overwrites existing query string in url if query object given'
  )
  t.deepEqual(
    prepare('/foo?a=1&a=2', {}),
    [ '/foo?a=1&a=2', {} ],
    'does not modify existing query string in url if no query object given'
  )

  t.deepEqual(
    prepare({
      url: '/foo',
      query: { a: 123 }
    }),
    [ '/foo?a=123', {} ],
    'takes options object as first param'
  )

  t.deepEqual(
    prepare({
      url: '/foo',
      query: { a: 123 }
    }, { url: '/bar' }),
    [ '/foo?a=123', {} ],
    'if first param is options object, does not use second param'
  )

  t.deepEqual(
    prepare('/foo', {
      body: { foo: 123 }
    }),
    [ '/foo', {
      body: '{"foo":123}',
      headers: { 'Content-Type': 'application/json' }
    }],
    'when body is object, JSON stringifies body and sets json content type'
  )

  t.test('when body is formData', function (t) {
    var body = new FormData()
    var fetchArgs = prepare('/foo', { body: body })
    t.equal(fetchArgs[1].body, body, 'does not modify body')
    t.deepEqual(
      fetchArgs[1].headers,
      { 'Content-Type': 'multipart/form-data' },
      'sets form-data content type'
    )
    t.deepEqual(fetchArgs [ '/foo', {
      body: body,
      headers: { 'Content-Type': 'multipart/form-data' }
    }])

    t.end()
  })

  t.test('does not mutate options object', function (t) {
    var options = { url: '/foo' }
    t.deepEqual(prepare(options)[1], {}, 'result options is an empty object')
    t.deepEqual(options, { url: '/foo' }, 'input options object is unchanged')
    var options2 = { query: { a: 123 } }
    t.deepEqual(prepare('/foo', options2)[1], {}, 'result options is an empty object')
    t.deepEqual(options2, { query: { a: 123 } }, 'input options object is unchanged')

    t.end()
  })

  t.deepEqual(
    prepare('/foo', undefined, { accept: 'json' })[1],
    { headers: { Accept: 'application/json' } },
    'set accept header for json'
  )

  t.deepEqual(
    prepare('/foo', {}, { accept: 'text' })[1],
    { headers: { Accept: 'text/plain, text/html' } },
    'set accept header for text'
  )

  t.test('args just pass through if first arg is a Request object', function (t) {
    var request = new Request('/foo')
    t.deepEqual(
      prepare(request, request),
      [ request, request ]
    )
    t.deepEqual(
      prepare(request, request),
      [ request, request ]
    )

    t.end()
  })

  t.test('options object with no prototype', function (t) {
    var options = Object.create(null)
    options.url = '/qux'
    t.deepEqual(
      prepare(options),
      [ '/qux', {} ]
    )

    t.end()
  })

  t.end()
})
