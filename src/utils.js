import {getHost, SYNCANO_API_VERSION} from './settings'

export function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response.data
  }

  let error

  try {
    error = new Error(response.data.detail)
  } catch (err) {
    error = new Error(response.statusText)
  }

  error.response = response
  error.data = response.data
  error.status = response.status
  error.headers = response.headers
  error.size = response.size
  error.timeout = response.timeout
  error.url = response.url

  throw error
}

export function parseJSON(response) {
  const mimetype = response.headers.get('Content-Type')

  if (response.status === 204 || mimetype === null) {
    return Promise.resolve({
      data: undefined,
      ...response
    })
  }

  // Parse JSON
  if (
    /^.*\/.*\+json/.test(mimetype) ||
    /^application\/json/.test(mimetype)
  ) {
    return response.json().then(res => ({
      data: res,
      ...response
    }))
  }

  // Parse XML and plain text
  if (
    /^text\/.*/.test(mimetype) ||
    /^.*\/.*\+xml/.test(mimetype) ||
    mimetype === 'text/plain'
  ) {
    return response.text().then(res => ({
      data: res,
      ...response
    }))
  }

  return response.arraybuffer()
}

export function buildSyncanoURL() {
  return `https://${getHost()}/${SYNCANO_API_VERSION}`
}

export function buildInstanceURL(instanceName) {
  return `${buildSyncanoURL()}/instances/${instanceName}`
}
