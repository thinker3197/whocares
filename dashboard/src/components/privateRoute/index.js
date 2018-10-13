import React from "react";
import { Route, Redirect } from "react-router-dom";

function PrivateRoute({ component: Component, ...rest }) {
  const { authenticated, redirectPath } = rest;

  return (
    <Route
      {...rest}
      render={props =>
        authenticated === true ? (
          <Component {...props} />
        ) : (
            <Redirect to={{ pathname: redirectPath, state: { from: props.location } }} />
          )
      }
    />
  );
}

export default PrivateRoute;
