import React, { Component } from "react";
import { connect } from "react-redux";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import Home from "../home";
import Login from "../login";
import PrivateRoute from "../privateRoute";
import {setWeb3} from "../../actions/index";
import adCam from "../../utils/contract";

class App extends Component {
 componentDidMount() {
  this.props.set_Web3();
 };

 componentWillReceiveProps = async (nextProps) =>{
    try {
      const {Web3} = nextProps;
      console.log(Web3)
      var accounts=await Web3.web3.eth.getAccounts();
      console.log(accounts);
      if(accounts.length===0) throw "No accounts found";
      //reload when user changes address or current provider
      setInterval(function() {
        Web3.web3.eth.getAccounts().then(res=>{
         if (accounts[0] !== res[0]) {
           window.location.reload();
         }
        });

     }, 100);
      //////////////////////
      adCam.methods.fundCampaign("cam1").send({
        from:accounts[0],
        value:Web3.web3.utils.toWei("0.004","ether")
      }).on('transactionHash', function(hash){
        console.log(hash);
    })

    } catch (error) {
      alert(error);
    }

 }

  render() {
    const { loggedIn } = this.props;

    return (
      <div id="app">
        <p>{this.props.web3 ? this.props.web3.providers : "-"}</p>
        <Router>
          <Switch>
            <Route exact path="/login" component={Login} />
            <PrivateRoute authenticated={loggedIn} path="/" redirectPath="/login" component={Home} />
          </Switch>
        </Router>
      </div>
    );
  }
}
const mapStateToProps=(state)=>{
  return {
    Web3: state.web3Red,
    loggedIn: state.user.loggedIn
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    set_Web3:function(){
      dispatch(setWeb3());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
