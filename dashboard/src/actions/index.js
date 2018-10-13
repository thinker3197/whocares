import Web3 from "web3";
/**
 * @dev initialise web3
 */
export const setWeb3=()=>{
    var web3 = undefined;

    if(window.web3) {
        web3 = window.web3;
    }
     
    if (typeof web3 !== 'undefined') {
    web3 = new Web3(window.web3.currentProvider);
    } else {
    // Set the provider you want from Web3.providers (local not supported)
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    return {
        type:"SET_WEB3",
        payload: web3
    }
}