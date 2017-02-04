import { expect } from 'chai';

import server from '../../src'

describe('Account', function () {
  let account = null;

  before(function () {
    account = server().account
  });

  it('can\'t get account with dummy key', function(done) {
    return account.get('dummy key')
      .then(account => {
        done(new Error('Supprise I\'m in!'))
      })
      .catch(err => {
        expect(err.response.status).to.be.equal(403)
        done()
      })
  });
});
