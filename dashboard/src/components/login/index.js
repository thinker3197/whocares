import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import logo from "../../assets/logo.svg";

import "./styles.css";

class Login extends Component {
  render() {
    const { loading, loggedIn } = this.props;

    if (loggedIn) {
      return <Redirect to="/" />
    }

    return (
      <div className="login">
        <div className="logo">
          <img src={logo} />
        </div>
        <div className="login__content">
          <h1>Revolutionized promotion platform based on blockchain.</h1>
          {/* <LoginForm onUserLogin={this.onUserLogin} otpSent={this.state.otpSent} loading={loading} /> */}
        </div>
        {/* <Footer /> */}
      </div>
    );
  };
}

// const mapStateToProps = state => {
//   return {
//     otpSent: state.api.otpSent,
//     loading: state.ui.loginButtonLoading,
//     loggedIn: state.user.loggedIn
//   };
// };

// const mapDispatchToProps = dispatch => {
//   return {
//     login: (data) => dispatch(login(data))
//   };
// };


// export default connect(null, mapDispatchToProps)(Login);
export default Login;
