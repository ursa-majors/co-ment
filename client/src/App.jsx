import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import Home from './containers/Home';
import Mentors from './containers/Mentors';
import Mentees from './containers/Mentees';

const App = () => (
  <BrowserRouter>
    <main>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/register" component={Registration} />
        <Route path="/mentors" component={Mentors} />
        <Route path="/mentees" component={Mentees} />
      </Switch>
    </main>
  </BrowserRouter>
    );

export default App;
