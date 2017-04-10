if (typeof window !== 'undefined') {
  module.exports = exports = window.fetch
  exports.Request = window.Request
} else {
  var f = require('node-fetch')
  module.exports = exports = f
  exports.Request = f.Request
}
