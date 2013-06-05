
var Promise = require('laissez-faire/full')
  , streamEq = require('stream-equal')
  , both = require('when-all/naked')
  , every = require('every/async')
  , fs = require('promisify/fs')
  , join = require('path').join
  , kids = fs.readdir
  , stat = fs.stat
  , read = fs.createReadStream

// exports
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
	return both(stat(ap), stat(bp)).spread(function(a, b){
		if (a.isDirectory() && b.isDirectory) return dirs(ap, bp)
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
	return both(kids(a), kids(b)).spread(function(akids, bkids){
		if (!arrayEq(akids, bkids)) return false
		return every(akids, function(entry){
			return equal(join(a, entry), join(b, entry))
		})
	})
}

/**
 * test the contents of two files for equality
 * 
 * @param {String} a
 * @param {String} b
 * @return {Promise} Boolean
 */

function files(a, b){
	var p = new Promise
	streamEq(read(a), read(b), function(e, answer){
		if (e) p.reject(e)
		else p.fulfill(answer)
	})
	return p
}

/**
 * check the contents of two arrays for equality
 *
 * @param {Array} a
 * @param {Array} b
 * @return {Boolean}
 * @api private
 */

function arrayEq(a, b){
	var i = a.length
	if (i !== b.length) return false
	for (var i = 0, len = a.length; i < len; i++) {
		if (a[i] !== b[i]) return false
	}
	return true
}
