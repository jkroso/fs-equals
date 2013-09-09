
var AssertionError = require('assert').AssertionError
var apply = require('lift-result/apply')
var each = require('foreach/async')
var fs = require('lift-result/fs')
var exists = fs.existsSync
var read = fs.readFile
var kids = fs.readdir
var stat = fs.stat
var path = require('path')
var relative = path.relative
var join = path.join

module.exports = exports = function(a, b, opts){
	if (!exists(a)) throw new Error(a+' does not exist')
	if (!exists(b)) throw new Error(b+' does not exist')
	return equal(a, b, opts || {})
}

exports.dir = dirs
exports.file = files

/**
 * compare whatever happens to be at either path
 *
 * @param {String} apath
 * @param {String} bpath
 * @param {Object} opts
 * @return {Promise} Boolean
 */

function equal(ap, bp, opts){
	return apply(stat(ap), stat(bp), function(a, b){
		if (a.isDirectory() && b.isDirectory()) return dirs(ap, bp, opts)
		if (a.isFile() && b.isFile()) return files(ap, bp, opts)
		throw new Error('fs-equals/assert.js doesn\'t know what to do with this type: '+ap)
	})
}

/**
 * assert the contents of two directories are equal
 * 
 * @param {String} a
 * @param {String} b
 * @param {Object} opts
 * @return {Promise} nil
 */

function dirs(a, b, opts){
	return apply(kids(a), kids(b), function(akids, bkids){
		if (opts.name) {
			akids = akids.filter(opts.name)
			bkids = bkids.filter(opts.name)
		}
		var diff = compareArrays(akids, bkids)
		if (diff) throw error('directory', a, b, diff)
		return each(akids, function(entry){
			return equal(join(a, entry), join(b, entry), opts)
		})
	})
}

/**
 * generate a nice error
 * (path, path, diff) -> Error
 */

function error(type, a, b, diff){
	var cwd = process.cwd()
	var head = type + ' ' + relative(cwd, a) + ' != ' + relative(cwd, b)
	return new AssertionError({
		message: head  + '\n' + (diff ? diff + '\n' : '')
	})
}

/**
 * generate a crude diff message
 * (Array, Array) -> String
 */

function compareArrays(a, b){
	var msg = ''
	a.forEach(function(f){
		if (b.indexOf(f) < 0) msg += '  + ' + f + '\n'
	})
	b.forEach(function(f){
		if (a.indexOf(f) < 0) msg += '  - ' + f + '\n'
	})
	return msg
}

/**
 * assert the contents of two files are equal
 * 
 * @param {String} a
 * @param {String} b
 * @return {Result} nil
 */

function files(a, b){
	return apply(read(a, 'utf8'), read(b, 'utf8'), function(aText, bText){
		if (aText !== bText) throw error('file', a, b)
	})
}
