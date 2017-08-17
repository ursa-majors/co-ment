import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import * as apiActions from '../store/actions/apiConnectionActions';
import * as Actions from '../store/actions/connectionActions';


class ConnectionDetails extends React.Component {

  // Find the connection matching the URL param and set it in redux state.
  componentDidMount() {
    for (let i = 0; i < this.props.connection.connections.length; i += 1) {
      if (this.props.connection.connections[i]._id === this.props.match.params.id) {
        this.props.actions.setViewConnection(this.props.connection.connections[i]);
      }
    }
  }

  componentWillUnmount() {
    this.props.actions.clearViewConnection();
  }

  getActions = () => {
    let actions;
    switch (this.props.connection.viewConnection.status) {
      case 'pending':
        actions = (this.props.connection.viewConnection.initiator.id !== this.props.profiles.userProfile._id) ?
          (<ul className="post-nav">
            <li className="post-nav__item" >
              <span
                className="post-nav__item-link pointer"
                onClick={() =>
                  this.props.api.updateConnectionStatus(
                    this.props.appState.authToken,
                    {
                      id: this.props.connection.viewConnection._id,
                      type: 'ACCEPT',
                    },
                  )
                }
              >
                Accept
              </span>
            </li>
            <li className="post-nav__item" >
              <span
                className="post-nav__item-link pointer"
                onClick={() =>
                  this.props.api.updateConnectionStatus(
                    this.props.appState.authToken,
                    {
                      id: this.props.connection.viewConnection._id,
                      type: 'DECLINE',
                    },
                  )
                }
              >
                Decline
              </span>
            </li>
          </ul>
        ) :
        null;
        break;
      case 'accepted':
        actions = (
          <ul className="post-nav">
            <li className="post-nav__item" >
              <span
                className="post-nav__item-link pointer"
                onClick={() =>
                  this.props.api.updateConnectionStatus(
                    this.props.appState.authToken,
                    {
                      id: this.props.connection.viewConnection._id,
                      type: 'EXPIRE',
                    },
                  )
                }
              >
                Finish
              </span>
            </li>
          </ul>
        );
        break;
      case 'expired':
      case 'declined':
      default:
        actions = null;
    }
    return actions;
  }

  render() {
    console.log(this.props.connection)
    const conn = this.props.connection.viewConnection;
    return (
      <div className="container conn-details">
        <div className="conn-details__text-wrap">
          <div className="conn-details__title">
            Connection Details
          </div>
        </div>
        <div className="conn-details__avatars">
          <div className="conn-details__image-wrap">
            <div>Mentor</div>
            <img className="conn-details__image" src={this.props.connection.viewConnection.mentor.avatar || null} />
          </div>
          <div className="conn-details__image-wrap">
            <div>Mentee</div>
            <img className="conn-details__image" src={this.props.connection.viewConnection.mentee.avatar || null} />
          </div>
        </div>
        <div className="conn-details__text-wrap">
          Initiated By: {this.props.connection.viewConnection.initiator.name}
        </div>
        <div className="conn-details__text-wrap">
          Original Post:
          <Link to={`/viewpost/${this.props.connection.viewConnection.originalPost.id}`}>
            {this.props.connection.viewConnection.originalPost.title}
          </Link>
        </div>
        <div className="conn-details__text-wrap">
          Status: {this.props.connection.viewConnection.status}
        </div>
        <div className="conn-details__text-wrap">
          Date Updated: {this.props.connection.viewConnection.dateStarted}
        </div>
        <div className="single-post__button-wrap">
          { this.getActions() }
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

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionDetails);
