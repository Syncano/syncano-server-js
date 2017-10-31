# Documentation

- [Cheat Sheet][cheatsheet]
- Getting Started
  - [Usage in Syncano Socket](#usage-in-syncano-socket)
  - [Installation](#installation)
- Architecture Concepts
  - [Socket](/docs/socket.md)*
  - [Socket Context](/docs/socket-context.md)*
- The Basics
  - [Data](/docs/data.md)*
  - [Users](/docs/users.md)
  - [Responses](/docs/responses.md)
  - [Endpoints](/docs/endpoints.md)*
  - [Channels](/docs/channels.md)*
  - [Events](/docs/events.md)*
  - [Logger](/docs/logger.md)*
- Syncano Core
  - [Syncano Account](/docs/syncano-account.md)*
  - [Syncano Backups](/docs/syncano-backups.md)*
  - [Syncano Classes](/docs/syncano-classes.md)*
  - [Syncano Hostings](/docs/syncano-hostings.md)*
  - [Syncano Instances](/docs/syncano-instances.md)*
  - [Syncano Sockets](/docs/syncano-sockets.md)*
  - [Syncano Traces](/docs/syncano-traces.md)*

`*` - TODO

## Usage in Syncano Socket

To learn about Syncano Sockets visit [documentation][socket].

```js
import Syncano from 'syncano-server'
          
export default async ctx => {
  // Initialize Syncano Server Library
  const {data, response} = new Syncano(ctx)

  // Check if user is authenticated
  if (!ctx.meta.user) {
    response.json({message: 'Unauthorized'}, 401)
    process.exit(0)
  }

  // Get user id from Socket Context
  const {id: author} = ctx.meta.user
  const {title} = ctx.args

  // Create post
  const post = await data.posts.create({title, author})

  // Respond with created post
  response.json(post)
}
```

## Installation

To install Syncano Server Library, use npm or yarn in your [socket][socket].
<pre>
npm i <a href="https://www.npmjs.com/package/syncano-server">syncano-server</a> --save
</pre>

[socket]: https://syncano.github.io/syncano-node-cli/#/using-sockets/overview
[cheatsheet]: https://cheatsheet.syncano.io/#server
