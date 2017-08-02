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

class App extends React.Component {

  render() {
    const link = (this.props.appState.loggedIn ? 'profile' : 'login');
    return (
      <BrowserRouter>
        <div>
          <HeaderNav link={link} />
          <main className="main">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/register" component={Registration} />
              <Route path="/login" component={Login} />
              <Route path="/about" component={About} />
              <Route path="/profile" component={Profile} />
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
