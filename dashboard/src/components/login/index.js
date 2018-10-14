import React, { Component } from "react";
import { Input, Button, Row, Col } from "antd";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import { login } from "../../actions";
import logo from "../../assets/logo.svg";
import collabImg from "../../assets/shapes_collaboration.png";

import "./styles.less";

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

  handleClickLogin = (e) => {
    const { login } = this.props;
    const { username, password } = this.state;

    if(username && password) {
      login({username, password});
    }
  };

  render() {
    const { username, password } = this.state;
    const { loggedIn } = this.props;

    if(loggedIn) {
      return <Redirect to="/" />
    }

    return (
      <Row className="login">
        <Col span={12} className="login__content">
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
              <Button onClick={this.handleClickLogin} type="primary">Login</Button>
              <p>Not a whocares user? <a>Sign up</a> now</p>
            </div>
          </div>
          <div className="login__footer">
            <a>About</a>
            <a>Terms</a>
            <a>Privacy</a>
          </div>
        </Col>
        <Col span={12} className="login__brand">
          <img src={collabImg} />
        </Col>
      </Row>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.user.loggedIn
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    login: (data) => dispatch(login(data))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
