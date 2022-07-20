import { isEmptyArray } from './array'

export function typeAssert(value: any, type: Function) {
  const typeString = type.toString().match(/(?<=(function )).*(?=(\())/g)![0]
  const valueTypeStirng = Object.prototype.toString.call(value).match(/(?<=(\[object )).*(?=(\]))/g)![0]
  return typeString === valueTypeStirng
}

interface Cache {
  origin: any
  copy: any
}

export function deepCopy(obj: any, cache: Array<Cache> = []) {
  if (typeAssert(obj, Function)) {
    return new Function(`return ${obj.toString()}`)()
  }

  if (typeAssert(obj, RegExp)) {
    obj = obj.toString().substr(1)
    obj = obj.substr(0, obj.length - 1)
    return new RegExp(obj)
  }

  if (typeAssert(obj, Map)) {
    return new Map(obj)
  }

  if (typeAssert(obj, Set)) {
    return new Set(obj)
  }

  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  const hit = cache.find((item) => item.origin === obj)
  if (hit) {
    return hit.copy
  }

  const copy = Array.isArray(obj) ? [] : {}
  cache.push({
    origin: obj,
    copy,
  })
  const keys = Object.keys(obj)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // copy[key] = deepCopy(obj[key], cache)
      Object.defineProperty(copy, key, {
        value: deepCopy(obj[key], cache),
        enumerable: true,
        configurable: true,
        writable: true,
      })
    }
  }
  return copy
}

export function emptyPropertiesObject(obj: any) {
  return isEmptyArray(Object.keys(obj))
}

export function isEquals(obj1: any, obj2: any) {
  if (!typeAssert(obj1, Object) || !typeAssert(obj2, Object)) {
    return obj1 === obj2
  }
  if (obj1 === obj2) return true
  const obj1Properties = Object.keys(obj1)
  const obj2Properties = Object.keys(obj2)
  if (obj1Properties.length !== obj2Properties.length) {
    return false
  }
  for (const key in obj1) {
    const result = isEquals(obj1[key], obj2[key])
    if (!result) {
      return false
    }
  }
  return true
}
