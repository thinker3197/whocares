import web3 from "./getWeb3";
const address="0x289bb9e9ce8a001643bc930cd9150fae507cc8b5";
//contract abi//
var abi=[
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_by",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "name",
				"type": "string"
			}
		],
		"name": "CampaignStarted",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "name",
				"type": "string"
			}
		],
		"name": "fundCampaign",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_participant",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "name",
				"type": "string"
			}
		],
		"name": "Paid",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "funder",
				"type": "address"
			}
		],
		"name": "participate",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_participant",
				"type": "address"
			},
			{
				"name": "name",
				"type": "string"
			}
		],
		"name": "payOutBounty",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "CamIdToFunding",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "bytes32"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "FunderToParticipant",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]

export default new web3.eth.Contract(abi, address);
