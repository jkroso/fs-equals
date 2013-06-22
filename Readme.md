
# fs-equals

  test pieces of the file system for equality

## Getting Started

_With npm_  

	$ npm install fs-equals --save

then in your app:

```js
var equals = require('fs-equals')
var assert = require('fs-equals/assert')
```

## API

Each function is available as either an assertion or boolean predicate test. If your using this module in a test suite you probably want the assertion version since it will provide more useful information about failures

  - [equals()](#equals)
  - [dirs()](#dirs)
  - [files()](#files)

### equals(apath:String, bpath:String)

  compare whatever happens to be at either path. The result is returned as a [Result](//github.com/jkroso/result)

### dirs(apath:String, bpath:String)

  test the contents of two directories for equality

### files(apath:String, bpath:String)

  test the contents of two files for equality

## examples

  see the [tests](test/index.test.js)

## Running the tests

```bash
$ npm install
$ make test
```