import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { setWindowSize, setMenuState, setMenuBackground, setScrolled } from './store/actions';

import './favicons/favicons';
import HeaderNav from './containers/HeaderNav';
import Home from './containers/Home';
import About from './containers/About';
import Login from './containers/Login';
import Registration from './containers/Registration';
import EditProfile from './containers/EditProfile';
import PostsGrid from './containers/PostsGrid';
import EditPost from './containers/EditPost';
import Logout from './containers/Logout';
import MentorPath from './containers/MentorPath';
import PostFull from './containers/PostFull';
import ViewProfile from './containers/ViewProfile';
import Connection from './containers/Connection';
import Connections from './containers/Connections';
import ConnectionResult from './containers/ConnectionResult';
import ConnectionDetails from './containers/ConnectionDetails';
import Validate from './containers/Validate';
import ResetPassword from './containers/ResetPassword';
import UserAdmin from './containers/UserAdmin';

class App extends React.Component {

  componentWillMount() {
    this.updateDimensions();
  }

  componentDidMount() {
    window.addEventListener('resize', this.debounce(this.updateDimensions, 100, true));
    window.addEventListener('scroll', this.throttle(this.setScrolledStatus, 100));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
    window.removeEventListener('scroll', throttled, false);
  }

  setScrolledStatus = () => {
    const s = (window.scrollY > 0);
    // save scroll position to use for about page mobile background bug
    const sp = (window.scrollY);
    if (s !== this.props.appState.windowScrolled) {
      this.props.actions.setScrolled(s, sp);
      this.props.actions.setMenuBackground();
    }
  }

  // Limit the scroll event handler
  throttle(callback, wait, context = this) {
    let timeout = null;

    const later = () => {
      callback.apply(context);
      timeout = null;
    };

    return function throttled() {
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
    };
  }

  // Wait till resize finishes before calling again
  debounce(func, wait, immediate) {
    let timeout;
    return () => {
      const context = this;
      const later = () => {
        timeout = null;
        if (!immediate) func.apply(context);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context);
    };
  }

  // Set window dimensions / mobile status in Redux
  updateDimensions = () => {
    const size = {
      width: window.innerWidth,
      height: window.innerHeight,
      mobile: (window.innerWidth < 480),
    };
    this.props.actions.setWindowSize(size);
    if (this.props.appState.windowSize.width > 650 && this.props.appState.menuState === 'open') {
      this.props.actions.setMenuState('closed');
      this.props.actions.setMenuBackground();
    }
  }

  render() {
    const links = (this.props.appState.loggedIn ? ['posts', 'profile', 'connections', 'logout'] : ['login']);
    return (
      <BrowserRouter>
        <div className="app-root">
          <HeaderNav links={links} />
          <main className="main" id="main">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/register" component={Registration} />
              <Route path="/login" component={Login} />
              <Route path="/about" component={About} />
              <Route path="/profile" component={UserAdmin} />
              <Route path="/posts" component={PostsGrid} />
              <Route path="/logout" component={Logout} />
              <Route path="/viewpost/:id" component={PostFull} />
              <Route path="/viewprofile/:id" component={ViewProfile} />
              <Route path="/editprofile/:id" component={EditProfile} />
              <Route path="/editpost/:id?" component={EditPost} />
              <Route path="/mentorpath" component={MentorPath} />
              <Route path="/connection" component={Connection} />
              <Route path="/connections" component={Connections} />
              <Route path="/connectionresult" component={ConnectionResult} />
              <Route path="/connectiondetails/:id" component={ConnectionDetails} />
              <Route path="/validate" component={Validate} />
              <Route path="/resetpassword/:key" component={ResetPassword} />
            </Switch>
          </main>
        </div>
      </BrowserRouter>
    );
  }
}

App.propTypes = {
  appState: PropTypes.shape({
    loggedIn: PropTypes.boolean,
    menuState: PropTypes.String,
    menuBackground: PropTypes.String,
    windowScrolled: PropTypes.boolean,
    windowSize: PropTypes.shape({
      width: PropTypes.Number,
    }).isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    setWindowSize: PropTypes.func,
    setMenuState: PropTypes.func,
    setMenuBackground: PropTypes.func,
    setScrolled: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = state => ({
  appState: state.appState,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    setWindowSize,
    setMenuBackground,
    setMenuState,
    setScrolled,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
