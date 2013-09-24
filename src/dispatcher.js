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
  };

})(typeof exports === 'undefined' ? this['finalEvents'] = {} : exports);