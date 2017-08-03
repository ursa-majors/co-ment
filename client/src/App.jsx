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

class App extends React.Component {

  render() {
    const links = (this.props.appState.loggedIn ? ['posts', 'profile', 'logout'] : ['login']);
    return (
      <BrowserRouter>
        <div>
          <HeaderNav links={links} />
          <main className="main">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/register" component={Registration} />
              <Route path="/login" component={Login} />
              <Route path="/about" component={About} />
              <Route path="/profile" component={Profile} />
              <Route path="/posts" component={Posts} />
              <Route path="/logout" component={Logout} />
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
