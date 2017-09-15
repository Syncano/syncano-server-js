export default ({meta = {}, token, instanceName, setResponse, HttpResponse}) => ({
  token: process.env.TOKEN || meta.TOKEN || token,
  instanceName: process.env.INSTANCE_NAME || meta.INSTANCE_NAME || instanceName,
  host: process.env.HOST || meta.HOST || 'api.syncano.io',
  spaceHost: process.env.SPACE_HOST || meta.SPACE_HOST || 'syncano.space',
  apiVersion: 'v2',
  meta,
  setResponse,
  HttpResponse
})
