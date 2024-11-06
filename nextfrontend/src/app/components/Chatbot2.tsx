"use client";
import { useEffect, useRef } from 'react';
import { getResponse, handleSuggestTasks, useChatStore } from '../chatServices/state'; // Adjust the import path as necessary
import { Task } from '../tasks';
import { v4 as uuidv4 } from 'uuid';

function TaskCreationBox({ tasks }: { tasks: Task[] }) {
    return <div>
        {tasks.length > 0 && <i>Suggested tasks:</i>}
        {tasks.map((task) => (
            <div key={uuidv4()} className="p-2 rounded-lg bg-gray-300 text-black mb-2">
                {task.title}
            </div>
        ))}
        {tasks.length > 0 && <i>Chat to propose changes.</i>}
    </div>
}


export default function Chatbot() {
    const { messages, inputValue, setInputValue, proposedTasks } = useChatStore();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleSendMessage = () => {
        // Logic to send the message
        console.log(inputValue);
        setInputValue(''); // Clear input after sending
        getResponse(inputValue);
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <nav className="w-full md:max-w-xs p-4 bg-gray-100 rounded-lg shadow-md max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:w-screen max-md:max-h-1/3">
            <div className="flex flex-col space-y-4">
                <div className="overflow-y-auto max-h-60" ref={messagesEndRef}>
                    {messages.map((message, index) => (
                        <div key={index} className={`p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'} mb-2`}>
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
                <div className="flex gap-2">

                    <button onClick={handleSendMessage} className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        Send
                    </button>
                    <button onClick={handleSuggestTasks} className="p-2 bg-green-500 text-white rounded-lg hover:bg-blue-600">
                        Suggest tasks
                    </button>

                </div>
            </div>
            <TaskCreationBox tasks={proposedTasks} />
        </nav>
    );
};

