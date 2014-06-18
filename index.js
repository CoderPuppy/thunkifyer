function thunkifyer(val) {
	if(Array.isArray(val))
		return thunkifyObj(val)
	if(val != null && val.constructor == Object)
		return thunkifyObj(val)
	if(isPromise(val))
		return thunkifyPromise(val)
	if(thunkifyer.is(val))
		return val

	throw new Error('Cannot convert to thunk')
}

thunkifyer.is = function(val) {
	return typeof(val) == 'function' && val.length == 1
}

thunkifyer.can = function(val) {
	if(Array.isArray(val))
		return true
	if(val != null && val.constructor == Object)
		return true
	if(isPromise(val))
		return true
	if(thunkifyer.is(val))
		return true
	return false
}

function thunkifyObj(obj) {
	var cbs = []
	var done = false, err, res
	for(var k in obj) {
		var v = obj[k]
		if(thunkifyer.can(v)) {
			required += 1
			thunkifyer(v)(function(sErr, sRes) {
				required -= 1
				if(!done) {
					if(sErr || required == 0) {
						err = sErr
						res = sRes
						done = true
						cbs.forEach(function(cb) {
							cb(err, res)
						})
					}
				}
			})
		}
	}
	return function(cb) {
		if(done)
			cb(err, res)
		else
			cbs.push(cb)
	}
}

function isPromise(val) {
	return val !== null && val !== undefined && typeof(val.then) == 'function'
}

function thunkifyPromise(promise) {
	return function(cb) {
		promise.then(function(res) {
			cb(null, res)
		}, function(err) {
			cb(err)
		})
	}
}

exports = module.exports = thunkifyer