import React, { useState, useEffect } from 'react';
import './App.css';
import { ethers } from 'ethers';
import MessagingArtifact from "./artifacts/contracts/Messaging.sol/Messaging.json";
const messagingAddress = "0x2F0F7c59230640D975C038574A0fd92fb5D2cb06";

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState({text: ''});
  const [user, setUser] = useState(null);

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  async function _initialContract(init) {
    const contract = new ethers.Contract(messagingAddress, MessagingArtifact.abi, init);
    return contract;
  }

  async function loadMessages() {
    try {
        const contract = await _initialContract(provider);
        const arr = await contract.getMessages();
        const owner = await signer.getAddress();  
        setUser(owner);

        const allMessages = arr.map(item => {
            return {
                text: item[0],
                sender: item[1],
                createdAt: item[2]
            };
        });

        setMessages(allMessages);
    } catch(err) {
       console.log(err)
    }
    
}

function timestampToDate(timestamp) {
  const date = new Date(timestamp * 1000);
  const formattedDate = date.toLocaleString();
  return formattedDate;
}

window.ethereum.on('accountsChanged', (accounts) => {
  const newAccount = accounts[0];
  setUser(newAccount);
  loadMessages();
});

const initial_contract = new ethers.Contract(messagingAddress, MessagingArtifact.abi, provider);
initial_contract.on('SendMessage', (text, sender, createdAt, event) => {
  loadMessages();
});

const handleInputChange = (event) => {
  const { name, value } = event.target;
  setNewMessage({
      ...newMessage,
      [name]: value
  });
}

async function addProduct() {
  try {
      await requestAccount();
      let text = document.getElementById('message').value;

      const contract = await _initialContract(signer);
      const addItem = await contract.sendMessage(text);
      await addItem.wait();

      setNewMessage({text: ''});
      loadMessages();

  } catch(err) {
      console.log(err)
  }
  
}

useEffect(() => {
  loadMessages();
}, [])

  return (
    <div className="app">
      <header className='header'>
        <h1>Welcome to, P2P-Chat-Hub</h1>
        <p>P2P-Chat-Hub is a decentralized peer-to-peer chat application that prioritizes your privacy and security.</p>
      </header>
      <div className="message-area">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender === user ? 'sent' : 'received'}`}>
             <div className="sender-blob">{message.sender.slice(2, 8)}</div>
             <div className="message-text">{message.text}</div>
             <div className="createdAt-blob">{timestampToDate(message.createdAt)}</div>
          </div>
        ))}
      </div>
      <div className="input-area">
        <input type="text" id="message" name="text" value={newMessage.text} onChange={handleInputChange} required />
        <button onClick={addProduct}>Send</button>
      </div>
    </div>
  );
};

export default App;
