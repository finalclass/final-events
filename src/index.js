(function(exports){

  if (typeof exports !== 'undefined') {
    exports.dispatcher = require('./dispatcher.js').dispatcher;
  }

})(typeof exports === 'undefined'? this['finalEvents'] = {}: exports);