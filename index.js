
var decorate = require('when/decorate')
  , resultify = require('resultify')
  , streamEq = resultify(require('stream-equal'))
  , every = require('every/async')
  , apply = require('when/apply')
  , join = require('path').join
  , fs = require('resultify/fs')
  , read = fs.createReadStream
  , kids = fs.readdir
  , stat = fs.stat

module.exports = equal
equal.dir = dirs
equal.file = files

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

var arrayEqual = decorate(function(a, b){
	var i = a.length
	if (i !== b.length) return false
	for (var i = 0, len = a.length; i < len; i++) {
		if (a[i] !== b[i]) return false
	}
	return true
})