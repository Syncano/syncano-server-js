/**
 * Unified response helper
 * @property {Function}
 */

class Response {
  constructor(content = null, status = 200, mimetype = 'text/plain', headers = {}) {
    this._content = content
    this._status = status
    this._mimetype = mimetype
    this._headers = headers

    if (content) {
      this._make()
    }
  }

  _make() {
    const isLocal = !global.setResponse || !global.HttpResponse
    const args = [this._status, this._content, this._mimetype, this._headers]

    if (isLocal) {
      console.log(args)
      return args
    }

    global.setResponse(new global.HttpResponse(...args))
  }
}

const response = (content, status, mimetype, headers) => {
  return new Response(content, status, mimetype, headers)
}

response.header = (key, value) => {
  response._headers = {
    ...response._headers,
    [key]: value
  }

  return response
}

response.json = (content, status = 200) => {
  return new Response(
    JSON.stringify(content),
    status,
    'application/json',
    response._headers
  )
}

export default response
