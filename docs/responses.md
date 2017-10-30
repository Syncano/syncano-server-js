# Responses

With `response` method you're able to:

- Set response data, MIME type and status code
- Manage response headers.

## Import

```js
const {response} = new Server(ctx)
```

## Methods

| Name | Description |
|------|-------------|
| [response](#response) | Set response |
| [response.header](#response.header) | Manage response headers |
| [response.json](#response.json) | Set json response |

## Details

### response

```
response(content, status, mimetype, headers)
```

**Parameters**

| Name | Default |
|------|---------|
| content | null |
| status | 200 |
| mimetype | 'text/plain' |
| headers | {} |

### response.header

```
response.header(key, value)
```

### response.json

```
response.json(content, status?)
```
