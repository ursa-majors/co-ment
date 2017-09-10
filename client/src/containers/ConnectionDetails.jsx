import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import Spinner from './Spinner';
import ModalSm from './ModalSm';
import { formatDate } from '../utils/';

import * as apiActions from '../store/actions/apiConnectionActions';
import * as Actions from '../store/actions/connectionActions';


class ConnectionDetails extends React.Component {

  // Find the connection matching the URL param and set it in redux state.
  componentDidMount() {


    if (!this.props.connection.connections) {
      this.setCurrentConnection(this.props.match.params.id);
    } else {
      // reload connections and find the matching param
      const token = this.props.appState.authToken;
      const userId = this.props.appState.userId;
      this.props.api.getConnections(token, userId)
        .then((result) => {
          if (result.type === 'GET_ALL_CONNECTIONS_SUCCESS') {
            this.setCurrentConnection(this.props.match.params.id);
          }
        })
        .catch((error) => {
          console.log('an error has occurred');
        })
    }
  }

  componentWillUnmount() {
    this.props.actions.clearViewConnection();
  }

  setCurrentConnection = (id) => {
    for (let i = 0; i < this.props.connection.connections.length; i += 1) {
      if (this.props.connection.connections[i]._id === id) {
        this.props.actions.setViewConnection(this.props.connection.connections[i]);
      }
    }
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
    const conn = this.props.connection.viewConnection;

    let mentorAvatar;
    let menteeAvatar;
    if (this.props.connection.viewConnection) {
      if (!this.props.connection.viewConnection.mentor.avatar) {
        mentorAvatar = 'https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/android-chrome-384x384.png';
      } else {
        mentorAvatar = this.props.connection.viewConnection.mentor.avatar;
      }
      if (!this.props.connection.viewConnection.mentee.avatar) {
        menteeAvatar = 'https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/android-chrome-384x384.png';
      } else {
        menteeAvatar = this.props.connection.viewConnection.mentee.avatar;
      }
    }
    const backgroundStyleMentor = {
      backgroundImage: `url(${mentorAvatar})`,
      backgroundSize: "cover",
      backgroundPosition: "center center",
    }
    const backgroundStyleMentee = {
      backgroundImage: `url(${menteeAvatar})`,
      backgroundSize: "cover",
      backgroundPosition: "center center",
    }

    return (
      <div className="container conn-details">
        <Spinner cssClass={this.props.connection.connDetailsSpinnerClass} />
        <ModalSm
          modalClass={this.props.connection.connDetailsModal.class}
          modalText={this.props.connection.connDetailsModal.text}
          modalTitle={this.props.connection.connDetailsModal.title}
          modalType={this.props.connection.connDetailsModal.type}
          dismiss={
            () => {
              this.props.actions.setConnDetailsModal({
                text: '',
                class: 'modal__hide',
                type: '',
                title: '',
              });
            }
          }
        />
        <div className="conn-preview">
          <div className="conn-details__text-wrap">
            <div className="conn-details__title">
              Connection Details
            </div>
          </div>
          <table className="conn-details__table">
            <thead className="conn-details__thead">
              <tr className="conn-details__tr">
                <th className="conn-details__th">
                  <div className={`conn-details__image-wrap`}>
                    <div  className="conn-details__header">Mentor</div>
                      <div className={`conn-details__image-aspect`}>
                        <div className={`conn-details__image-crop`}>
                          <div
                            className={`conn-details__image`}
                            style={backgroundStyleMentor}
                            role="image"
                            aria-label={this.props.connection.viewConnection.mentor.name} />
                        </div>
                      </div>
                      <div className="conn-details__text">{this.props.connection.viewConnection.mentor.name}</div>
                  </div> {/* image-wrap */}
                </th>
                <th className="conn-details__th">
                  <div className={`conn-details__image-wrap`}>
                    <div  className="conn-details__header">Mentee</div>
                      <div className={`conn-details__image-aspect`}>
                        <div className={`conn-details__image-crop`}>
                          <div
                            className={`conn-details__image`}
                            style={backgroundStyleMentee}
                            role="image"
                            aria-label={this.props.connection.viewConnection.mentee.name} />
                        </div>
                      </div>
                    <div className="conn-details__text">{this.props.connection.viewConnection.mentee.name}</div>
                  </div> {/* image-wrap */}
                </th>
              </tr>
            </thead>
            <tbody className="conn-details__tbody">
              <tr className="conn-details__tr">
                <td className="conn-details__td">Initiated By</td>
                <td className="conn-details__td">{this.props.connection.viewConnection.initiator.name}</td>
              </tr>
              <tr className="conn-details__tr">
                <td className="conn-details__td">Original Post</td>
                <td className="conn-details__td"><Link className="conn-details__link" to={`/viewpost/${this.props.connection.viewConnection.originalPost.id}`}>
              {this.props.connection.viewConnection.originalPost.title}
            </Link> </td>
              </tr>
              <tr className="conn-details__tr">
                <td className="conn-details__td">Status</td>
                <td className="conn-details__td">{this.props.connection.viewConnection.status}</td>
              </tr>
              <tr className="conn-details__tr">
                <td className="conn-details__td">Date Updated</td>
                <td className="conn-details__td">{formatDate(new Date(this.props.connection.viewConnection.dateStarted))}</td>
              </tr>
            </tbody>
          </table>
          <div className="single-post__button-wrap">
            { this.getActions() }
          </div>
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
