import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../store/actions/apiActions';
import Loading from '../containers/Loading';

class Connections extends React.Component {

  componentDidMount() {
    const token = this.props.appState.authToken;
    const id = this.props.appState.profile._id;
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
          <div className="content__text--wrap">
            <div className="content__title">Connections</div>
          </div>
          <div className="content__header-wrap">
            <div className="content__header">Mentor Name</div>
            <div className="content__header">Mentee Name</div>
            <div className="content__header">Status</div>
            <div className="content__header">Date</div>
          </div>
            {this.props.connection.connections.map(item => (
              <div className="content__header-wrap">
                <div className="content__text">{item.mentorName}</div>
                <div className="content__text">{item.menteeName}</div>
                <div className="content__text">{item.status}</div>
                <div className="content__text">{item.dateStarted}</div>
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
});

const mapDispatchToProps = dispatch => ({
  api: bindActionCreators(Actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Connections);
