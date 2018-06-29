"use strict";

import 'object-assign-shim';

function formatKeyPath(keyPath) {
  return JSON.stringify(keyPath);
}

function isValidObject(obj) {
  return (typeof obj === 'object') && obj !== null;
}

function formatInvalidObjectAtPath(keyPath) {
  return 'Invalid value found at path ' + formatKeyPath(keyPath) + '. Object was expected'
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

function copyObject(obj, isArray) {
  return isArray ? obj.slice() : Object.assign({}, obj);
}


export function setIn(obj, keyPath, val) {

  function setValue(obj, key, isArray, val) {
    if(obj[key] === val) {
      return obj;
    }

    const copy = copyObject(obj, isArray);
    copy[key] = val;
    return copy;
  }

  function setChild(obj, keyPath, keyIndex, val) {

    let key = keyPath[keyIndex];
    let isArray;
    if(typeof obj === 'undefined' || obj === null) {
      const typeOfKey = typeof key;
      if(key === null || typeOfKey === 'number' || typeOfKey === 'undefined') {
        obj = [];
      }
      else {
        obj = {};
      }
    }

    //to check if we encounter basic value instead of object or array
    if(!isValidObject(obj)) {
      throw new Error(formatInvalidObjectAtPath(keyPath.slice(0, keyIndex-1)));
    }

    isArray = Array.isArray(obj);

    if(isArray && (typeof key === 'undefined' || key === null)) {
      key = obj.length;
    }

    const error = validateKey(key, isArray);
    if(error) {
      throw new Error('Invalid keyPath ' + formatKeyPath(keyPath) + ': ' + error);
    }

    if(keyIndex === keyPath.length - 1) {
      return setValue(obj, key, isArray, val);
    }
    else {
      //recursion
      const newChild = setChild(obj[key], keyPath, keyIndex + 1, val);
      return setValue(obj, key, isArray, newChild);
    }
  }

  return setChild(obj, keyPath, 0, val);
}

export function deleteIn(obj, keyPath) {

  function isKeyFound(obj, key, isArray) {
    if(isArray) {
      return key >= 0 && key < obj.length;
    }
    else {
      return obj.hasOwnProperty(key);
    }
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
      throw new Error(formatInvalidObjectAtPath(keyPath.slice(0, keyIndex-1)));
    }

    const isArray = Array.isArray(obj);
    const key = keyPath[keyIndex];

    const error = validateKey(key, isArray);
    if(error) {
      throw new Error('Invalid keyPath ' + formatKeyPath(keyPath) + ': ' + error);
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

    if(!isValidObject(obj)) {
      throw new Error(formatInvalidObjectAtPath(keyPath.slice(0, keyIndex-1)));
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


