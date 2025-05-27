import React, { useState } from 'react';

const RestuarantMenuUploadInput: React.FC<{
    onSend: (message: File | string) => void;
    placeholder: string;
    disabled: boolean;
}> = ({ onSend, placeholder, disabled }) => {
    const [message, setMessage] = useState("");

    const handleSubmit = () => {
        if (!message.trim()) return;
        onSend(message.trim());
        setMessage("");
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onSend(e.target.files[0]);
            // Optionally reset the file input
            e.target.value = "";
        }
    };

    return (
        <div className="chat-input-container">
            <label className="icon-button" title="Drop Images or send links">
                📂
                <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                    disabled={disabled}
                />
            </label>
            <input
                className="chat-input"
                type="text"
                placeholder={placeholder}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                disabled={disabled}
            />
            <button className="icon-button" title="Voice" disabled={disabled}>🎤</button>
            <button className="icon-button" title="Send" onClick={handleSubmit} disabled={disabled}>⬆️</button>
        </div>
    );
};

export default RestuarantMenuUploadInput