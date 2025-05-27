import React, { useState } from 'react';

const RestuarantEntryInput: React.FC<{
    onSend: (message: any) => void;
    placeholder: string;
    disabled: boolean;
}> = ({ onSend, placeholder, disabled }) => {
    const [message, setMessage] = useState("");

    const handleSubmit = () => {
        if (!message.trim()) return;
        onSend(message.trim());
        setMessage("");
    };

    return (
        <div className="chat-input-container">
            <button className="icon-button" title="Drop Images or send links">📂 🔗</button>
            <input
                className="chat-input"
                type="text"
                placeholder= {placeholder}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            <button className="icon-button" title="Voice">🎤</button>
            <button className="icon-button" title="Send" onClick={handleSubmit}>⬆️</button>
        </div>
    );
};

export default RestuarantEntryInput;