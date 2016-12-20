import should from 'should/as-function';
import { NotFoundError } from '../../src/errors';


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
