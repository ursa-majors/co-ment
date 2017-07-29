import React from 'react';
import { Link } from 'react-router-dom';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as Actions from '../store/actions'

class Home extends React.Component{
  constructor(props){
    super(props)
  }

  render(){
    console.log(this.props.appState)
    return(
      <div className="splash">
        <div className="splash__image" />
        <div className="splash__wrapper">
        <div className="splash__text-wrap">
   	     <h1 className="splash__headline">co&#47;ment</h1>
   	     <h2 className="splash__subhead">find your guiding star</h2>
        </div>
        <div className="splash__button-wrap">
    	    <Link to="/mentors" className="splash__button">Find a Mentor</Link>
    	    <Link to="/mentees" className="splash__button">Be a Mentor</Link>
        </div>
        </div>
        <div className="splash__overlay">
    	    <p className="splash__body">
    	    co/ment: a unique matchmaking service for mentors and mentees.<br/>Find the perfect guide for your coding journey.
    	    </p>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return({
    appState: state.appState
  })
}

const mapDispatchToProps = (dispatch) => {
  return({
    actions: bindActionCreators(Actions, dispatch)
  })
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);
