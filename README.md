# immutable-setter
Exposes *setIn(object, keyPath, value)*, *getIn(object, keyPath)* helper functions to simplify setting (and reading) values
in the immutable objects.

*setIn* function preserves structural sharing - returned new object has new objects created for each new or 
modified value along the keyPath

## Motivation
While working with [Redux](https://github.com/reactjs/redux) based immutable state container, it is convenient
to be able to set object properties few levels deep in the object hierarchy in immutable fashion. 
Usually this is done through hierarchy of reducers. But sometimes it is convenient to do it "inline" 
through one function call. A specially in tests.

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
    Example: 

    ```js
    //property 'b' not found in the source object
    setIn({a:'foo'}, ['a', 'b', 'c'], 'bar') => {a:'foo', b:{c:'bar'}}
    //property 'b' no found in the source object followed by integer key
    setIn({a:'foo'}, ['a', 'b', 1], 'bar') => {a:'foo', b:[,'bar']} 
    //property 'b' no found in the source object followed by undefined key
    setIn({a:'foo'}, ['a', 'b', ,'c'], 'bar') => {a:'foo', b:[{c:'bar'}]}
    ```
    
* value - new value to be set

* return - new object with with al the  

## Alternatives