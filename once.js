var wrappy = require('wrappy')
var once = secondCallHandler(function (f) { return f.value })

once.strict = wrappy(secondCallHandler(function (f) {
  throw new Error(f.onceError || createErrorMsg(f))
}))

function createErrorMsg (f) {
  return f.srcName
    ? f.srcName + " shouln't be called more than once"
    : "Function wrapped with `once` shouln't be called more than once"
}

module.exports = wrappy(once)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'strictOnce', {
    value: function () {
      return once.strict(this)
    },
    configurable: true
  })
})

function secondCallHandler (onSecondCall) {
  return function (fn) {
    var f = function () {
      if (f.called) return onSecondCall(f)
      f.called = true
      return f.value = fn.apply(this, arguments)
    }
    f.srcName = fn.name
    f.called = false
    return f
  }
}
