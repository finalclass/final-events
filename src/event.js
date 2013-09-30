(function (exports) {

  function getDefaultDescriptor() {
      return {
        '@propagationStopped': {
          writable: true,
          value: false
        },
        stopPropagation: {
          value: function () {
            this['@propagationStopped'] = true;
          }
        }
      };
  }

  exports.event = function (target) {
    if (typeof target === 'string') {
      target = {type: target};
    }
    if (!target['@propagationStopped']) { //the most characteristic property
      Object.defineProperties(target, getDefaultDescriptor());
    }
    return target;
  };

})(typeof exports === 'undefined' ? this['finalEvents'] : exports);