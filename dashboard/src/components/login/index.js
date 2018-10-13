import React, { Component } from "react";
import { Input, Button } from "antd";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import logo from "../../assets/logo.svg";

import "./styles.css";

class Login extends Component {
  state = {
    username: undefined,
    password: undefined
  };

  handleChangeField = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    const { username, password } = this.state;

    return (
      <div className="login">
        <div className="login__content">
          <div className="logo">
            <img src={logo} />
          </div>
          <div>
            <div className="login__head">
              <h1>Revolutionized promotion platform based on blockchain.</h1>
              <p>Create campaigns based on your marketing needs and have users promote your campaigns to earn rewards</p>
            </div>
            <div className="login__form">
              <Input value={username} onChange={this.handleChangeField} name="username" placeholder="Enter your username" />
              <Input value={password} onChange={this.handleChangeField} name="password" placeholder="Enter your password" />
              <Button>Login</Button>
            </div>
          </div>
          <div className="login__footer">
            <a>About</a>
            <a>Terms</a>
            <a>Privacy</a>
          </div>
        </div>
        <div>

        </div>
      </div>
    );
  };
}

export default Login;
