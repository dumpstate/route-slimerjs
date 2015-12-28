const fs = require('fs')
const url = require('./node_modules/url-slimerjs/url')


const addHandler = (store) => (method, path, handler, validator) => {
  method = method.toUpperCase()
  path = path.toLowerCase()
  
  if (typeof(store[method]) === 'undefined') {
    store[method] = {}
  }

  store[method][path] = {
    handler: handler,
    validator: validator
  }
} 

const badRequest = (req, res) => {
  res.writeHead(400)
  res.write('')
  res.close()
}

const handle = (store) => (req, res) => {
  const urlReq = url.parse(req.url, true)
  if (typeof(store[req.method]) !== 'undefined' &&
        typeof(store[req.method][urlReq.pathname]) !== 'undefined') {
    const path = store[req.method][urlReq.pathname]

    if (path.validator(req, res, urlReq)) {
      path.handler(req, res, urlReq)
    } else {
      badRequest(req, res)
    }
  } else {
    badRequest(req, res)
  }
}


module.exports = () => {
  const store = {}

  return {
    add: addHandler(store),
    handle: handle(store)
  }
}
