import { describe, expect, test } from '@jest/globals'
import { deepCopy, typeAssert } from '../object'

describe('object typeAssert(val, Function) test', () => {
  test('typeAssert({}, Object) is true', () => {
    expect(typeAssert({}, Object)).toEqual(true)
  })

  test('typeAssert(1, Number) is true', () => {
    expect(typeAssert(1, Number)).toEqual(true)
  })

  test('typeAssert(`1`, String) is true', () => {
    expect(typeAssert(`1`, String)).toEqual(true)
  })

  test('typeAssert(() => {}, Function) is true', () => {
    expect(typeAssert(() => {}, Function)).toEqual(true)
  })
})

describe('object deepCopy(val) test', () => {
  test('deepCopy({ name: `Tome`, info: { age: 18 } })', () => {
    const orgObj = { name: `Tome`, info: { age: 18 } }
    const copyObj = deepCopy(orgObj)
    expect(copyObj).toHaveProperty('name')

    expect(copyObj).not.toBe(orgObj)

    orgObj.name = 'Jess'
    expect(orgObj.name).toBe('Jess')
    expect(copyObj.name).toBe('Tome')

    orgObj.info.age = 20
    expect(orgObj.info.age).toBe(20)
    expect(copyObj.info.age).toBe(18)
  })

  test('deepCopy(() => {})', () => {
    function orgFunc() {
      return 'this is a testFunc'
    }
    const copyFunc = deepCopy(orgFunc)
    expect(typeAssert(copyFunc, Function)).toBe(true)

    expect(copyFunc).not.toBe(orgFunc)

    orgFunc()
    expect(orgFunc()).toBe('this is a testFunc')
  })

  test('deepCopy(/ab+c/)', () => {
    const orgRegExp = /ab+c/
    const copyRegExp = deepCopy(orgRegExp)
    expect(typeAssert(copyRegExp, RegExp)).toBe(true)

    expect(copyRegExp).not.toBe(orgRegExp)

    expect(copyRegExp.toString()).toBe(orgRegExp.toString())
  })
})
