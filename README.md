[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)   [![CircleCI](https://circleci.com/gh/Syncano/syncano-server-js/tree/devel.svg?style=shield&circle-token=0340c11444db6f3dc227cf310f4d8ff1bd90dee8)](https://circleci.com/gh/Syncano/syncano-server-js/tree/devel)

# Syncano server

## Library initialization

```js
import server from 'syncano-server-js'

const { data, events } = server()
// OR 
const { data, events } = server({
  token: '9-12jdiasdnfo23nrokms',
  instance: 'example-instance-name'
})
```

## Examples

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

// Get list of 140 tags used more than 100 times
data.tags
  .where('usage_count', 'gt', 100)
  .take(140)
  .list()
  .then(tags => {})

// Delete tags with with given array of ids
data.tags.delete([8735, 8733])

// Delete single tag
data.tags.delete(7652)
```

Check [documentation](http://syncano.github.io/syncano-server-js/) to learn more.
