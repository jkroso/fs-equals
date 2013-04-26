
var equals = require('..')
  , dir = equals.dir
  , file = equals.file
  , should = require('chai').should()

var a = __dirname+'/fixture-a'
var b = __dirname+'/fixture-b'
var c = __dirname+'/fixture-c'

describe('file', function () {
  it('should pass for equal files', function (done) {
    file(a+'/index.js', b+'/index.js').then(function(answer){
      answer.should.be.true
    }).node(done)
  })

  it('should fail for unequal files', function (done) {
    file(a+'/index.js', c+'/index.js').then(function(answer){
      answer.should.be.false
    }).node(done)
  })
})

describe('dir', function () {
  it('should pass for equal dirs', function (done) {
    dir(a, b).then(function(answer){
      answer.should.be.true
    }).node(done)
  })

  it('should fail for unequal dirs', function (done) {
    dir(a, c).then(function(answer){
      answer.should.be.false
    }).node(done)
  })
})

describe('index.js', function () {
  it('should work for files and dirs', function (done) {
    equals(a,b).then(function(answer){
      answer.should.be.true
      return equals(a+'/index.js', b+'/index.js').then(function(answer){
        answer.should.be.true
      })
    }).node(done)
  })
})
