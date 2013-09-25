Final-Events
===============

Event dispatcher with the bubbling feature

## Installation

### node

```bash
npm install final-events
```

```js
var dispatcher = require('final-events').dispatcher;
```

### browser

```bash
bower install final-events
```

```html
<script type="text/javascript" href="/bower_components/final-events/build/final-events.js"></script>
<script>
    var dispatcher = window.finalEvents.dispatcher;
</script>
```

## Building

```bash
npm install --dev
grunt
```

## Testing

```bash
npm install --dev
npm test
```

## Documentation

### Quick start

#### Instantiation

In order to convert any object to the finalEvents.dispatcher you should do:

```js
var myObject = {};
finalEvents.dispatcher(myObject);
myObject.on('test', function (event) {
  console.log('Hello!');
});
myObject.trigger('test');
```

#### Chaining

You can chain your functions:

```js
var disp = finalEvents.dispatcher({});

disp
  .on('test', function (event) {

  })
  .on('test2', function (event) {

  })
  .on('test3', function (event) {

  })
  .trigger('test')
  .trigger({type: 'test2', data: 'DATA'})
  .trigger({type: 'test3'});
```

### API

#### addEventListener(eventType:string, eventHandler:Function, useCapture:boolean) : Object

Adds event listener to the object.
You can set useCapture flag on this object if you want this listener to be called on the capture phase
(see dispatchEvent method documentation below)

#### on(eventType:string, listenerFunction:Function, useCapture:boolean) : Object

Alias for `addEventListener` method.

#### once(eventType:string, eventHandler:Function, useCapture:boolean) : Object

Same as `addEventListener` but after beeing executed it's removed from the listeners

#### removeEventListener(eventType:string, eventHandler:Function) : Object

Stops listening by eventHandler for the given eventType.

#### off(eventType:string, eventHandler:Function) : Object

Alias for `removeEventListener` method.

#### hasEventListener(eventType:string) : boolean

Returns true if `this` has any listener for the given eventType

#### dispatchEvent(event:string|object) : Object

The `event` argument can be eighter string or object with the type property.
If `event` argument is a string then it's converted to the object ({type: event}).
The default syntax is to give object ({type:string}) as an argument however if you provide string
then it's ok - it'll be converted to the object. So these are valid invocations:

```js
var disp = finalEvents.dispatcher({});

disp.dispatchEvent('test');
disp.dispatchEvent({type: 'test'});
```

But these are not valid:

```js
var disp = finalEvents.dispatcher({});

disp.dispatchEvent({data: 'abc'}); //no type property provided
```

finalEvents uses duck typing and for the dispatcher an event is an every object that has a type property.

After dispatching a event it's at first at capture phase. This means that this event will capture from top of a three to the bottom.

Next step is the target phase. In this phase the event is on the target that dispatched it.

The final phase is a bubbling phase. Now event flows from the target to the root. When it reaches the root element the event is destroyed.

A tree is determined byt the `parent` property of the leaf object. If there is no `parent` property, event will not be in the capture phase nor in the bubbling phase.

#### trigger(event:string|object) : Object

Alias for `dispatchEvent` method.

#### emit(event:string|object) : Object

Alias for `dispatchEvent` method.

#### fire(event:string|object) : Object

Alias for `dispatchEvent` method.


## License

The MIT License (MIT)

Copyright (c) 2013 Szymon Wygnański <s@finalclass.net>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.