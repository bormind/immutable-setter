## Motivation
There is a lot written about advantages of using immutable data structures in you code. The problem with JavaScrip that it is require extra effort, "syntactical noise" and discipline because immutability is not "enforced" by the league. A specially if need to update deeply nested object structure. 

To help with this problems library like [Immutable.js](https://facebook.github.io/immutable-js/) can be used. Immutable.js uses special version containers like Set, Map etc. and special version of object class called Record to enforce immutability in yor code.

Different approach is taken by popular application state management library [Redux](https://github.com/reactjs/redux) that threat application state as immutable object. Redux uses pure functions (called *reducers*) that correspond to different parts of the State object. Reducer function accept original parts of the State object and modification parameters (*actions*) and return the new State Part with changes applied. Redux "updates" the application State by "cascading" calls to *reducers* with corresponding State Parts and "reassembling" the State in immutable fashion.   

Idea of [immutable-setter](https://github.com/bormind/immutable-setter) (This library) is to `modify`, `retrieve` and `delete` deeply nested parts of regular JavaScript object structure in immutable fusion. (Functions: `setIn`, `getIn`, `deleteIn`). 

Immutable-setter uses concept of *KeyPath* to specify target parts of the  object structure. *KeyPath* is an array of keys and indexes that describe the path to the target part of the object structure. 

Immutable-setter gracefully handles situations when *KeyPath* points to the missing parts of the Object Structure: 
* `setIn` - missing parts wil be generated. Immutable-setter infers type (Object vs. Array) to be generated based on KeyPath part pointing the object's children. If key is a string than Object class instance is created, if key is and Integer or *undefined* - Array instance is created. 
* `getIn` - if any part of the object structure is missing it will return *undefined*
* `deleteIn` - will do nothing 

Please see [Examples](#Examples) bellow and [Unit tests](./tests/index.test.js) for more details.


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
 
 
 
