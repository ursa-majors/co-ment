import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import * as apiActions from '../store/actions/apiConnectionActions';
import * as Actions from '../store/actions/connectionActions';
import Spinner from './Spinner';
import ModalSm from './ModalSm';
import { formatDate } from '../utils';

class Connections extends React.Component {

  componentDidMount() {
    const token = this.props.appState.authToken;
    this.props.api.getConnections(token);
  }

  render() {
    return (
      <div className="connections">
        <Spinner cssClass={this.props.connection.getConnectionsSpinnerClass} />
        <ModalSm
          modalClass={this.props.connection.getConnectionsModal.class}
          modalText={this.props.connection.getConnectionsModal.text}
          modalTitle={this.props.connection.getConnectionsModal.title}
          modalType={this.props.connection.getConnectionsModal.type}
          dismiss={
            () => {
              this.props.actions.setConnectionsModal({
                class: 'modal__hide',
                text: '',
                type: '',
                title: '',
              });
            }
          }
        />
        <div className="conn-preview">
          <div className="conn-preview__text--wrap">
            <div className="conn-preview__title">Connections</div>
          </div>
          <div className="conn-preview__header-wrap">
            <div className="conn-preview__header">Mentor</div>
            <div className="conn-preview__header">Mentee</div>
            <div className="conn-preview__header">Status</div>
            <div className="conn-preview__header conn-preview__hide-for-small">Date</div>
          </div>
            {this.props.connection.connections.map(item => {
              return(
              <div className="conn-preview__header-wrap" key={item._id}>
                <div className="conn-preview__text">{item.mentor.name}</div>
                <div className="conn-preview__text">{item.mentee.name}</div>
                <div className="conn-preview__text">
                  <Link to={`/connectiondetails/${item._id}`}>
                    {item.status}
                  </Link>
                </div>
                <div className="conn-preview__text conn-preview__hide-for-small">{formatDate(new Date(item.dateStarted))}</div>
              </div>
            )
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  appState: state.appState,
  connection: state.connection,
  profiles: state.profiles,
});

const mapDispatchToProps = dispatch => ({
  api: bindActionCreators(apiActions, dispatch),
  actions: bindActionCreators(Actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Connections);
