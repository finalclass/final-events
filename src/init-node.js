if (typeof window === 'undefined') {
  exports.dispatcher = require('./dispatcher.js').dispatcher;
  exports.event = require('./event.js').event;
}