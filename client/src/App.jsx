import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { setWindowSize } from './store/actions';

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
import ViewPost from './containers/ViewPost';
import ViewProfile from './containers/ViewProfile';
import Connection from './containers/Connection';
import Connections from './containers/Connections';
import ConnectionResult from './containers/ConnectionResult';
import ConnectionDetails from './containers/ConnectionDetails';
import Validate from './containers/Validate';
import ResetPassword from './containers/ResetPassword';
import UserAdmin from './containers/UserAdmin';

class App extends React.Component {

  componentDidMount() {
    window.addEventListener('resize', this.debounce(this.updateDimensions, 100));
    this.updateDimensions();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () => {
    const size = {
      width: window.innerWidth,
      mobile: (window.innerWidth < 480),
    };
    this.props.actions.setWindowSize(size);
  }

  debounce(callback, wait, context = this) {
    let timeout = null;
    const later = () => callback.apply(context);

    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
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
              <Route path="/viewpost/:id" component={ViewPost} />
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
  }).isRequired,
  actions: PropTypes.shape({
    setWindowSize: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = state => ({
  appState: state.appState,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ setWindowSize }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
