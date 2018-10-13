import React, { Component } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import {connect} from "react-redux";
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
    const {Web3} = nextProps;
    console.log(Web3)
    var accounts=await Web3.web3.eth.getAccounts();
    console.log(accounts);
    setInterval(function() {
      Web3.web3.eth.getAccounts().then(res=>{
       if (accounts[0] !== res[0]) {
         window.location.reload();
       }
      });
    
   }, 100);

    adCam.methods.fundCampaign(0).send({
      from:accounts[0],
      value:Web3.web3.utils.toWei("0.004","ether")
    }).on('transactionHash', function(hash){
      console.log(hash);
  })
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
