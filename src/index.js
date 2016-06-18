"use strict";

import 'object-assign-shim';

function formatKeyPaht(keyPath) {
  return JSON.toString(keyPath);
}

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

export function deleteIn(obj, keyPath) {

  function isValidObject(obj) {
    return (typeof obj === 'object') && obj !== null;
  }

  function validateKey(key, isArray) {
    if(isArray) {
      if(typeof key !== 'number') {
        return 'Unexpected key type in the keyPath: ' + key + ' expected to be index of the array';
      }
    }
    else {
      if(!key && key !== 0) {
        return 'Key value was not set';
      }
    }
  }

  function isKeyFound(obj, key, isArray) {
    if(isArray) {
      return key >= 0 && key < obj.length;
    }
    else {
      return obj.hasOwnProperty(key);
    }
  }

  function copyObject(obj, isArray) {
    return isArray ? obj.slice() : Object.assign({}, obj);
  }

  function deleteKeyFromObject(obj, key, isArray) {

    const copy = copyObject(obj, isArray);

    if(isArray) {
      copy.splice(key, 1);
    }
    else {
      delete copy[key];
    }

    return copy;
  }

  function deleteChild(obj, keyPath, keyIndex) {

    if(!isValidObject(obj)) {
      throw('Invalid value found at path ' + formatKeyPaht(keyPath.slice(0, keyIndex-1)) + '. Object was expected');
    }

    const isArray = Array.isArray(obj);
    const key = keyPath[keyIndex];

    const error = validateKey(key, isArray);
    if(error) {
      throw('Invalid keyPath ' + formatKeyPaht(keyPath) + ': ' + error);
    }

    if(!isKeyFound(obj, key, isArray)) {
      return obj;
    }
    else if(keyIndex === keyPath.length - 1) { //key to actual value to be removed
      return deleteKeyFromObject(obj, key, isArray);
    }
    else {
      let child = obj[key];
      //recursion
      let newChild = deleteChild(child, keyPath, keyIndex + 1);
      if(child === newChild) {
        return obj;
      }
      else {
        const copy = copyObject(obj, isArray);
        copy[key] = newChild;
        return copy;
      }
    }
  }

  return deleteChild(obj, keyPath, 0);
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


