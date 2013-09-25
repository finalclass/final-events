/*! final-events 2013-09-25 */
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

  function initHandlersForEventType(eventType, target) {
    if (!target.hasEventListener(eventType)) {
      target['@eventListeners'][eventType] = [];
    }
  }

  function addEventListener(eventType, eventHandler, useCapture) {
    initHandlersForEventType(eventType, this);
    this['@eventListeners'][eventType].push({
      handler: eventHandler,
      useCapture: useCapture,
      once: false
    });
    return this;
  }

  function addOnceEventListener(eventType, eventHandler, useCapture) {
    initHandlersForEventType(eventType, this);
    this['@eventListeners'][eventType].push({
      handler: eventHandler,
      useCapture: useCapture,
      once: true
    });
    return this;
  }

  function indexOfEventHandler(eventType, eventHandler, target) {
    var eventListeners = target['@eventListeners'][eventType];

    if (!eventListeners) {
      return -1;
    }

    for (var i = 0; i < eventListeners.length; i += 1) {
      if (eventListeners[i].handler === eventHandler) {
        return i;
      }
    }

    return -1;
  }

  function removeEventListener(eventType, eventHandler) {
    var eventListeners = this['@eventListeners'][eventType];
    var index = indexOfEventHandler(eventType, eventHandler, this);

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
    return this['@eventListeners'][eventType] !== undefined && this['@eventListeners'][eventType].length > 0;
  }

  function callListeners(event) {
    if (event.currentTarget.hasEventListener(event.type)) {
      event.currentTarget['@eventListeners'][event.type].forEach(function forEachEventListener(listener) {
        if (listener.useCapture && event.phase !== exports.CAPTURE_PHASE) {
          return;
        }
        if (!listener.useCapture && event.phase === exports.CAPTURE_PHASE) {
          return;
        }
        listener.handler.call(event.currentTarget, event);
        if (listener.once) {
          event.currentTarget.removeEventListener(event.type, listener.handler);
        }
      });
    }
  }

  function findParents(target) {
    var parents = [];
    while (target = target.parent) {
      parents.push(target);
    }
    return parents;
  }

  function capturePhase(event) {
    var parents = findParents(event.target);
    event.phase = exports.CAPTURE_PHASE;
    while (event.currentTarget = parents.pop()) {
      callListeners(event);
    }
  }
  
  function targetPhase(event) {
    event.phase = exports.TARGET_PHASE;
    event.currentTarget = event.target;
    callListeners(event);
  }
  
  function bubblingPhase(event) {
    event.phase = exports.BUBBLING_PHASE;
    while (event.currentTarget = event.currentTarget.parent) {
      callListeners(event);
    }
  }
  
  function dispatchEvent(event) {
    if (typeof event === 'string') {
      event = {type: event};
    }

    event.target = this;

    capturePhase(event);
    targetPhase(event);
    bubblingPhase(event);

    return this;
  }

  function getDefaultDescriptor() {
    return {
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
      emit: {value: dispatchEvent},
      fire: {value: dispatchEvent}
    };
  }

  exports.dispatcher = function (target) {
    if (!target['@eventListeners']) { //the most characteristic property
      Object.defineProperties(target, getDefaultDescriptor());
    }
    return target;
  };

  exports.CAPTURE_PHASE = 1;
  exports.TARGET_PHASE = 2;
  exports.BUBBLING_PHASE = 3;

})(typeof exports === 'undefined' ? this['finalEvents'] = {} : exports);