export const getHost = function () {
  if (process.env.SYNCANO_HOST) {
    return process.env.SYNCANO_HOST
  }
  try {
    return META.api_host // eslint-disable-line no-undef
  } catch (err) {
    return 'api.syncano.io'
  }
}

export const getSpaceHost = function () {
  if (process.env.SYNCANO_SPACE_HOST) {
    return process.env.SYNCANO_SPACE_HOST
  }
  try {
    return META.space_host  // eslint-disable-line no-undef
  } catch (err) {
    return 'syncano.space'
  }
}

export const getInstanceName = function () {
  if (process.env.SYNCANO_INSTANCE_NAME) {
    return process.env.SYNCANO_INSTANCE_NAME
  }
  try {
    return META.instance  // eslint-disable-line no-undef
  } catch (err) {
    return null
  }
}

export const getToken = function () {
  if (process.env.SYNCANO_API_KEY) {
    return process.env.SYNCANO_API_KEY
  }
  try {
    return META.token  // eslint-disable-line no-undef
  } catch (err) {
    return null
  }
}

export const SYNCANO_API_VERSION = 'v2'
