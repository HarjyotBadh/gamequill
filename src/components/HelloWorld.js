import React, { useState } from 'react';

function HelloWorld() {
  const [message, setMessage] = useState('');
  const [inputText, setInputText] = useState('');

  const sendText = () => {
    fetch('https://us-central1-gamequill-3bab8.cloudfunctions.net/helloWorld', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: inputText }),
    })
    .then(response => response.json())
    .then(data => setMessage(data.message))
    .catch(error => console.error('Error:', error));
  };

  return (
    <div>
      <input 
        type="text" 
        value={inputText} 
        onChange={e => setInputText(e.target.value)}
        placeholder="Enter text"
      />
      <button onClick={sendText}>Send Text</button>
      <p>{message}</p>
    </div>
  );
}

export default HelloWorld;
