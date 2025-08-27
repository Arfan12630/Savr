import { useState } from 'react';

interface RestuarantEntryInputProps {
  onSend: (message: string | File) => void;
  placeholder: string;
  disabled: boolean;
  showFileInput?: boolean;
}

export function RestuarantEntryInput({
  onSend,
  placeholder,
  disabled,
  showFileInput,
}: RestuarantEntryInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!message.trim()) return;
    onSend(message.trim());
    setMessage('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onSend(file);
      // TODO: React lifecycle violation - manually manipulating DOM
      // Fix: Use refs or controlled components instead of e.target.value = ''
      e.target.value = '';
    }
  };

  return (
    <div className="chat-input-container">
      <label
        className="icon-button"
        title="Upload Image">
        📂
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          disabled={disabled}
        />
      </label>
      <input
        className="chat-input"
        type="text"
        placeholder={placeholder}
        value={message}
        onChange={e => setMessage(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        disabled={disabled}
      />
      <button
        type="button"
        className="icon-button"
        title="Voice"
        disabled={disabled}>
        🎤
      </button>
      <button
        type="button"
        className="icon-button"
        title="Send"
        onClick={handleSubmit}
        disabled={disabled}>
        ⬆️
      </button>
    </div>
  );
}
