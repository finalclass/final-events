var dispatcher = require('../src/dispatcher.js').dispatcher;

describe('final-events instantiation', function () {
  var obj1, obj2;

  beforeEach(function () {
    obj1 = {};
    obj2 = {};
  });

  it('converts objects into event dispatcher', function () {
    expect(function () {
      dispatcher(obj1);
    }).not.toThrow();
    expect(obj1['@eventListeners']).toBeDefined();
  });

  it('just test it', function () {
    var disp1 = dispatcher(obj1);
    var disp2 = dispatcher(obj2);

    expect(disp1.hasEventListener('test2')).toBeFalsy();
    disp2.on('test2', function () { });
    expect(disp1.hasEventListener('test2')).toBeFalsy();
  });

});