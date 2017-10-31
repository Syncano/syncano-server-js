# Responses

With `response` method you're able to:

- Set response data, MIME type and status code
- Manage response headers.

# Import

```js
const {response} = new Server(ctx)
```

# Methods

| Name                                                 | Description           |
| ---------------------------------------------------- | --------------------- |
| [response](#responsecontent-status-mimetype-headers) | Set endpoint response |
| [response.header](#responseheaderkey-value)          | Set response header   |
| [response.json](#responsejsoncontent-status)         | Set json response     |


## `response(content, status?, mimetype?, headers?)`

| Name     | Default      | Description                 |
| -------- | ------------ | --------------------------- |
| content  | null         | Response content            |
| status   | 200          | Response status code        |
| mimetype | 'text/plain' | Response media type         |
| headers  | {}           | Additional response headers |


```js
response('Hello world')

response('Hello world', 200, 'text/plain', {
  'X-RATE-LIMIT': 50
})
```

## `response.header(key, value)`

| Name  | Default | Description     |
| ----- | ------- | --------------- |
| key   | null    | Name of header  |
| value | null    | Value of header |

```js
response
  .header('X-RATE-LIMIT', 50)
  .header('X-USAGE', 35)
  ('Check headers', 200, 'plain/text')
```

## `response.json(content, status?)`

**Parameters**

| Name    | Default | Description          |
| ------- | ------- | -------------------- |
| content | null    | Response content     |
| status  | 200     | Response status code |

```js
response.json({message: 'Unauthorized'}, 401)

response
  .header('X-RATE-LIMIT', 50)
  .json({title: "Post title"})
```
