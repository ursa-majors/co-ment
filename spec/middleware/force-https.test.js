'use strict'

const forceHttps = require('../../middleware/force-https')

describe('forceHttps middleware', () => {
  let req, res, next

  beforeEach(() => {
    req = {
      hostname: 'mockhost.com',
      url: '/mock-endpoint',
      headers: {}
    }
    res = { redirect: jest.fn() }
    next = jest.fn()
  })

  it('should simply call next if env != prod', () => {
    const forceHttpsMiddleware = forceHttps(false)
    forceHttpsMiddleware(req, res, next)
    expect(next).toHaveBeenCalledTimes(1)
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it('should call next if prod & https', () => {
    const forceHttpsMiddleware = forceHttps(true)
    req.headers['x-forwarded-proto'] = 'https'
    forceHttpsMiddleware(req, res, next)
    expect(next).toHaveBeenCalledTimes(1)
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it('should redirect to https if prod & http', () => {
    const forceHttpsMiddleware = forceHttps(true)
    req.headers['x-forwarded-protocol'] = 'http'
    forceHttpsMiddleware(req, res, next)
    expect(next).not.toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledTimes(1)
    expect(res.redirect).toHaveBeenCalledWith(302, `https://${req.hostname}${req.url}`)
  })
})
