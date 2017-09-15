export default ({meta = {}, token, instanceName, setResponse, HttpResponse, ...props}) => ({
  token: process.env.TOKEN || meta.token || token,
  instanceName: process.env.INSTANCE_NAME || meta.instance || instanceName,
  host: process.env.SYNCANO_HOST || meta.api_host || 'api.syncano.io',
  spaceHost: process.env.SPACE_HOST || meta.space_host || 'syncano.space',
  apiVersion: 'v2',
  meta,
  setResponse,
  HttpResponse,
  ...props
})
