// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Messaging {

    struct Message {
        string text;
        address sender;
        uint256 createdAt;
    }

    event SendMessage(string text, address sender, uint256 createdAt);

    Message[] public messages;

    function sendMessage(string memory _text) public {
        Message memory newMessage = Message({
            text: _text,
            sender: msg.sender,
            createdAt: block.timestamp
        });
        messages.push(newMessage);
        emit SendMessage(_text, msg.sender, block.timestamp);
    }

    function getMessages() public view returns (Message[] memory) {
        return messages;
    }

}