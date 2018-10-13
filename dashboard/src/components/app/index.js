import React, { Component } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import Home from "../home";
import Login from "../login";
import PrivateRoute from "../privateRoute";
import getWeb3 from "../utils/getWeb3";

class App extends Component {
  render() {
    const { authenticated } = this.props;

    return (
      <div id="app">
        <Router>
          <Switch>
            <Route exact path="/login" component={Login} />
            <PrivateRoute authenticated={false} path="/" redirectPath="/login" component={Home} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
