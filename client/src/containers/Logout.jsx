import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import * as Actions from '../store/actions'

class Logout extends React.Component {
  componentDidMount () {
    this.props.actions.logout()
  }

  render () {
    return (
      <div className='container logout'>
        <div className='logout__header'>goodbye</div>
      </div>
    )
  }
}

Logout.propTypes = {
  actions: PropTypes.shape({
    logout: PropTypes.func
  }).isRequired
}

const mapStateToProps = state => ({
  appState: state.appState
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Logout)
