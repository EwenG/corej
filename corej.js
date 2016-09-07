export function get(data, k, defaultVal) {
  if(data == null) {
    return defaultVal
  } else if (k in data) {
    return data[k]
  } else {
    return defaultVal
  }
}

export function getIn(data, ks, defaultVal) {
  if(data == null) {
    return defaultVal
  }
  var ksLengthDec = ks.length - 1
  var tmp = data
  for(var i = 0; i < ksLengthDec; ++i) {
    var key = ks[i]
    if(tmp && key in tmp) {
      tmp = tmp[key]
    } else {
      return defaultVal
    }
  }
  if(ksLengthDec > -1) {
    return get(tmp, ks[ksLengthDec], defaultVal)
  } else {
    return defaultVal
  }
}

export function cloneObj(obj) {
  const result = {};
  Object.keys(obj).forEach(key => {
    result[key] = obj[key]
  });
  return result;
}

export function clone(data) {
  var copy
  //null or undefined
  if(data == null) {
    copy = {}
  } else if(Array.isArray(data)) {
    copy = data.slice()
  } else {
    copy = cloneObj(data)
  }
  return copy
}

export function assoc(data, k, v) {
  var argLength = arguments.length
  if((argLength & 1) === 0) {
    throw Error('assoc expects even number of arguments after array/object, found odd number')
  }
  var copy = clone(data)
  var tmpK
  for(var i = 1; i < argLength; ++i) {
    if((i & 1) === 1) {
      tmpK = arguments[i]
    } else {
      copy[tmpK] = arguments[i]
    }
  }
  return copy
}

export function dissoc(data) {
  var argLength = arguments.length
  var copy = clone(data)
  for(var i = 1; i < argLength; ++i) {
    var k = arguments[i]
    if(copy && k in copy) {
      delete copy[k]
    }
  }
  return copy
}

function assocInHelper(data, ks, v, ksLengthDec, ksIndex) {
  var copy = clone(data)
  if(ksIndex === ksLengthDec) {
    copy[ks[ksIndex]] = v
    return copy
  } else {
    copy[ks[ksIndex]] = assocInHelper(copy[ks[ksIndex]], ks, v, ksLengthDec, ksIndex + 1)
    return copy
  }
}

export function assocIn(data, ks, v) {
  var ksLength = ks.length
  if(ksLength === 0) {
    return clone(data)
  } else {
    return assocInHelper(data, ks, v, ksLength - 1, 0)
  }
}

function updateInHelper(data, ks, fn, ksLengthDec, ksIndex, fnArgs) {
  var copy = clone(data)
  if(ksIndex === ksLengthDec) {
    var fnArgsLength = fnArgs.length
    if(fnArgsLength === 3) {
      copy[ks[ksIndex]] = fn(copy[ks[ksIndex]])
    } else if(fnArgsLength === 4) {
      copy[ks[ksIndex]] = fn(copy[ks[ksIndex]], fnArgs[3])
    } else if(fnArgsLength === 5) {
      copy[ks[ksIndex]] = fn(copy[ks[ksIndex]], fnArgs[3], fnArgs[4])
    } else {
      var args = [copy[ks[ksIndex]]]
      for(var i = 3; i < fnArgsLength; ++i) {
        args.push(fnArgs[i])
      }
      copy[ks[ksIndex]] = fn.apply(null, args)
    }
    return copy
  } else {
    copy[ks[ksIndex]] = updateInHelper(copy[ks[ksIndex]], ks, fn, ksLengthDec, ksIndex + 1, fnArgs)
    return copy
  }
}

export function updateIn(data, ks, fn) {
  var ksLength = ks.length
  if(ksLength === 0) {
    return clone(data)
  } else {
    return updateInHelper(data, ks, fn, ksLength - 1, 0, arguments)
  }
}

export function merge() {
  var argsLength = arguments.length
  var target = {}
  for (var i = 0; i < argsLength; ++i) {
    var source = arguments[i];
    if (source != null) {
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
  }
  return target
}
