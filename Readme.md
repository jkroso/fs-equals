
# fs-equals

  test pieces of the file system for equality

## Getting Started

_With npm_  

	$ npm install fs-equals --save

then in your app:

```js
var fs-equals = require('fs-equals')
```

## API

  - [equals()](#equals)
  - [dirs()](#dirs)
  - [files()](#files)

### equals(apath:String, bpath:String)

  compare whatever happens to be at either path. The result is returned via a promise

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

_Note: these commands don't work on windows._ 

## License 

[MIT](License)