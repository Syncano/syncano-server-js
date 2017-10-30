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

```js
response(content, status?, mimetype?, headers?)
```

**Parameters**

| Name | Default |
|------|---------|
| content | null |
| status | 200 |
| mimetype | 'text/plain' |
| headers | {} |

### response.header

```js
response.header(key, value)
```

**Parameters**

| Name | Default |
|------|---------|
| key |  |
| value |  |

### response.json

```js
response.json(content, status?)
```

```js
response.json({message: 'Unauthorized'}, 401)
```

**Parameters**

| Name | Default |
|------|---------|
| content | null |
| status | 200 |
