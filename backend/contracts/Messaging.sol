// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Messaging {

    struct Message {
        string text;
        address sender;
    }

    event SendMessage(string text, address sender);

    Message[] public messages;

    function sendMessage(string memory _text) public {
        Message memory newMessage = Message({
            text: _text,
            sender: msg.sender
        });
        messages.push(newMessage);
        emit SendMessage(_text, msg.sender);
    }

    function getMessages() public view returns (Message[] memory) {
        return messages;
    }

}