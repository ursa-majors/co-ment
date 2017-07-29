import {combineReducers} from 'redux'
import appState from '../reducers/appState'


const rootReducer = combineReducers({
  appState: appState,
})

export default rootReducer
