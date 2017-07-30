import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as actions from '../store/actions'

class Registration extends React.Component{

  constructor(props){
    super(props)
  }

  render(){
    return(
      <div className="form">
        <div className="form-input-group">
          <input className="form-input" type="text" placeholder="Username" id="username" />
        </div>
        <div className="form-input-group">
          <input className="form-input" type="password" placeholder="Password" id="password" />
        </div>
        <div className="form-input-group">
          <input className="form-input" type="password" placeholder="Confirm Password" id="confirm-password" />
        </div>
        <div className="form-input-group">
          <input className="form-button" type="buton" id="btn-register" value="Register"/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return ({
    appState: state.appState
  })
}

const mapDispatchToProps = dispatch => {
  return({
    actions: bindActionCreators(Actions, dispatch)
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(Registration)
