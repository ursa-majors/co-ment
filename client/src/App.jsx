import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import HeaderNav from './containers/HeaderNav';
import Home from './containers/Home';
import FooterNav from './containers/FooterNav';
import About from './containers/About';
import Login from './containers/Login';
import Registration from './containers/Registration';
import Profile from './containers/Profile';
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

class App extends React.Component {

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
              <Route path="/profile" component={Profile} />
              <Route path="/posts" component={PostsGrid} />
              <Route path="/logout" component={Logout} />
              <Route path="/viewpost/:id" component={ViewPost} />
              <Route path="/viewprofile/:id" component={ViewProfile} />
              <Route path="/editpost/:id?" component={EditPost} />
              <Route path="/mentorpath" component={MentorPath} />
              <Route path="/connection" component={Connection} />
              <Route path="/connections" component={Connections} />
              <Route path="/connectionresult" component={ConnectionResult} />
              <Route path="/connectiondetails/:id" component={ConnectionDetails} />
              <Route path="/validate" component={Validate} />
            </Switch>
          </main>
          <FooterNav />
        </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => ({
  appState: state.appState,
});

export default connect(mapStateToProps)(App);
