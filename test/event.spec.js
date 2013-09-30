var dispatcher = require('../src/dispatcher.js').dispatcher;

describe('final-events capture target bubbling', function () {

  var root;
  var parent;
  var child;

  beforeEach(function () {
    root = dispatcher({id: 'root'});
    parent = dispatcher({id: 'parent', parent: root});
    child = dispatcher({id: 'child', parent: parent});
  });

  it('can stop propagation in capturing phase', function () {
    var onRootCaptureSpy = jasmine.createSpy();
    var onParentCaptureSpy = jasmine.createSpy();
    var onTargetSpy = jasmine.createSpy();
    var onParentBubbleSpy = jasmine.createSpy();
    var onRootBubbleSpy = jasmine.createSpy();

    root.on('test', function (event) {
      event.stopPropagation();
    }, true);

    root.on('test', onRootCaptureSpy, true); //this should be called
    parent.on('test', onParentCaptureSpy, true);
    child.on('test', onTargetSpy);
    parent.on('test', onParentBubbleSpy);
    root.on('test', onRootBubbleSpy);

    child.trigger('test');

    expect(onRootCaptureSpy).toHaveBeenCalled();
    expect(onParentCaptureSpy).not.toHaveBeenCalled();
    expect(onTargetSpy).not.toHaveBeenCalled();
    expect(onParentBubbleSpy).not.toHaveBeenCalled();
    expect(onRootBubbleSpy).not.toHaveBeenCalled();
  });

  it('can stop propagation in target phase', function () {
    var onRootCaptureSpy = jasmine.createSpy();
    var onParentCaptureSpy = jasmine.createSpy();
    var onTargetSpy = jasmine.createSpy();
    var onParentBubbleSpy = jasmine.createSpy();
    var onRootBubbleSpy = jasmine.createSpy();

    root.on('test', onRootCaptureSpy, true); //this should be called
    parent.on('test', onParentCaptureSpy, true);
    child.on('test', function (event) {
        event.stopPropagation();
    });
    child.on('test', onTargetSpy);
    parent.on('test', onParentBubbleSpy);
    root.on('test', onRootBubbleSpy);

    child.trigger('test');

    expect(onRootCaptureSpy).toHaveBeenCalled();
    expect(onParentCaptureSpy).toHaveBeenCalled();
    expect(onTargetSpy).toHaveBeenCalled();
    expect(onParentBubbleSpy).not.toHaveBeenCalled();
    expect(onRootBubbleSpy).not.toHaveBeenCalled();
  });

  it('can stop propagation in target phase', function () {
    var onRootCaptureSpy = jasmine.createSpy();
    var onParentCaptureSpy = jasmine.createSpy();
    var onTargetSpy = jasmine.createSpy();
    var onParentBubbleSpy = jasmine.createSpy();
    var onRootBubbleSpy = jasmine.createSpy();

    root.on('test', onRootCaptureSpy, true); //this should be called
    parent.on('test', onParentCaptureSpy, true);
    child.on('test', onTargetSpy);
    parent.on('test', function (event) {
      event.stopPropagation();
    });
    parent.on('test', onParentBubbleSpy);
    root.on('test', onRootBubbleSpy);

    child.trigger('test');

    expect(onRootCaptureSpy).toHaveBeenCalled();
    expect(onParentCaptureSpy).toHaveBeenCalled();
    expect(onTargetSpy).toHaveBeenCalled();
    expect(onParentBubbleSpy).toHaveBeenCalled();
    expect(onRootBubbleSpy).not.toHaveBeenCalled();
  });

});