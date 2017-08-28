import update from 'immutability-helper';
import React from 'react';
import { Link } from 'react-router-dom';

import { SET_VIEW_CONNECTION, CLEAR_VIEW_CONNECTION, SET_CONNECTIONS_MODAL_CLASS,
  SET_CONNECTIONS_MODAL_TEXT } from '../actions/connectionActions';
import { CONTACT_REQUEST, CONTACT_SUCCESS, CONTACT_FAILURE } from '../actions/apiActions';
import { CONNECTION_REQUEST, CONNECTION_SUCCESS, CONNECTION_FAILURE, GET_ALL_CONNECTIONS_REQUEST,
  GET_ALL_CONNECTIONS_SUCCESS, GET_ALL_CONNECTIONS_FAILURE, UPDATE_CONNECTION_STATUS_REQUEST,
  UPDATE_CONNECTION_STATUS_SUCCESS, UPDATE_CONNECTION_STATUS_FAILURE, GET_CONNECTION_REQUEST,
  GET_CONNECTION_SUCCESS, GET_CONNECTION_FAILURE } from '../actions/apiConnectionActions';

const defaultConn = {
  _id: '',
  mentor: {
    id: '',
    name: '',
    avatar: '',
  },
  mentee: {
    id: '',
    name: '',
    avatar: '',
  },
  initiator: {
    id: '',
    name: '',
  },
  originalPost: {
    id: '',
    title: '',
  },
  dateStarted: '',
  dateEnded: '',
  dateAccepted: '',
  dateDeclined: '',
  status: '',
};

const INITIAL_STATE = {
  connectionId: null,
  contact_loading: false,
  contact_error: null,
  connect_loading: false,
  connect_error: null,
  getConnectionsSpinnerClass: 'spinner__hide',
  getConnectionsModalClass: 'modal__hide',
  getConnectionsModalText: '',
  connections: [],
  viewConnection: defaultConn,
  updateConnectionSpinnerClass: 'spinner__hide',
  updateConnectionModalClass: 'modal__hide',
  updateConnectionModalText: '',
  updateConnectionError: '',
  connDetailsSpinnerClass: 'spinner__hide',
  connDetailsModalClass: 'modal__hide',
  connDetailsModalText: '',
};

function connection(state = INITIAL_STATE, action) {
  let error;
  let index;
  switch (action.type) {

    case SET_VIEW_CONNECTION:
      return Object.assign({}, state, { viewConnection: action.payload });

    case CLEAR_VIEW_CONNECTION:
      return Object.assign({}, state, { viewConnection: defaultConn });

    case SET_CONNECTIONS_MODAL_CLASS:
      return Object.assign({}, state, { getConnectionsModalClass: action.payload });

    case SET_CONNECTIONS_MODAL_TEXT:
      return Object.assign({}, state, { getConnectionsModalText: action.payload });

    case CONTACT_REQUEST:
      return Object.assign({}, state, { contact_loading: true, contact_error: null });

    case CONTACT_SUCCESS:
      return Object.assign({}, state, { contact_loading: false, contact_error: null });

    case CONTACT_FAILURE:
      error = action.payload.data || { message: action.payload.message };
      return Object.assign({}, state, { contact_loading: false, contact_error: error });

    case CONNECTION_REQUEST:
      return Object.assign({}, state, { connect_loading: true, connect_error: null });

    case CONNECTION_SUCCESS:
      const id = action.payload.connectionId;
      console.log('92', id);
      return Object.assign({}, state, { connect_loading: false, connect_error: null, connectionId: id, });

    case CONNECTION_FAILURE:
      error = action.payload.data || { message: action.payload.message };
      return Object.assign({}, state, { connect_loading: false, connect_error: error });

    case GET_ALL_CONNECTIONS_REQUEST:
      return Object.assign(
        {},
        state,
        {
          getConnectionsSpinnerClass: 'spinner__show',
          getConnectionsModalClass: 'modal__hide',
        },
      );


    case GET_ALL_CONNECTIONS_SUCCESS:
      if (action.payload.connections.length > 0) {
        return Object.assign(
          {},
          state,
          {
            connections: action.payload.connections,
            getConnectionsSpinnerClass: 'spinner__hide',
            getConnectionsModalClass: 'modal__hide',
          },
        );
      }
      return Object.assign(
        {},
        state,
        {
          getConnectionsSpinnerClass: 'spinner__hide',
          getConnectionsModalClass: 'modal__show',
          getConnectionsModalText: `You haven't made any connections yet. Search our posts to find a Mentor or Mentee connection.`
        },
      );

    case GET_ALL_CONNECTIONS_FAILURE:
      error = action.payload.message || 'An error occurred';
      return Object.assign(
        {},
        state,
        {
          getConnectionsSpinnerClass: 'spinner__hide',
          getConnectionsModalClass: 'modal__show',
          getConnectionsModalText: error,
        },
      );

    case GET_CONNECTION_REQUEST:
      return Object.assign({}, state, { connDetailsSpinnerClass: 'spinner__show' });

    case GET_CONNECTION_SUCCESS:
      return Object.assign(
        {},
        state,
        {
          connDetailsSpinnerClass: 'spinner__hide',
          viewConnection: action.payload,
        },
      );

    case GET_CONNECTION_FAILURE:
      error = action.payload.message || 'An error occurred';
      return Object.assign(
        {},
        state,
        {
          connDetailsSpinnerClass: 'spinner__hide',
          connDetailsModalClass: 'modal__show',
          connDetailsModalText: error,
        },
      );
    case UPDATE_CONNECTION_STATUS_REQUEST:
      return Object.assign(
        {},
        state,
        {
          updateConnectionSpinnerClass: 'spinner__show',
          updateConnectionError: '',
        },
      );

    case UPDATE_CONNECTION_STATUS_SUCCESS:
      index = -1;
      for (index = 0; index < state.connections.length; index += 1) {
        if (state.connections[index]._id === action.payload._id) {
          break;
        }
      }
      return update(
        state,
        {
          updateConnectionSpinnerClass: { $set: 'spinner__hide' },
          updateConnectionError: { $set: '' },
          updateConnectionModalClass: { $set: 'modal__show' },
          updateConnectionModalText: { $set: 'success' },
          connections: { $splice: [[index, 1, action.payload.conn]] },
          viewConnection: { $set: action.payload.conn },
        },
      );

    case UPDATE_CONNECTION_STATUS_FAILURE:
      return Object.assign(
        {},
        state,
        {
          updateConnectionSpinnerClass: 'spinner__hide',
          updateConnectionError: 'An error occurred',
        },
      );

    default:
      return state;
  }
}

export default connection;
