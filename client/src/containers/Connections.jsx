import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import * as Actions from '../store/actions/apiActions';
import Loading from '../containers/Loading';
import { formatDate } from '../utils';

class Connections extends React.Component {

  componentDidMount() {
    const token = this.props.appState.authToken;
    const id = this.props.profiles.userProfile._id;
    this.props.api.getConnections(token, id);
  }

  render() {
    console.log(this.props.connection)
    if (this.props.connection.getConnectionsLoading) {
      return (
        <div className="container logout">
          <h2 className="title">Connections</h2>
          <Loading text="Loading Connections" />
        </div>
      );
    }

    return (
      <div className="container">
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
            {this.props.connection.connections.map(item => (
              <div className="conn-preview__header-wrap" key={item._id}>
                <div className="conn-preview__text">{item.mentorName}</div>
                <div className="conn-preview__text">{item.menteeName}</div>
                <div className="conn-preview__text">
                  <Link to={`/connectiondetails/${item._id}`}>
                    {item.status}
                  </Link>
                </div>
                <div className="conn-preview__text conn-preview__hide-for-small">{formatDate(new Date(item.dateStarted))}</div>
              </div>
            ))}
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
  api: bindActionCreators(Actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Connections);
