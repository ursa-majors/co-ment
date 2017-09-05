import { LOGOUT, SET_REDIRECT_URL, SET_WINDOW_SIZE, SET_MENU_STATE, SET_SCROLLED,
  SET_MENU_BACKGROUND } from '../actions';
import { VALIDATE_TOKEN_REQUEST, VALIDATE_TOKEN_SUCCESS, VALIDATE_TOKEN_FAILURE, LOGIN_SUCCESS,
  REGISTRATION_SUCCESS, REFRESH_TOKEN_SUCCESS } from '../actions/apiLoginActions';

const INITIAL_STATE = {
  loggedIn: false,
  authToken: {},
  userId: '',
  loginSpinnerClass: 'spinner__hide',
  redirectUrl: '',
  windowSize: {
    width: undefined,
    mobile: false,
  },
  menuState: 'closed',
  menuBackground: '',
  windowScrolled: false,
};

/*
*  This is the appState reducer.  It is meant to hold global settings
*  loggedIn: boolean - used to determine top-level menu items
*  authToken: {} - passed with API calls to authenticate on back endpoint
*  userId: string - used extensively to check if loaded data belongs to logged in user
*  loginSpinnerClass string - a css Class that is applied while API is performing login actions
*  redirectUrl: string - passed by the server when a user access an Express route that is not '/'.
*    Client will attempt to load the expected page for the user.
*/
function appState(state = INITIAL_STATE, action) {
  let newBG='';
  switch (action.type) {

    /*
    * This action is issued only from the <Logout/> component.
    * On LOGOUT action, remove the userId and token from localStorage.
    * Reset to initial state.
    */
    case LOGOUT:
      window.localStorage.removeItem('authToken');
      window.localStorage.removeItem('userId');
      return INITIAL_STATE;

    /*
    * This action is issued only from the <Home/> component.
    * On VALIDATE_TOKEN_REQUEST action, set the spinner class to show.
    * This activates the spinner component on the home page so user knows the action is running
    */
    case VALIDATE_TOKEN_REQUEST:
      return Object.assign({}, state, { loginSpinnerClass: 'spinner__show' });

    /*
    * This action is issued only from the <Home/> component, when the localStorage token
    * is successfully validated by the server.
    * On VALIDATE_TOKEN_SUCCESS action, set the spinner class to hide.
    * This hides the spinner component on the home page so user knows the action is complete
    * Save the userId and token in the redux store...set loggedIn to TRUE.
    */
    case VALIDATE_TOKEN_SUCCESS:
      return Object.assign(
        {},
        state,
        {
          loginSpinnerClass: 'spinner__hide',
          loggedIn: true,
          userId: action.payload._id,
          authToken: action.meta.token,
        },
       );

     /*
     * This action is issued only from the <Home/> component, when the localStorage token
     * is not validated by the server.
     * On VALIDATE_TOKEN_FAILURE action, set the spinner class to hide.
     * Remove the invalid values from localStorage
     * Set loggedIn to False - displays different menu items on Home page.
     */
    case VALIDATE_TOKEN_FAILURE:
      window.localStorage.removeItem('authToken');
      window.localStorage.removeItem('userId');
      return Object.assign(
        {},
        state,
        {
          loginSpinnerClass: 'spinner__hide',
          loggedIn: false,
        },
      );

    /*
    * This action is issued only from the <Login/> component.
    * On LOGIN_SUCCESS action, hide the spinner so user knows the action is complete.
    * Save the userId and token to localStorage for later use.
    * Populate the store with userId and token, set logged in to true.
    */
    case LOGIN_SUCCESS:
      window.localStorage.setItem('authToken', JSON.stringify(action.payload.token));
      window.localStorage.setItem('userId', JSON.stringify(action.payload.profile._id));
      return Object.assign(
        {},
        state,
        {
          loginSpinnerClass: 'spinner__hide',
          loggedIn: true,
          userId: action.payload.profile._id,
          authToken: action.payload.token,
        },
       );

    /*
    * This action is issued only from the <Registration/> component.
    * On REGSTRATION_SUCCESS action, save the userId and token to localStorage for later use.
    * Populate the store with userId and token, set logged in to true.
    */
    case REGISTRATION_SUCCESS:
      window.localStorage.setItem('authToken', JSON.stringify(action.payload.token));
      window.localStorage.setItem('userId', JSON.stringify(action.payload.profile._id));
      return Object.assign(
        {},
        state,
        {
          loggedIn: true,
          userId: action.payload.profile._id,
          authToken: action.payload.token,
        },
       );

    /*
    * This action is issued <Login/> and <Home/> components.
    * If the user requests a deep link from the server, they are redirected to the root link,
    * and their requested link is passed to the app, via a hash fragment in the URL
    * The client then tries to set the client route to the hash fragment.
    * This function may be called to clear the redirectUrl after client routing occurs.
    */
    case SET_REDIRECT_URL:
      return Object.assign({}, state, { redirectUrl: action.payload });


    case REFRESH_TOKEN_SUCCESS:
      window.localStorage.setItem('authToken', JSON.stringify(action.payload.token));
      return Object.assign({}, state, { authToken: action.payload.token });


    /*
    * This action is issued from <App/> component.
    * When the client window is resized, this action will be dispatched.
    * The action payload contains the window width, and a boolean to
    * determine mobile status: windowWidth < 480 = true
    */
    case SET_WINDOW_SIZE:
      return Object.assign({}, state, { windowSize: action.payload });

    /*
    * This action is issued from <HeaderNav/> component.
    * Toggles the mobile menu between open/closed states
    */
    case SET_MENU_STATE:
      return Object.assign({}, state, { menuState: action.payload });

    /*
    * This action is issued from <HeaderNav/> and <App/> components.
    * Sets the background CSS on the menu.  If it is scrolled, the background must be set
    * If it is mobile and open, the background must be set
    * If it's not scrolled and the background is set, it must be cleared.
    */
    case SET_MENU_BACKGROUND:
      if (state.windowScrolled && state.menuBackground === '') {
        return Object.assign({}, state, { menuBackground: 'h-nav__side-bkg-noscroll' });
      } else if (state.windowSize.width < 650 && state.menuState === 'open') {
        return Object.assign({}, state, { menuBackground: 'h-nav__side-bkg-noscroll' });
      } else if (!state.windowScrolled && state.menuBackground) {
        return Object.assign({}, state, { menuBackground: '' });
      }
      return state;

    /* Called from <App/> component
    * Used to set a boolean to indicate whether the screen is scrolled
    * This value is used by the Nav menu to properly set the background
    */
    case SET_SCROLLED:
      return Object.assign({}, state, { windowScrolled: action.payload });

    default:
      return state;
  }
}

export default appState;
