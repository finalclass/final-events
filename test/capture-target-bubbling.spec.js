var finalEvents = require('../src/dispatcher.js');

describe('final-events capture target bubbling', function () {

  var root;
  var grandParent;
  var parent;
  var child;

  beforeEach(function () {
    root = finalEvents.dispatcher({name: 'root'});
    grandParent = finalEvents.dispatcher({name: 'grandParent', parent: root});
    parent = finalEvents.dispatcher({name: 'parent', parent: grandParent});
    child = finalEvents.dispatcher({name: 'child', parent: parent});
  });

  it('can attach handler only to capture phase', function () {
    root.on('test', function (event) {
      expect(event.phase).toBe(finalEvents.CAPTURE_PHASE);
    }, true);

    child.trigger('test');
  });

  it('target phase', function () {
    root.on('test', function (event) {
        expect(event.phase).not.toBe(finalEvents.TARGET_PHASE);
    });
    child.on('test', function (event) {
      expect(event.phase).toBe(finalEvents.TARGET_PHASE);
    });
    child.trigger('test');
  });

  it('can attache events only to bubbling phase', function () {
    root.on('test', function (event) {
      expect(event.phase).toBe(finalEvents.BUBBLING_PHASE);
    });
    child.trigger('test');
  });

  it('order of phsses: capture, target, bubble', function () {
    var captureSpy = jasmine.createSpy();
    var targetSpy = jasmine.createSpy();
    var bubblingSpy = jasmine.createSpy();

    root.on('test', function (event) {
      expect(captureSpy).not.toHaveBeenCalled();
      expect(targetSpy).not.toHaveBeenCalled();
      expect(bubblingSpy).not.toHaveBeenCalled();
      captureSpy();
    }, true);

    child.on('test', function (event) {
      expect(captureSpy).toHaveBeenCalled();
      expect(targetSpy).not.toHaveBeenCalled();
      expect(bubblingSpy).not.toHaveBeenCalled();
      targetSpy();
    });

    root.on('test', function (event) {
      expect(captureSpy).toHaveBeenCalled();
      expect(targetSpy).toHaveBeenCalled();
      expect(bubblingSpy).not.toHaveBeenCalled();
      bubblingSpy();
    }, false);

    child.trigger('test');

    expect(captureSpy.callCount).toBe(1);
    expect(targetSpy.callCount).toBe(1);
    expect(bubblingSpy.callCount).toBe(1);
  });

});