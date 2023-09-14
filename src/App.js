import React, { useState, useEffect } from 'react';
import './App.css';
import { ethers } from 'ethers';
import MessagingArtifact from "./artifacts/contracts/Messaging.sol/Messaging.json";
const messagingAddress = "0x9Ee69C0daFf57A0932Cb46C5f57F75E636C897B1";

function App() {
  const [messages, setMessages] = useState([]);
  const [newProduct, setNewProduct] = useState({text: ''});
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

  async function loadProducts() {
    try {
        const contract = await _initialContract(provider);
        const arr = await contract.getMessages();
        const owner = await signer.getAddress();  
        setUser(owner);

        const allProducts = arr.map(item => {
            return {
                text: item[0],
                sender: item[1],
            };
        });

        setMessages(allProducts);
    } catch(err) {
       console.log(err)
    }
    
}

window.ethereum.on('accountsChanged', (accounts) => {
  const newAccount = accounts[0];
  setUser(newAccount);
  loadProducts();
});

const initial_contract = new ethers.Contract(messagingAddress, MessagingArtifact.abi, provider);
initial_contract.on('SendMessage', (text, sender, event) => {
  loadProducts();
});

const handleInputChange = (event) => {
  const { name, value } = event.target;
  setNewProduct({
      ...newProduct,
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

      document.getElementById('message').value = '';

      loadProducts();

  } catch(err) {
      console.log(err)
  }
  
}

useEffect(() => {
  loadProducts();
}, [])

  return (
    <div className="app">
      <header className='header'><h1>Decentralized Messaging Application</h1></header>
      <div className="message-area">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender === user ? 'sent' : 'received'}`}>
             <div className="sender-blob">{message.sender.slice(2, 8)}</div>
             <div className="message-text">{message.text}</div>
          </div>
        ))}
      </div>
      <div className="input-area">
        <input type="text" id="message" name="message" value={newProduct.name} onChange={handleInputChange} required />
        <button onClick={addProduct}>Send</button>
      </div>
    </div>
  );
};

export default App;
