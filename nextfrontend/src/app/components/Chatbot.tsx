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
        <nav className="w-48 p-4 bg-gray-100 rounded-lg shadow-md">
            <div className="flex flex-col space-y-4">
                <div className="overflow-y-auto max-h-60">
                    {messages.map((message, index) => (
                        <div key={index} className={`p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                            <strong>{message.role}:</strong> {message.content}
                        </div>
                    ))}
                </div>
                <div className="flex">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Type your message..."
                        className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button onClick={handleSendMessage} className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    Send
                </button>
            </div>
        </nav>
    );
};

