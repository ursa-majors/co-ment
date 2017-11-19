import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import * as Actions from '../store/actions';
import Loading from '../containers/Loading';

const ConnectionResult = () => (
  <div>
    {this.props.connection.contact_loading &&
      <div className="container logout">
        <Loading text="Sending Email" />
      </div>
    }
    {!this.props.connection.contact_loading &&
    !this.props.connection.contact_error &&
      <div className="container logout">
        <div className="logout__header">Email Sent</div>
        <div className="result">
          <h3 className="result__header">Next Steps:</h3>
          <ol>
            <li>Your message has been sent to the recipient with a link to respond</li>
            <li>The recipient will log in to co/ment and accept or decline the request</li>
            <li>You will receive email notification of their action</li>
            <li>Once a connection is accepted, you can use co/ment messaging
             to continue the conversation.</li>
            <li>Good luck!</li>
          </ol>
        </div>
      </div>
    }
    {this.props.connection.contact_error &&
      <div className="container logout">
        <div className="logout__header">An Error Occurred</div>
      </div>
    }
  </div>
);

ConnectionResult.propTypes = {
  connection: PropTypes.shape({
    contact_loading: PropTypes.bool,
    contact_error: PropTypes.bool,
  }).isRequired,
};

const mapStateToProps = state => ({
  appState: state.appState,
  connection: state.connection,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionResult);
