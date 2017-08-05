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
import Posts from './containers/Posts';
import AddPost from './containers/AddPost';
import Logout from './containers/Logout';
import MentorPath from './containers/MentorPath';
import ViewPost from './containers/ViewPost';

class App extends React.Component {

  render() {

    // Create the nav header links
    let links;
    let startingClass = '';
    if (this.props.appState.loggedIn === undefined) {
      links = ['authenticating'];
      startingClass = 'h-nav-starting';
    } else if (this.props.appState.loggedIn) {
      links = ['posts', 'profile', 'logout'];
    } else {
      links = ['login'];
    }

    return (
      <BrowserRouter>
        <div>
          <HeaderNav links={links} css={startingClass} />
          <main className="main">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/register" component={Registration} />
              <Route path="/login" component={Login} />
              <Route path="/about" component={About} />
              <Route path="/profile" component={Profile} />
              <Route path="/posts" component={Posts} />
              <Route path="/logout" component={Logout} />
              <Route path="/viewpost/:id" component={ViewPost} />
              <Route path="/addpost" component={AddPost} />
              <Route path="/mentorpath" component={MentorPath} />
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
