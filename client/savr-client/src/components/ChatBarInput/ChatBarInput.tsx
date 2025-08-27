import { useState } from 'react';
import './ChairBarInput.css';

const ChatInput = ({ onSend }: { onSend: (message: string) => void }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!message.trim()) return;
    onSend(message.trim());
    setMessage('');
  };

  return (
    <div className="chat-input-container">
      {/* <button className="icon-button" title="Search">🌐</button> */}
      <input
        className="chat-input"
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={e => setMessage(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
      />

      {/* <button className="icon-button" title="Voice">🎤</button> */}
      <button
        className="icon-button"
        title="Send"
        onClick={handleSubmit}>
        ⬆{' '}
      </button>
    </div>
  );
};

export { ChatInput };
