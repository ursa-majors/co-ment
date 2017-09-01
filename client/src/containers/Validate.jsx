import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { refreshToken, resetValidateModal } from '../store/actions/apiLoginActions';
import Spinner from './Spinner';
import ModalSm from './ModalSm';

class Validate extends React.Component {

  componentWillMount() {
    this.props.api.refreshToken(this.props.appState.authToken);
  }

  render() {
    let valStatus;
    if (this.props.login.tokenRefreshComplete === undefined) {
      valStatus = 'Validating';
    } else if (!this.props.login.tokenRefreshComplete) {
      valStatus = 'Validation Failed';
    } else {
      valStatus = 'Validation Successful';
    }
    return (
      <div className="container validate">
        <div className="validate__quote-wrap">
          <div className="validate__quote">
            <i className="fa fa-quote-left fa-3x fa-pull-left" aria-hidden="true" />
            {`Two roads diverged in a wood, and I —
            I took the one less traveled by,
            And that has made all the difference.`}
          </div>
          <div className="validate__quote-author">
            <a
              href="https://www.poetryfoundation.org/poems/44272/the-road-not-taken"
              target="_blank"
              rel="noopener noreferrer"
            >
              Robert Frost
            </a>
          </div>
        </div>
        <h2 className="title">
          {valStatus}
        </h2>
        { this.props.login.tokenRefreshComplete &&
          <div className="validate__text-wrap">
            <div className="validate__text-header">
              {`Congratulations ${this.props.profile.userProfile.username}!`}
            </div>
            <div className="validate__text">
              {`You have validated your account and started your Co/Ment journey.
              The next step is to decide your path.  Are you looking for an adviser,
              or are you ready to be a guiding star?

              Whichever path you choose, get started by updating your profile,
              then head over to the Posts page.`}
            </div>
          </div>
        }
        <Spinner cssClass={this.props.login.validateSpinnerClass} />
        <ModalSm
          modalClass={this.props.login.validateModal.class}
          modalTitle={this.props.login.validateModal.title}
          modalText={this.props.login.validateModal.text}
          modalType={this.props.login.validateModal.type}
          dismiss={
            () => {
              this.props.api.resetValidateModal({
                class: 'modal__hide',
                text: '',
                type: '',
                title: '',
              });
            }
          }
        />
      </div>
    );
  }
}

Validate.propTypes = {
  appState: PropTypes.shape({
    authToken: PropTypes.string,
  }).isRequired,
  profile: PropTypes.shape({
    userProfile: PropTypes.shape({
      username: PropTypes.string,
    }).isRequired,
  }).isRequired,
  login: PropTypes.shape({
    validateSpinnerClass: PropTypes.string,
    tokenRefreshComplete: PropTypes.boolean,
    validateModal: PropTypes.shape({
      class: PropTypes.string,
      type: PropTypes.string,
      title: PropTypes.string,
      text: PropTypes.string,
    }),
  }).isRequired,
  api: PropTypes.shape({
    refreshToken: PropTypes.func,
    resetValidateModal: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = state => ({
  appState: state.appState,
  profile: state.profiles,
  login: state.login,
});

const mapDispatchToProps = dispatch => ({
  api: bindActionCreators({ refreshToken, resetValidateModal }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Validate);
