## immutable-setter
Exposes *setIn(object, keyPath, value)*, *getIn(object, keyPath)*, *deleteIn(object, keyPath)* helper functions to simplify setting (deleting and reading) values
in immutable objects.

*setIn* function preserves structural sharing - the returned new object has new objects created for each new or 
modified value along the keyPath.

*deleteIn* function preserves structural sharing - the returned new object has new objects created along the keyPath to  
deleted value.

*getIn* function is provided for completeness - it returns value specified by the keyPath or *undefined* if the key/index
of the kyePath is not found in the traversed object. This eliminates necessity of checking if each value along the keyPath
is defined before getting the target value. 

### Motivation
When working with a [Redux](https://github.com/reactjs/redux) based immutable state container, it is convenient
to be able to set an object's properties a few levels deep in the object hierarchy in immutable fashion. 
Usually this is done through a hierarchy of reducers, but sometimes it is convenient to do it "inline" 
through one function call (especially in tests). The `getIn` function was added for completeness.

### API
```
setIn(object: Object, keyPath: Array<String|Number(Int)|undefined>, value: Any) => Object
```

* object - plain javascript object. It will be treated as immutable.
* keyPath - array of keys and indexes specifying path to the property to be set in the the objects hierarchy.
    Can contain undefined keys indicating that value should be pushed to the end of the array. 
* value - new value to be set

* return - new object with new objects created along the keyPath

```
deleteIn(object: Object, keyPath: Array<String|Number(Int)>) => Object
```

* object - plain javascript object. It will be treated as immutable.
* keyPath - array of keys and indexes specifying path to the property to be deleted in the the objects hierarchy.

* return - new object with new objects created along the keyPath if specified keyPath value was deleted. 
It returns original objects if value along keyPath was not found

```
getIn(object: Object, keyPath: Array<String|Number(Int)|undefined>) => Any|undefined
```
* object - plain javascript object. It will be treated as immutable.
* keyPath - array of keys and indexes specifying path of the property to read.

### Examples

```js
//update existing property
setIn({a:'foo', b:{c:'abc'}}, ['b', 'c'], 'bar') => {a:'foo', b:{c:'bar'}}

//property 'b' not found in the source object
setIn({a:'foo'}, ['b', 'c'], 'bar') => {a:'foo', b:{c:'bar'}}

//property 'b' not found in the source object followed by undefined key
setIn({a:'foo'}, ['b', undefined], 'bar') => {a:'foo', b:['bar']} 

//property 'b' not found in the source object followed by integer key
setIn({a:'foo'}, ['b', 2,'c'], 'bar') => {a:'foo', b:[,,{c:'bar'}]}
```
For more examples check the [test file](https://github.com/bormind/immutable-setter/blob/master/tests/index.test.js)
    

### Alternatives
If [Immutable.js](https://facebook.github.io/immutable-js/) is used - it provides a [similar API](https://facebook.github.io/immutable-js/docs/#/Map/setIn) 
for the Map object, except it requires all parts of the keyPath to be defined even if it is appending to the array (index of the new element).

The [React Immutability Helpers](https://facebook.github.io/react/docs/update.html) library has more functionality for manipulating immutable values but I found the syntax a bit 'heavy' to read. Also, it does not support appending object to the non existing array. For example: 
```js
const newObj = update({}, {a: {b: {$push:[{c: 'foo'}]}}});
//This fails!
expect(newObj.a.b[0].c).to.be.equal("foo");

``` 

For non-immutable use cases [deep-get-set](https://github.com/acstll/deep-get-set) can be used.

### Installation and use
* npm install immutable-setter
```js
include { setIn, deleteIn, getIn } from 'immutable-setter'
```

### To build and run tests
* clone the repository
* cd immutable-setter
* npm test - this will build the library, generate the lib directory, and will run tests against the build. 


### License
MIT 
 
 
 
