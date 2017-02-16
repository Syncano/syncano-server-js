import {getHost, getSpaceHost, SYNCANO_API_VERSION} from './settings'

export function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }

  const error = new Error(response.statusText)

  error.response = response

  throw error
}

export function parseJSON(response) {
  if (response.status === 202) {
    return Promise.resolve()
  }
  return response.json()
}

export function buildSyncanoURL() {
  return `https://${getHost()}/${SYNCANO_API_VERSION}`
}

export function buildInstanceURL(instanceName) {
  return `${buildSyncanoURL()}/instances/${instanceName}`
}

export function buildLocalInstanceURL(instanceName) {
  return `https://${instanceName}.${getSpaceHost()}`
}
