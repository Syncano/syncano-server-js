function getMeta(envVar, metaVar, fallback = null) {
  if (process.env[envVar]) {
    return process.env[envVar]
  }

  try {
    return META[metaVar]
  } catch (err) {
    return fallback
  }
}

export const getHost = () =>
  getMeta('SYNCANO_HOST', 'api_host', 'api.syncano.io')

export const getSpaceHost = () =>
  getMeta('SYNCANO_SPACE_HOST', 'space_host', 'syncano.space')

export const getInstanceName = () =>
  getMeta('SYNCANO_INSTANCE_NAME', 'instance')

export const getToken = () =>
  getMeta('SYNCANO_API_KEY', 'token')

export const SYNCANO_API_VERSION = 'v2'
