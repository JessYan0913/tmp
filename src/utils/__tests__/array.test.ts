import { describe, expect, test } from '@jest/globals'
import { isEmptyArray } from '../array'

describe('array test', () => {
  test('isEmptyArray([]) is true', () => {
    expect(isEmptyArray([])).toEqual(true)
  })
})
