# immutable-setter
Exposes *setIn(object, keyPath, value)*, *getIn(object, keyPath)* helper functions to simplify setting (and reading) values
in the immutable objects.

*setIn* function preserves structural sharing - returned new object has new objects created for each new or 
modified value along the keyPath.

*getIn* function provided for completeness - it returns value specified by the keyPath or undefined if key/index
of the kyePath not found in the traversed object. This eliminates necessity of checking if each value along the keyPath
is defined before getting the target value. 

## Motivation
While working with [Redux](https://github.com/reactjs/redux) based immutable state container, it is convenient
to be able to set object properties few levels deep in the object hierarchy in immutable fashion. 
Usually this is done through hierarchy of reducers. But sometimes it is convenient to do it "inline" 
through one function call. A specially in tests.

For completeness getIn function 

## API
```
setIn(object: Object, keyPath: Array<String|Number(Int)|undefined>, value: Any) => Object
```

* object - plain javascript object. It will be treated as immutable.
* keyPath - array of keys and indexes specifying path to the property to be set in the the objects hierarchy.
    can contain undefined keys indicating that value should be pushed to the and of array. 
    If key is specified and it is not a last element of the keyPath and corresponding subValue  doesn't exist then
    if next key is a String than new object will be created, if next key is Number or undefined then
    Array will be created
* value - new value to be set

* return - new object with new objects created along the keyPath

```
getIn(object: Object, keyPath: Array<String|Number(Int)|undefined>) => Any|undefined
```
* object - plain javascript object. It will be treated as immutable.
* keyPath - array of keys and indexes specifying path to property to read.

### Examples:

```js
//update existing property
setIn({a:'foo', b:{c:'abc'}}, ['b', 'c'], 'bar') => {a:'foo', b:{c:'bar'}}

//property 'b' not found in the source object
setIn({a:'foo'}, ['b', 'c'], 'bar') => {a:'foo', b:{c:'bar'}}

//property 'b' no found in the source object followed by undefined key
setIn({a:'foo'}, ['b', undefined], 'bar') => {a:'foo', b:['bar']} 

//property 'b' no found in the source object followed by integer key
setIn({a:'foo'}, ['b', 2,'c'], 'bar') => {a:'foo', b:[,,{c:'bar'}]}
```
For more examples check the [test file](https://github.com/bormind/immutable-setter/blob/master/tests/index.test.js)
    

### Alternatives:
If [Immutable.js](https://facebook.github.io/immutable-js/) is used - it provides [similar API](https://facebook.github.io/immutable-js/docs/#/Map/setIn) 
for the Map object. Except it requires all parts of the keyPath to be defined even if it is appending to the array (index of the new element).

Another library investigated was [React Immutability Helpers](https://facebook.github.io/react/docs/update.html). 
This library has more functionality for manipulating immutable values but I found the syntax a bit 'heavy' to read. 
And more importantly couldn't make the test with appending object to the non existing yet array to pass.
Something lik this: 
```js
const newObj = update({}, {a: {b: {$push:[{c: 'foo'}]}}});
//This fails!
expect(newObj.a.b[0].c).to.be.equal("foo");

``` 
     
For non immutable behaviour library like [deep-get-set](https://github.com/acstll/deep-get-set) can be used.

### Installation and use:
* npm install immutable-setter
```js
include { setIn, getIn } from 'immutable-setter'
```

### To build and run tests:
* clone the repository
* cd immutable-setter
* npm test - this will build the library, generate the lib directory, and will run tests against the build. 


### License: MIT 
 
 
 