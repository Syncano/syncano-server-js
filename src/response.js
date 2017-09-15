/**
 * Unified response helper
 * @property {Function}
 */

class Response {
  constructor (
    instance,
    content = null,
    status = 200,
    mimetype = 'text/plain',
    headers = {}
  ) {
    this._content = content
    this._status = status
    this._mimetype = mimetype
    this._headers = headers

    let setResponse = instance.setResponse || global.setResponse
    let HttpResponse = instance.HttpResponse || global.HttpResponse

    if (this._content) {
      const args = [this._status, this._content, this._mimetype, this._headers]

      if (setResponse === undefined) {
        return
      }

      setResponse(new HttpResponse(...args))

      process.exit(0) // eslint-disable-line unicorn/no-process-exit
    }
  }
}

export default config => {
  const response = (content, status, mimetype, headers) =>
    new Response(config, content, status, mimetype, headers)

  response.header = (key, value) => {
    response._headers = {
      ...response._headers,
      [key]: value
    }

    return response
  }

  response.json = (content, status = 200) => {
    return new Response(
      config,
      JSON.stringify(content),
      status,
      'application/json',
      response._headers
    )
  }

  return response
}
