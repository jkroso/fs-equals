
var should = require('chai').should()
	, assert = require('../assert')
	, equals = require('..')
	, file = equals.file
	, dir = equals.dir

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

describe('assert.js', function () {
	it('should return undefined if equal', function (done) {
		assert(a, b).then(function(answer){
			should.not.exist(answer)
			return assert(a+'/index.js', b+'/index.js').then(function(answer){
				should.not.exist(answer)
			})
		}).node(done)
	})

	describe('should error if not equal', function () {
		it('dirs', function (done) {
			assert(a, c).then(function(answer){
				should.not.exist(answer)
			}).then(null, function(e){ 
				e.stack.should.include('test/fixture-a')
			}).node(done)
		})

		it('files', function (done) {
			assert(a+'/index.js', c+'/index.js').then(function(answer){
				should.not.exist(answer)
			}).then(null, function(e){
				e.stack.should.include('test/fixture-a/index.js')
			}).node(done)
		})
	})

	describe('options', function () {
		describe('.name', function () {
			it('should filter files', function (done) {
				assert(a, c, {
					name: function(name){ 
						return !(/test|\.gitignore|index\.js/).test(name)
					}
				}).node(done)
			})
		})
	})
})
