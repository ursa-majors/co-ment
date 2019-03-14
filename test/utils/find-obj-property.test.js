'use strict'

const expect = require('chai').expect
const findObjProperty = require('../../utils/find-obj-property')

describe('findObjProperty', () => {
  it('should return property from regex', () => {
    const rex = /^x-forwarded-proto(col)?$/i
    const obj = { 'x-forwarded-proto': 'https' }
    const actual = findObjProperty(obj, rex)
    expect(actual).to.equal('https')
  })

  it('should return property from regex', () => {
    const rex = /^x-forwarded-proto(col)?$/i
    const obj = { 'X-Forwarded-Protocol': 'http' }
    const actual = findObjProperty(obj, rex)
    expect(actual).to.equal('http')
  })

  it('should ignore matching key substrings', () => {
    const rex = /x-forwarded-proto(col)?$/i
    const obj = { 'X-Forwarded-Protocoll': 'http' }
    const actual = findObjProperty(obj, rex)
    expect(actual).to.equal(undefined)
  })

  it('should ignore matching key substrings', () => {
    const rex = /^x-forwarded-proto(col)?$/i
    const obj = { 'XXX-Forwarded-Proto': 'http' }
    const actual = findObjProperty(obj, rex)
    expect(actual).to.equal(undefined)
  })

  it('should return `undefined` when obj has no key matching regex', () => {
    const rex = /x-forwarded-proto(col)?/i
    const obj = { 'X-Yippie': 'http' }
    const actual = findObjProperty(obj, rex)
    expect(actual).to.equal(undefined)
  })

  it('should throw when `obj` is omitted', () => {
    expect(() => findObjProperty(null, /any/)).to.throw(/missing `object`/)
  })

  it('should throw when `obj` is not an object', () => {
    expect(() => findObjProperty('object', /any/)).to.throw(/Invalid.*`object`/)
  })

  it('should throw when `rex` is omitted', () => {
    expect(() => findObjProperty({}, null)).to.throw(/missing `rex`/)
  })

  it('should throw when `rex` is not a RegExp', () => {
    expect(() => findObjProperty({}, 'notRex')).to.throw(/Invalid.*`rex`/)
  })
})
