import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../store/actions';
import Loading from '../containers/Loading';

class ConnectionResult extends React.Component {

  render() {
    if (this.props.connection.loading) {
      return (
        <div className="container logout">
          <Loading text="Sending Email" />
        </div>
      );
    } else if (!this.props.connection.loading && !this.props.connection.error) {
      return (
        <div className="container logout">
          <div className="logout__header">Email Sent</div>
          <div className="result">Next Steps:
            <ol>
              <li>Your contact email has been sent to the recipient with a link to respond</li>
              <li>Next, the recipient will log in to co/ment and accept or decline the request</li>
              <li>You will receive email notification of their action</li>
              <li>Once a connection is made, you can decide on the best method of communication
                for your partnership.  You may use Slack, email, or even meet in person.</li>
              <li>Good luck!</li>
            </ol>
          </div>
        </div>
      );
    }

    return (
      <div className="container logout">
        <div className="logout__header">An Error Occurred</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  appState: state.appState,
  connection: state.connection,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionResult);
