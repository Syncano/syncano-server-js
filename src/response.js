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

  header(key, value) {
    this._headers = {
      ...this._headers,
      [key]: value
    }

    return this
  }

  json(content) {
    this._mimetype = 'application/json'
    this._content = JSON.stringify(content)

    this._make()

    return this
  }
}

export default (content, status, mimetype, headers) => {
  return new Response(content, status, mimetype, headers)
}
