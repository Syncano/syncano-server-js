import {getHost, SYNCANO_API_VERSION} from './settings'

export function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }

  const error = new Error(response.statusText)

  error.response = response

  throw error
}

export function parseJSON(response) {
  const mimetype = response.headers.get('Content-Type')

  if (response.status === 204 || mimetype === null) {
    return Promise.resolve()
  }

  // Parse JSON
  if (
    /^.*\/.*\+json/.test(mimetype) ||
    /^application\/json/.test(mimetype)
  ) {
    return response.json()
  }

  // Parse XML and plain text
  if (
    /^text\/.*/.test(mimetype) ||
    /^.*\/.*\+xml/.test(mimetype) ||
    mimetype === 'text/plain'
  ) {
    return response.text()
  }

  return response.arraybuffer()
}

export function buildSyncanoURL() {
  return `https://${getHost()}/${SYNCANO_API_VERSION}`
}

export function buildInstanceURL(instanceName) {
  return `${buildSyncanoURL()}/instances/${instanceName}`
}
