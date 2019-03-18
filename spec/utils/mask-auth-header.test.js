'use strict'

const maskAuthHeader = require('../../utils/mask-auth-header')

const sanitized = '<MASKED>'
const authorization = 'Bearer eyJhbGciOiJIUz.X4AOGU-_Vkbh8BV-krjrgA_o'
const headers = {
  'authorization': authorization,
  'cache-control': 'no-cache',
  'postman-token': '97e6b80d-0102fda22929',
  'user-agent': 'PostmanRuntime/7.1.1',
  'accept': '*/*',
  'host': 'localhost:3001',
  'accept-encoding': 'gzip, deflate',
  'connection': 'keep-alive'
}

describe('authorization header masking utility', () => {
  it('should mask top-level authorization strings', () => {
    const actual = maskAuthHeader(headers)
    expect(actual).toEqual({
      ...headers,
      authorization: sanitized
    })
  })

  it('should mask top-level Authorization (big A) strings', () => {
    const reqHeaders = {
      ...headers,
      Authorization: authorization
    }
    delete reqHeaders.authorization

    const actual = maskAuthHeader(reqHeaders)
    expect(actual).toEqual({
      ...reqHeaders,
      Authorization: sanitized
    })
  })

  it('should mask 2nd-level authorization strings', () => {
    const moreHeaders = {
      ...headers,
      nested: { authorization }
    }
    const actual = maskAuthHeader(moreHeaders)
    expect(actual).toEqual({
      ...headers,
      authorization: sanitized,
      nested: {
        authorization: sanitized
      }
    })
  })

  it('should mask deeper authorization strings', () => {
    const moreHeaders = {
      ...headers,
      nested: { nested: { authorization } }
    }
    const actual = maskAuthHeader(moreHeaders)
    expect(actual).toEqual({
      ...headers,
      authorization: sanitized,
      nested: { nested: { authorization: sanitized } }
    })
  })
})
