import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import HeaderNav from './containers/HeaderNav';
import Home from './containers/Home';
import FooterNav from './containers/FooterNav';
import About from './containers/About';
import Login from './containers/Login';
import Registration from './containers/Registration';

const App = () => (
  <BrowserRouter>
    <div>
      <HeaderNav />
      <main className="main">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/register" component={Registration} />
          <Route path="/login" component={Login} />
          <Route path="/about" component={About} />
        </Switch>
      </main>
      <FooterNav />
    </div>
  </BrowserRouter>
    );

export default App;
