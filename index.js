
var streamEq = require('lift-result/cps')(require('stream-equal'))
var apply = require('lift-result/apply')
var every = require('every/async')
var fs = require('lift-result/fs')
var lift = require('lift-result')
var join = require('path').join
var read = fs.createReadStream
var kids = fs.readdir
var stat = fs.stat

module.exports = exports = equal
exports.dir = dirs
exports.file = files

/**
 * compare whatever happens to be at either path
 *
 * @param {String} apath
 * @param {String} bpath
 * @return {Promise} Boolean
 */

function equal(ap, bp){
	return apply(stat(ap), stat(bp), function(a, b){
		if (a.isDirectory() && b.isDirectory()) return dirs(ap, bp)
		if (a.isFile() && b.isFile()) return files(ap, bp)
		return false
	})
}

/**
 * test the contents of two directories for equality
 *
 * @param {String} a
 * @param {String} b
 * @return {Promise} Boolean
 */

function dirs(a, b){
	var akids = kids(a)
	return arrayEqual(akids, kids(b)).then(function(sameKids){
		return sameKids && every(akids, function(kid){
			return equal(join(a, kid), join(b, kid))
		})
	})
}

/**
 * test the contents of two files for equality
 *
 * @param {String} a
 * @param {String} b
 * @return {Result} Boolean
 */

function files(a, b){
	return streamEq(read(a), read(b))
}

/**
 * check the contents of two arrays for equality
 *
 * @param {Array} a
 * @param {Array} b
 * @return {Result} boolean
 * @api private
 */

var arrayEqual = lift(function(a, b){
	var i = a.length
	if (i !== b.length) return false
	for (var i = 0, len = a.length; i < len; i++) {
		if (a[i] !== b[i]) return false
	}
	return true
})