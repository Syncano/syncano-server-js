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
| [response.header](#responseheader) | Manage response headers |
| [response.json](#responsejson) | Set json response |

## Details

### response

```js
response(content, status?, mimetype?, headers?)
```

```js
response('Hello world')
response('Hello world', 200, 'text/plain', {
  'X-RATE-LIMIT': 50
})
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

```js
response
  .header('X-RATE-LIMIT', 50)
  .header('X-USAGE', 35)
  ('Check headers', 200, 'plain/text')
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
response
  .header('X-RATE-LIMIT', 50)
  .json({title: "Post title"})
```

**Parameters**

| Name | Default |
|------|---------|
| content | null |
| status | 200 |
