import React, { Component } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import {connect} from "react-redux";
import Home from "../home";
import Login from "../login";
import PrivateRoute from "../privateRoute";
import getWeb3 from "../../utils/getWeb3";
import {setWeb3} from "../../actions/index";
class App extends Component {
 componentDidMount() {
  this.props.set_Web3();
 };

 componentWillReceiveProps = async (nextProps) =>{
    const {Web3} = nextProps;
    console.log(Web3)
    var accounts=await Web3.web3.eth.getAccounts();
    console.log(accounts);
 }

  render() {
    const { authenticated } = this.props;

    return (
      <div id="app">
        <p>{this.props.web3 ? this.props.web3.providers : "-"}</p>
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
const mapStateToProps=(state)=>{
  return {Web3: state.web3Red};
}
const mapDispatchToProps = (dispatch) => {
  return {
    set_Web3:function(){
      dispatch(setWeb3());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
