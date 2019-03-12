import React from 'react'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Spinner from './Spinner'
import * as apiActions from '../store/actions/apiLoginActions'
import { setRedirectUrl } from '../store/actions'
import { setFilter, runFilter } from '../store/actions/gridControlActions'

class Home extends React.Component {
  componentDidMount () {
    // Check for hash-fragment and stash it in redux
    // if the redirect is "resetpassword" or "/validate" then go immediately
    if (this.props.location.hash) {
      const hash = this.props.location.hash.slice(2)
      const url = `/${hash.split('=')[1]}`
      if (url.startsWith('/resetpassword')) {
        this.props.history.push(url)
        return
      } else if (url.startsWith('/validate')) {
        // do this in case validate forces login
        this.props.actions.setRedirectUrl(url)
        this.props.history.push(url)
      } else {
        this.props.actions.setRedirectUrl(url)
      }
    }
    // If we're not logged in, check local storage for authToken
    // if it doesn't exist, it returns the string "undefined"
    if (!this.props.appState.loggedIn) {
      let token = window.localStorage.getItem('authToken')
      if (token && token !== 'undefined') {
        token = JSON.parse(token)
        const user = JSON.parse(window.localStorage.getItem('userId'))
        // If we validate successfully, look for redirect_url and follow it
        this.props.api.validateToken(token, user)
          .then((result) => {
            if (result.type === 'VALIDATE_TOKEN_SUCCESS') {
              if (this.props.appState.redirectUrl) {
                this.props.history.push(this.props.appState.redirectUrl)
                this.props.actions.setRedirectUrl('')
              }
            }
          })
      } else if (this.props.location.hash) {
        this.props.history.push('/login')
      }
    }
  }

  render () {
    let links
    if (this.props.appState.loggedIn) {
      links = (
        <div className='splash__button-wrap'>
          <button
            className='splash__button'
            onClick={
              () => {
                this.props.actions.setFilter('role', 'Mentor')
                this.props.actions.runFilter()
                this.props.history.push('/posts')
              }
            }
          >
            Find a Mentor
          </button>
          <Link to='/mentorpath' className='splash__button'>Be a Mentor</Link>
        </div>
      )
    } else {
      links = (
        <div className='splash__button-wrap'>
          <Link to='/register'className='splash__button'>Register</Link>
          <Link to='/login' className='splash__button'>Login</Link>
        </div>
      )
    }

    return (
      <div className='splash'>
        <div className='splash__image' />
        <div className='splash__wrapper'>
          <div className='splash__text-wrap'>
            <h1 className='splash__headline'>co&#47;ment</h1>
            <h2 className='splash__subhead'>find your guiding star</h2>
          </div>

          {links}

        </div>
        <div className='splash__overlay'>
          <div className='splash__bracket--l' />
          <p className='splash__body'>
            <span className='splash__body--spaced'>co/ment:</span> a unique matchmaking service for mentors and mentees. Find the perfect guide for your coding journey.
          </p>
          <div className='splash__bracket--r' />
        </div>
        <Spinner cssClass={this.props.appState.loginSpinnerClass} />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  appState: state.appState
})

const mapDispatchToProps = dispatch => ({
  api: bindActionCreators(apiActions, dispatch),
  actions: bindActionCreators({
    setRedirectUrl,
    setFilter,
    runFilter
  }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
