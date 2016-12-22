import should from 'should/as-function';
import {SyncanoError, NotFoundError, ValidationError, RequestError} from '../../src/errors';

describe('SyncanoError', function() {
  let error = null;

  beforeEach(function() {
    error = new SyncanoError('dummy');
  });

  it('is a function', function() {
    should(SyncanoError).be.a.Function();
  });

  it('has a proper name attribute', function() {
    should(error).have.property('name').which.is.String().equal('SyncanoError');
  });

  it('has a proper message attribute', function() {
    should(error).have.property('message').which.is.String().equal('dummy');
  });

  it('has a proper stack attribute', function() {
    should(error).have.property('stack').which.is.String();
  });

  it('has defaults', function() {
    should(new SyncanoError()).have.property('message').which.is.String().equal('');
  });

});

describe('NotFoundError', function() {
  let error = null;

  beforeEach(function() {
    error = new NotFoundError('dummy');
  });

  it('is a function', function() {
    should(NotFoundError).be.a.Function();
  });

  it('has a proper name attribute', function() {
    should(error).have.property('name').which.is.String().equal('NotFoundError');
  });

  it('has a proper message attribute', function() {
    should(error).have.property('message').which.is.String().equal('dummy');
  });

  it('has a proper stack attribute', function() {
    should(error).have.property('stack').which.is.String();
  });

  it('has defaults', function() {
    should(new NotFoundError()).have.property('message').which.is.String().equal('No results for given query.');
  });

});

describe('ValidationError', function() {
  let error = null;

  beforeEach(function() {
    error = new ValidationError({name: ['is required', 'needs to be alphanumeric']});
  });

  it('is a function', function() {
    should(ValidationError).be.a.Function();
  });

  it('has a proper name attribute', function() {
    should(error).have.property('name').which.is.String().equal('ValidationError');
  });

  it('has a proper message attribute', function() {
    should(error).have.property('message').which.is.String().equal('"name" is required, needs to be alphanumeric');
  });

  it('has a proper stack attribute', function() {
    should(error).have.property('stack').which.is.String();
  });

  it('has a proper errors attribute', function() {
    should(error).have.property('errors').which.is.Object().properties('name');
  });

  it('has defaults', function() {
    should(new ValidationError()).have.property('errors').which.is.Object();
  });

});


describe('RequestError', function() {
  let error = null;

  beforeEach(function() {
    error = new RequestError({status: 400, response: {body: {name: ['is required']}}});
  });

  it('is a function', function() {
    should(RequestError).be.a.Function();
  });

  it('has a proper name attribute', function() {
    should(error).have.property('name').which.is.String().equal('RequestError');
  });

  it('has a proper message attribute', function() {
    should(error).have.property('message').which.is.String().equal('"name" is required');
  });

  it('has a proper stack attribute', function() {
    should(error).have.property('stack').which.is.String();
  });

  it('has a proper errors attribute', function() {
    should(error).have.property('errors').which.is.Object().properties('name');
  });

});
