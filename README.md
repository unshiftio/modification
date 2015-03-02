# modification

[![Made by unshift][made-by]](http://unshift.io)[![Version npm][version]](http://browsenpm.org/package/modification)[![Build Status][build]](https://travis-ci.org/unshiftio/modification)[![Dependencies][david]](https://david-dm.org/unshiftio/modification)[![Coverage Status][cover]](https://coveralls.io/r/unshiftio/modification?branch=master)[![IRC channel][irc]](http://webchat.freenode.net/?channels=unshift)

[made-by]: https://img.shields.io/badge/made%20by-unshift-00ffcc.svg?style=flat-square
[version]: https://img.shields.io/npm/v/modification.svg?style=flat-square
[build]: https://img.shields.io/travis/unshiftio/modification/master.svg?style=flat-square
[david]: https://img.shields.io/david/unshiftio/modification.svg?style=flat-square
[cover]: https://img.shields.io/coveralls/unshiftio/modification/master.svg?style=flat-square
[irc]: https://img.shields.io/badge/IRC-irc.freenode.net%23unshift-00a8ff.svg?style=flat-square

Modification is a small helper function that helps you process changes on the
prototype of your instances as it will automatically emit change events for
properties that you've changed.

## Installation

This module is intended for server and client usage and is released in the public
npm repository and can be installed using:

```
npm install --save modification
```

## Usage

In all of the examples we're going to assume the following setup:

```js
'use strict';

var modification = require('modification')
  , EventEmitter = require('events').EventEmitter;

function Foo() {
  this.bar = 'baz';
  this.foo = 'bar';

  EventEmitter.call(this);
}

require('util').inherits(Foo, EventEmitter);
```

The `modification` module exports function that returns another function upon
invocation. The `modification` function can called with 1 option argument which
specifies the suffix of the event that needs to be emitted:

```js
Foo.prototype.change = modification(' changed');
```

In the example above we will automatically emit `foo changed` once we change the
`foo` property through the set `.change` method:

```js
var foo = new Foo();

console.log(foo.foo); // 'bar';

foo.on('foo changed', function (currently, previously) {
  console.log(this.foo);    // hi
  console.log(currently);   // hi
  console.log(previously);  // bar
});

foo.change({ foo: 'hi' });
```

As you can see in the example above we need to pass an object with the changes
for the prototype. If one of the properties in the supplied object does not
exist on the `foo` instance we will ignore it. If it does exist but is the same
we will **not** emit the event or change the value. If it has a different value
we will emit: `<name of the property><supplied suffix>` with the current value
and the previous value.

The introduced `.change` method will `this` so it can be used for chaining.

## License

MIT
