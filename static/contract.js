const contractAddress = '0x471e8De43d4079E76D4b2a1cF96B84D9D573A5e3';
const contractABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "chatIdentifier",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "ChatCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "chatIdentifier",
				"type": "bytes32"
			}
		],
		"name": "ChatDeleted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "chatIdentifier",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "newName",
				"type": "string"
			}
		],
		"name": "ChatRenamed",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "createChat",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "chatIdentifier",
				"type": "bytes32"
			}
		],
		"name": "deleteChat",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "chatIdentifier",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "text",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "fromBot",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timeSent",
				"type": "uint256"
			}
		],
		"name": "MessageSent",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "chatIdentifier",
				"type": "bytes32"
			},
			{
				"internalType": "string",
				"name": "newName",
				"type": "string"
			}
		],
		"name": "renameChat",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "chatIdentifier",
				"type": "bytes32"
			},
			{
				"internalType": "string",
				"name": "text",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "fromBot",
				"type": "bool"
			}
		],
		"name": "sendMessage",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "chatList",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "identifier",
				"type": "bytes32"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getLastUserMessage",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lastUserMessage",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "chatIdentifier",
				"type": "bytes32"
			}
		],
		"name": "viewChatHistory",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "sender",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "text",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "fromBot",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "timeSent",
						"type": "uint256"
					}
				],
				"internalType": "struct ChatBot.Message[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "viewChatList",
		"outputs": [
			{
				"components": [
					{
						"internalType": "bytes32",
						"name": "identifier",
						"type": "bytes32"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					}
				],
				"internalType": "struct ChatBot.ChatInfo[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const web3 = new Web3("http://127.0.0.1:8545");
const contract = new web3.eth.Contract(contractABI, contractAddress);

export async function createNewChat(name) {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    return await contract.methods.createChat(name).send({ from: account, gas: 20000000 }); 
}

export async function sendMessage(chatIdentifier, text, fromBot) {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    return await contract.methods.sendMessage(chatIdentifier, text, fromBot).send({ from: account, gas: 20000000 });
}

export async function viewChatHistory(chatIdentifier) {
    return await contract.methods.viewChatHistory(chatIdentifier).call();
}

export async function viewChatList() {
    return await contract.methods.viewChatList().call();
}

export async function deleteChat(chatIdentifier) {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    return await contract.methods.deleteChat(chatIdentifier).send({ from: account, gas: 20000000 }); 
}
export async function renameChat(chatIdentifier, newName) {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    return await contract.methods.renameChat(chatIdentifier, newName).send({ from: account, gas: 20000000 }); 
}

export async function getLastUserMessage() {
    return await contract.methods.getLastUserMessage().call();
}
