
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
  , AssertionError = require('assert').AssertionError

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
	})
}

/**
 * assert the contents of two directories are equal
 * 
 * @param {String} a
 * @param {String} b
 * @return {Promise} nil
 */

function dirs(a, b){
	return both(kids(a), kids(b)).spread(function(akids, bkids){
		var diff = compareArrays(akids, bkids)
		if (diff) throw error('directory', a, b, diff)
		return each(akids, function(entry){
			return equal(join(a, entry), join(b, entry))
		})
	})
}

/**
 * generate a nice error
 * (path, path, diff) -> Error
 */

function error(type, a, b, diff){
	var cwd = process.cwd()
	var head = type + ' ' + relative(cwd, a) + ' not equal to ' + relative(cwd, b)
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
