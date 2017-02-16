export const getHost = function () {
  try {
    return META.api_host // eslint-disable-line no-undef
  } catch (err) {
    return process.env.SYNCANO_HOST || 'api.syncano.io'
  }
}

export const getSpaceHost = function () {
  try {
    return META.space_host  // eslint-disable-line no-undef
  } catch (err) {
    return process.env.SYNCANO_SPACE_HOST || 'syncano.space'
  }
}

export const SYNCANO_API_VERSION = 'v2'
