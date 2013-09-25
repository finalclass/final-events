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