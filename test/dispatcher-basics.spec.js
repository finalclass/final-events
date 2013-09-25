var dispatcher = require('../src/dispatcher.js').dispatcher;

describe('final-events dispatcher basics', function () {
  var disp1, disp2;

  beforeEach(function () {
    disp1 = dispatcher({});
    disp2 = dispatcher({});
  });

  it('adds event listeners', function () {
    var callback = function () { };
    expect(function () {
      disp1.addEventListener('test', callback);
    }).not.toThrow();
  });

  it('can dispatch events', function () {
    var spy = jasmine.createSpy('event-handler');

    disp1.addEventListener('test', spy);
    disp1.dispatchEvent({type: 'test'});

    expect(spy).toHaveBeenCalled();
  });

  it('can dispatch event given by the string', function () {
    var spy = jasmine.createSpy('event-handler');

    disp1.addEventListener('test', spy);
    disp1.dispatchEvent('test');

    expect(spy).toHaveBeenCalled();
  });

  it('has short syntax', function () {
    var spy = jasmine.createSpy('event-handler');
    disp1.on('test', spy);
    disp1.trigger('test');
    expect(spy).toHaveBeenCalled();
  });

  it('can remove listeners', function () {
    var spy = jasmine.createSpy('event-handler');
    disp1.on('test', spy);
    disp1.off('test', spy);
    disp1.trigger('test');
    expect(spy).not.toHaveBeenCalled();
  });

});