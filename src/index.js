"use strict";

import 'object-assign-shim';

export function setIn(obj, keyPath, val) {

  function createValueNode(obj, keyArr, keyIndex) {

    if(keyIndex >= keyArr.length) {
      return undefined;
    }

    const key = keyArr[keyIndex];
    const isKeyDefined = (typeof key !== 'undefined' && key !== null);

    let objCopy;

    if(obj) {
      if(Array.isArray(obj)) {
        objCopy = obj.slice();
      }
      else {
        objCopy = Object.assign({}, obj);
      }
    } else {

      if(!isKeyDefined || typeof key === 'number') {
        objCopy = [];
      }
      else {
        objCopy = {};
      }

    }

    return {
      obj: objCopy,
      keyIndex: keyIndex,
      isKeyDefined: isKeyDefined,

      childNode: createValueNode(isKeyDefined ? objCopy[key] : undefined, keyArr, keyIndex + 1)
    }

  }

  const rootNode = createValueNode(obj, keyPath, 0);

  function assignChildObjectValue(node, val) {

    let valToAssign = node.childNode ? assignChildObjectValue(node.childNode, val) : val;

    if(node.isKeyDefined) {
      const key = keyPath[node.keyIndex];
      node.obj[key] = valToAssign;
    }
    else {
      if( Array.isArray(node.obj) ) {
        node.obj.push(valToAssign);
      }
      else {
        const parentPath = keyPath.slice(0, node.keyIndex);
        throw ('Unexpected undefined key found in the key-path. ' +
          'Undefined key can be used in the key-path indicating that value suppose to be added to the array ' +
          'but instead of the array object was encountered in key path ' + parentPath
        );
      }
    }

    return node.obj
  }

  return assignChildObjectValue(rootNode, val);
}

export function getIn(obj, keyPath) {

  function readValue(obj, keyArr, keyIndex) {

    if(!obj) {
      return undefined;
    }

    if(typeof obj !== 'object') {
      throw ('Invalid keyPath: expected object but simple value was reached');
    }

    const key = keyArr[keyIndex];
    const val = obj[key];

    if(keyIndex >= keyArr.length - 1) {
      return val;
    }
    else {
      return readValue(val, keyArr, keyIndex + 1);
    }
  }

  if(keyPath.length === 0) {
    return obj
  }
  else {
    return readValue(obj, keyPath, 0);
  }
}


