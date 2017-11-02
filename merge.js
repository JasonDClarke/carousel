;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.merge = factory()
}(this, function() { 'use strict';
return function merge(defaultObject, customObject) {
  //add custom keys
  for (var key in customObject) {
    if (!defaultObject.hasOwnProperty(key)) {
      defaultObject[key] = customObject[key]
    } else {
      console.log(customObject[key])
    }

  }

  //overwrite keys
  for (var key in defaultObject) {
    if (defaultObject[key] !== Object(defaultObject[key]) &&
  customObject.hasOwnProperty(key)) {
      defaultObject[key] = customObject[key]
    }
    //look in next layer
    //checks if key has a nested object (dubious about the trustworthiness of this)
    else if (defaultObject[key] === Object(defaultObject[key])
  && customObject[key]) {
      merge(defaultObject[key], customObject[key])
    }
  }
}
}));
