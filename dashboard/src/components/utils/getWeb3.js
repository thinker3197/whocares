import Web3 from "web3";
let web3=window.web3;
if (typeof web3 !== 'undefined') {
  web3 = new Web3(window.web3.currentProvider);
} else {
  // Set the provider you want from Web3.providers (local not supported)
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

export default web3;
