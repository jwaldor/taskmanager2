"use client";
import { getResponse, useChatStore } from '../chatServices/state'; // Adjust the import path as necessary

export default function Chatbot() {
    const { messages, inputValue, setInputValue } = useChatStore();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleSendMessage = () => {
        // Logic to send the message
        console.log(inputValue);
        setInputValue(''); // Clear input after sending
        getResponse(inputValue);
    };

    return (
        <nav className="w-48">
            <div>
                <div className="">
                    {messages.map((message, index) => (
                        <div key={index}>
                            <strong>{message.role}:</strong> {message.content}
                        </div>
                    ))}
                </div>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </nav>
    );
};

