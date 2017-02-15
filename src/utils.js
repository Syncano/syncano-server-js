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
  try {
    return response.json()
  } catch (err) {
    return response.text()
  }
}

export function buildSyncanoURL() {
  return `https://${getHost()}/${SYNCANO_API_VERSION}`
}

export function buildInstanceURL(instanceName) {
  return `${buildSyncanoURL()}/instances/${instanceName}`
}
