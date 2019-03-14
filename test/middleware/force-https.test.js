/* eslint-disable no-unused-expressions */
'use strict'

var chai = require('chai')
var sinon = require('sinon')
var sinonChai = require('sinon-chai')
const forceHttps = require('../../middleware/force-https')

const expect = chai.expect
chai.use(sinonChai)

describe('forceHttps middleware', () => {
  let req, res, next

  beforeEach(() => {
    req = {
      hostname: 'mockhost.com',
      url: '/mock-endpoint',
      headers: {}
    }
    res = { redirect: sinon.spy() }
    next = sinon.spy()
  })

  it('should simply call next if env != prod', () => {
    const forceHttpsMiddleware = forceHttps(false)
    forceHttpsMiddleware(req, res, next)
    expect(next).to.have.been.calledOnce
    expect(res.redirect).not.to.have.been.called
  })

  it('should call next if prod & https', () => {
    const forceHttpsMiddleware = forceHttps(true)
    req.headers['x-forwarded-proto'] = 'https'
    forceHttpsMiddleware(req, res, next)
    expect(next).to.have.been.calledOnce
    expect(res.redirect).not.to.have.been.called
  })

  it('should redirect to https if prod & http', () => {
    const forceHttpsMiddleware = forceHttps(true)
    req.headers['x-forwarded-protocol'] = 'http'
    forceHttpsMiddleware(req, res, next)
    expect(next).not.to.have.been.called
    expect(res.redirect).to.have.been.calledOnce
    expect(res.redirect).to.have.been.calledWith(302, `https://${req.hostname}${req.url}`)
  })
})
