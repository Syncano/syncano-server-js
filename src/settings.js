global.META = global.META || {}

export default ({
  meta = {},
  token,
  instanceName,
  setResponse,
  HttpResponse,
  ...props
}) => ({
  token: process.env.TOKEN || global.META.token || meta.token || token,
  instanceName: process.env.INSTANCE_NAME ||
    global.META.instance ||
    meta.instance ||
    instanceName,
  host: process.env.SYNCANO_HOST ||
    global.META.api_host ||
    meta.api_host ||
    'api.syncano.io',
  spaceHost: process.env.SPACE_HOST ||
    global.META.space_host ||
    meta.space_host ||
    'syncano.space',
  apiVersion: 'v2',
  meta,
  setResponse,
  HttpResponse,
  ...props
})
