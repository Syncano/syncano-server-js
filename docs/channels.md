# Channels

With `channel` method you're able to:

- Publish messages to realtime channels

# Import

```js
const {channel} = new Server(ctx)
```

# Methods

| Name                               | Description                |
| ---------------------------------- | -------------------------- |
| [channel.publish](#channelpublish) | Publish message to channel |


## `channel.publish(channel, payload?)`

| Name    | Default | Description                       |
| ------- | ------- | --------------------------------- |
| channel | null    | Name of the channel               |
| payload | null    | Additional data passed to channel |

#### Publishing to channel

```yaml
endpoints:
  messages:
    channel: messages
```

```js
channel.publish('messages', {content: 'hello'})
```

#### Publishing to channel

```yaml
endpoints:
  messages:
    channel: messages.{room}
```

```js
channel.publish(`messages.${room}`, {content: 'hello'})
```

#### Publishing to channel

```yaml
endpoints:
  messages:
    channel: messages.{user}
```

```js
channel.publish(`messages.${username}`, {content: 'hello'})
```
