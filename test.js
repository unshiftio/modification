describe('modification', function () {
  'use strict';

  var EventEmitter = require('events').EventEmitter
    , modification = require('./')
    , assume = require('assume')
    , util = require('util')
    , Fixture;

  beforeEach(function () {
    function Fix() {
      EventEmitter.call(this);

      this.foo = 'bar';
    }

    util.inherits(Fix, EventEmitter);
    Fixture = Fix;
  });

  it('is exported as a function', function () {
    assume(modification).is.a('function');
  });

  it('returns a function', function () {
    assume(modification()).is.a('function');
  });

  it('it does not introduce new properties', function () {
    Fixture.prototype.change = modification();
    var fixture = new Fixture();

    assume(fixture.bar).is.undefined();
    fixture.change({ bar: 'hi', foo: 'mom' });
    assume(fixture.bar).is.undefined();
  });

  it('changes the property if values are not equal', function () {
    Fixture.prototype.change = modification();
    var fixture = new Fixture();

    assume(fixture.foo).equals('bar');
    fixture.change({ foo: 'hi' });
    assume(fixture.foo).equals('hi');
  });

  it('emits an event on the instance when things change', function (next) {
    Fixture.prototype.change = modification(' changed');
    var fixture = new Fixture();

    fixture.once('foo changed', function (currently, previously) {
      assume(fixture.foo).equals('hi');
      assume(fixture.foo).equals(currently);
      assume(previously).equals('bar');

      next();
    });

    assume(fixture.foo).equals('bar');
    fixture.change({ foo: 'hi' });
  });

  it('returns this', function () {
    Fixture.prototype.change = modification(' changed');
    var fixture = new Fixture();

    assume(fixture.change()).equals(fixture);
    assume(fixture.change({ foo: 'bar' })).equals(fixture);
    assume(fixture.change({ bar: 'bar' })).equals(fixture);
    assume(fixture.change({ bar: 'bar', foo: 'mom' })).equals(fixture);

    assume(fixture.foo).equals('mom');
  });

  it('can be triggered without suffix', function (next) {
    Fixture.prototype.change = modification();
    var fixture = new Fixture();

    fixture.once('foo', function (currently, previously) {
      assume(fixture.foo).equals('hi');
      assume(fixture.foo).equals(currently);
      assume(previously).equals('bar');

      next();
    });

    assume(fixture.foo).equals('bar');
    fixture.change({ foo: 'hi' });
  });
});
