// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

contract ChatBot {

    struct Message {
        address sender;
        string text;
        bool fromBot;
        uint256 timeSent;
    }

    struct Chat {
        string name;
        bytes32 identifier;
        Message[] messages;
    }

    struct ChatInfo {
        bytes32 identifier;
        string name;
    }

    string public lastUserMessage;
    ChatInfo[] public chatList;
    mapping(bytes32 => Chat) private chats;

    event MessageSent(bytes32 chatIdentifier, address sender, string text, bool fromBot, uint256 timeSent);
    event ChatCreated(bytes32 chatIdentifier, string name);
    event ChatDeleted(bytes32 chatIdentifier);
    event ChatRenamed(bytes32 chatIdentifier, string newName);

    function sendMessage(bytes32 chatIdentifier, string calldata text, bool fromBot) external {
        require(chats[chatIdentifier].identifier != bytes32(0), "Chat does not exist");
        require(bytes(text).length > 0, "Message cannot be empty");

        // Update last user message if not from bot
        if (!fromBot) {
            lastUserMessage = text;
        }

        chats[chatIdentifier].messages.push(Message({
            sender: msg.sender,
            text: text,
            fromBot: fromBot,
            timeSent: block.timestamp
        }));

        emit MessageSent(chatIdentifier, msg.sender, text, fromBot, block.timestamp);
    }

    function viewChatHistory(bytes32 chatIdentifier) external view returns (Message[] memory) {
        require(chats[chatIdentifier].identifier != bytes32(0), "Chat does not exist");
        return chats[chatIdentifier].messages;
    }

    function viewChatList() external view returns (ChatInfo[] memory) {
        return chatList;
    }

    function createChat(string calldata name) external {
        bytes32 chatIdentifier = keccak256(abi.encodePacked(msg.sender, name, block.timestamp));
        require(chats[chatIdentifier].identifier == bytes32(0), "Chat already exists");

        Chat storage newChat = chats[chatIdentifier];
        newChat.name = name;
        newChat.identifier = chatIdentifier;

        chatList.push(ChatInfo(chatIdentifier, name));

        emit ChatCreated(chatIdentifier, name);
    }

    function deleteChat(bytes32 chatIdentifier) external {
        require(chats[chatIdentifier].identifier != bytes32(0), "Chat does not exist");

        // Remove the chat from mapping
        delete chats[chatIdentifier];

    
        uint256 indexToDelete;
        bool found = false;
        for (uint256 i = 0; i < chatList.length; i++) {
            if (chatList[i].identifier == chatIdentifier) {
                indexToDelete = i;
                found = true;
                break;
            }
        }
        require(found, "Chat identifier not found in chat list");

        if (indexToDelete < chatList.length - 1) {
            chatList[indexToDelete] = chatList[chatList.length - 1];
        }
        chatList.pop();

        emit ChatDeleted(chatIdentifier);
    }

    function renameChat(bytes32 chatIdentifier, string calldata newName) external {
        require(chats[chatIdentifier].identifier != bytes32(0), "Chat does not exist");

        chats[chatIdentifier].name = newName;

        for (uint256 i = 0; i < chatList.length; i++) {
            if (chatList[i].identifier == chatIdentifier) {
                chatList[i].name = newName;
                break;
            }
        }

        emit ChatRenamed(chatIdentifier, newName);
    }

    // Function for other services to get the last user message
    function getLastUserMessage() external view returns (string memory) {
        return lastUserMessage;
    }
}
