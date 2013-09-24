/*! final-events 2013-09-24 */
// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
  Object.keys = (function () {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty,
      hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
      dontEnums = [
        'toString',
        'toLocaleString',
        'valueOf',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'constructor'
      ],
      dontEnumsLength = dontEnums.length;

    return function (obj) {
      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.com/#x15.4.4.18
if (!Array.prototype.forEach) {

  Array.prototype.forEach = function forEach(callback, thisArg) {
    'use strict';
    var T, k;

    if (this == null) {
      throw new TypeError("this is null or not defined");
    }

    var kValue,
    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
      O = Object(this),

    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
      len = O.length >>> 0; // Hack to convert O.length to a UInt32

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if ({}.toString.call(callback) !== "[object Function]") {
      throw new TypeError(callback + " is not a function");
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (arguments.length >= 2) {
      T = thisArg;
    }

    // 6. Let k be 0
    k = 0;

    // 7. Repeat, while k < len
    while (k < len) {

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
        kValue = O[k];

        // ii. Call the Call internal method of callback with T as the this value and
        // argument list containing kValue, k, and O.
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };
}

//Allows only usage of `value` descriptor!
if (!Object.defineProperty) {
  Object.defineProperty = function (obj, key, descriptor) {
    obj[key] = descriptor.value;
  }
}

if (!Object.defineProperties) {
  Object.defineProperties = function (obj, descriptor) {
    Object.keys(descriptor).forEach(function (key) {
      Object.defineProperty(obj, key, descriptor[key]);
    });
  }
}
(function (exports) {

  function addEventListener(eventType, eventHandler) {
    if (!this.hasEventListener(eventType)) {
      this['@eventListeners'][eventType] = [];
    }
    this['@eventListeners'][eventType].push(eventHandler);
    return this;
  }

  function addOnceEventListener(eventType, eventHandler) {
    eventHandler.once = true;
    this.addEventListener(eventType, eventHandler);
  }

  function removeEventListener(eventType, eventHandler) {
    var eventListeners = this['@eventListeners'][eventType];

    if (!eventListeners) {
      return this;
    }

    var index = eventListeners.indexOf(eventHandler);
    if (index !== -1) {
      eventListeners.splice(index, 1);
    }

    return this;
  }

  function removeEventListeners(eventType) {
    this['@eventListeners'][eventType] = [];
    return this;
  }

  function hasEventListener(eventType) {
    return this['@eventListeners'][eventType] !== undefined;
  }

  function callListeners(event, target) {
    if (target.hasEventListener(event.type)) {
      target['@eventListeners'][event.type].forEach(function forEachEventListener(handler) {
        handler.call(target, event);
        if (handler.once) {
          target.removeEventListener(event.type, handler);
        }
      });
    }
  }

  function bubbleEvent(event, target) {
    while (target = target.parent) {
      if (event.bubble) {
        callListeners(event, target);
      }
    }
  }

  function dispatchEvent(event) {
    if (typeof event === 'string') {
      event = {type: event};
    }

    event.target = this;
    callListeners(event, this);
    bubbleEvent(event, this);

    return this;
  }

  var defaultDescriptor = {
    '@eventListeners': {value: {}},
    addEventListener: {value: addEventListener},
    on: {value: addEventListener},
    once: {value: addOnceEventListener},
    removeEventListener: {value: removeEventListener},
    off: {value: removeEventListener},
    removeEventListeners: {value: removeEventListeners},
    hasEventListener: {value: hasEventListener},
    dispatchEvent: {value: dispatchEvent},
    trigger: {value: dispatchEvent},
    emit: {value: dispatchEvent}
  };

  exports.dispatcher = function (target) {
    if (!target['@eventListeners']) { //the most characteristic property
      Object.defineProperties(target, defaultDescriptor);
    }
    return target;
  };

})(typeof exports === 'undefined' ? this['finalEvents'] = {} : exports);