
var fs = require('fs')
  , path = require('path')
  , join = path.join
  , relative = path.relative
  , both = require('when-all/naked')
  , each = require('foreach/async/promise')
  , promisify = require('promisify')
  , kids = promisify(fs.readdir)
  , stat = promisify(fs.stat)
  , read = promisify(fs.readFile)
  , exists = fs.existsSync
  , AssertionError = require('assert').AssertionError

exports = module.exports = function(a, b, opts){
	if (!exists(a)) throw new Error(a+' does not exist')
	if (!exists(b)) throw new Error(b+' does not exist')
	return equal(a, b, opts || {})
}

// exports
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
	return both(stat(ap), stat(bp)).spread(function(a, b){
		if (a.isDirectory() && b.isDirectory) return dirs(ap, bp, opts)
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
	return both(kids(a), kids(b)).spread(function(akids, bkids){
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
 * @return {Promise} nil
 */

function files(a, b){
	return both(read(a, 'utf8'), read(b, 'utf8'))
		.spread(function(aText, bText){
			if (aText !== bText) throw error('file', a, b)
		})
}
