# immutable-setter
Exposes *setIn(object, keyPath, value)*, *getIn(object, keyPath)* helper functions to simplify setting (and reading) values
in immutable objects.

*setIn* function preserves structural sharing - returned new object has new objects created for each new or 
modified value along the keyPath

## Motivation
While working with [Redux](https://github.com/reactjs/redux) based immutable state container, it is convenient
to be able to set object properties few levels deep in the object hierarchy in immutable fashion. 
Usually this is done through hierarchy of reducers. But sometimes it convenient to do it "inline" 
through one function call. A specially in tests.

## API
**setIn(object, keyPath, value)**
* object - plain javascript object. It will be treated as immutable.
* keyPath - array of keys and array indexes specifying path to the property to be set in the the objects hierarchy.
    can contain undefined keys indicating that value should be pushed to the and of array
* value - new value to be set

## Alternatives