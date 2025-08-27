import { useState } from 'react';

const RestuarantEntryInput = ({
    onSend: (message: any) => void;
    placeholder: string;
    disabled: boolean;
    showFileInput?: boolean;
}> = ({ onSend, placeholder, disabled, showFileInput }) => {
    const [message, setMessage] = useState("");

    const handleSubmit = () => {
        if (!message.trim()) return;
        onSend(message.trim());
        setMessage("");
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            console.log("File selected:", file.name, file.type, file.size);
            onSend(file);
            e.target.value = "";
        }
    };

    return (
        <div className="chat-input-container">
            <label className="icon-button" title="Upload Image">
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

export default RestuarantEntryInput;