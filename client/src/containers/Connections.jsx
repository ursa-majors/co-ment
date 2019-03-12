import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import * as apiActions from '../store/actions/apiConnectionActions'
import * as Actions from '../store/actions/connectionActions'
import Spinner from './Spinner'
import ModalSm from './ModalSm'
import { formatDate } from '../utils'

class Connections extends React.Component {
  componentDidMount () {
    const token = this.props.appState.authToken
    this.props.api.getConnections(token)
  }

  render () {
    return (
      <div className='connections'>
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
                title: ''
              })
            }
          }
        />
        <div className='conn-details__preview'>
          <div className='conn-details__text-wrap'>
            <div className='conn-details__title'>Connections</div>
          </div>
          <table className='conn-details__table'>
            <thead className='conn-details__thead'>
              <tr className='conn-details__tr'>
                <th className='connections__th'>
                  Mentor
                </th>
                <th className='connections__th'>
                  Mentee
                </th>
                <th className='connections__th'>
                  Status
                </th>
                <th className='connections__th conn-preview__hide-for-small'>
                  Date
                </th>
              </tr>
            </thead>
            <tbody className='conn-details__tbody'>
              {this.props.connection.connections.map((item) => {
                return (
                  <tr className='conn-details__tr' key={item._id}>
                    <td className='connections__td'>{item.mentor.name}</td>
                    <td className='connections__td'>{item.mentee.name}</td>
                    <td className='connections__td'>
                      <Link className='conn-details__link' to={`/connectiondetails/${item._id}`}>
                        {item.status}
                      </Link>
                    </td>
                    <td className='connections__td conn-preview__hide-for-small'>
                      {formatDate(new Date(item.dateStarted))}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

Connections.propTypes = {
  api: PropTypes.shape({
    getConnections: PropTypes.func
  }).isRequired,
  actions: PropTypes.shape({
    setConnectionsModal: PropTypes.func
  }).isRequired,
  appState: PropTypes.shape({
    authToken: PropTypes.string,
    user: PropTypes.shape({
      _id: PropTypes.string
    }).isRequired
  }).isRequired,
  connection: PropTypes.shape({
    connections: PropTypes.array,
    contact_loading: PropTypes.bool,
    contact_error: PropTypes.bool,
    getConnectionsSpinnerClass: PropTypes.string,
    getConnectionsModal: PropTypes.shape({
      type: PropTypes.string,
      title: PropTypes.string,
      text: PropTypes.string,
      class: PropTypes.string
    })
  }).isRequired
}

const mapStateToProps = state => ({
  appState: state.appState,
  connection: state.connection,
  profiles: state.profiles
})

const mapDispatchToProps = dispatch => ({
  api: bindActionCreators(apiActions, dispatch),
  actions: bindActionCreators(Actions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Connections)
