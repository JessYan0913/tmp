import { describe, expect, test } from '@jest/globals'
import { typeAssert } from '../object'

describe('object test', () => {
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
