[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)   [![CircleCI](https://circleci.com/gh/Syncano/syncano-server-js/tree/devel.svg?style=shield&circle-token=0340c11444db6f3dc227cf310f4d8ff1bd90dee8)](https://circleci.com/gh/Syncano/syncano-server-js/tree/devel)
[![codecov](https://codecov.io/gh/Syncano/syncano-server-js/branch/devel/graph/badge.svg)](https://codecov.io/gh/Syncano/syncano-server-js)

# Syncano Server-side Library

This library supposed to be used in **Syncano Sockets** (inside scripts)
to communicate with **Syncano Core Services**. Syncano provides various Core Services:
- **Database (db)** - NoSQL database to store your application data
- **Users Management (users)** - service to store and manage users and groups of your application
- **Event Loop (events)** - service to emit events which can be caught by any Socket
- **Realtime Channels (channels)** - implement publish/subscribe model for realtime communication

## Library initialization

To initialize library simply type:
```js
import server from 'syncano-server-js'

const { data, events } = server()
```

Library initiated that way will grab necessary information from the context of you Socket Script - it means that you don't need to provide additional information such as Instance name or authentication key (token) to your Instance.

If you want to force the library to connect to specified instance type:
```js
const { data, events } = server({
  token: '9-12jdiasdnfo23nrokms',
  instanceName: 'example-instance-name'
})
```

## Examples

### Using Database (data)

In this example `tags` is a name of a class (data model) configured for that instance.

```js
// Create new object in tags class
data.tags
  .create({
    name: 'javascript',
    usage_count: 0
  })
  .then(tag => {});

// Get list of 140 tags used more than 100 times
data.tags
  .where('usage_count', 'gt', 100)
  .take(140)
  .list()
  .then(tags => {})

// Get list of post where author is reference to other class 
// and author email is john@example.com
data.posts
  .where('author.email', 'john@example.com')
  .list()
  .then(posts => {})

// Get list of post - author column will be expanded with data from target class
data.posts
  .with('author')
  .list()
  .then(posts => {})

// Delete tags with with given array of ids
data.tags.delete([8735, 8733])

// Delete single tag
data.tags.delete(7652)
```

### Managing users (users)

```js
// Get first user with given mail
data.users
  .where('email', 'john.doe@example.com')
  .first()
  .then(user => {
    // user variable is null if not found
    // so no need for catch method
  })

// Get first user with given mail, throws error if user was not found
data.users
  .where('email', 'john.doe@example.com')
  .firstOrFail()
  .then(user => {})
  .then(err => {
    // error is thrown if user was not found
  })
```

### Using Events (events)

```js
event.emit('my_signal', {dummyKey: 'dummy_value'})
  .then(event => {})
  .catch(err => {
    // error is thrown if emit was unsuccessful
  })
```

Check [documentation](http://syncano.github.io/syncano-server-js/) to learn more.
