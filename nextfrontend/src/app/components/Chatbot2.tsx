"use client";
import { useEffect, useRef } from 'react';
import { handleSendMessage, handleSuggestTasks, useChatStore, createProposedTasks, rejectProposedTasks } from '../chatServices/state'; // Adjust the import path as necessary
import { Task } from '../tasks';
import { v4 as uuidv4 } from 'uuid';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

function TaskCreationBox({ tasks }: { tasks: Task[] }) {
    return (
        <div className="flex flex-col">
            {tasks.length > 0 && <i>Suggested tasks:</i>}

            <div className="flex flex-row max-w-96">
                <Accordion type="single" collapsible>
                    {tasks.map((task, index) => (
                        <AccordionItem key={uuidv4()} value={`item-${index}`}>
                            <AccordionTrigger>{task.title}</AccordionTrigger>
                            <AccordionContent>{task.description}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
            {/* {tasks.length > 0 && <i>Chat to propose changes.</i>} */}
        </div>
    )
}


export default function Chatbot() {
    const { messages, inputValue, setInputValue, proposedTasks } = useChatStore();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <nav className="w-full md:max-w-xs p-4 bg-gray-100 rounded-lg shadow-md max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:w-screen">
            <div className="flex flex-col space-y-4">
                <div className="overflow-y-auto max-h-60 md:max-h-[calc(100vh-14rem)]" ref={messagesEndRef}>
                    {messages.filter((message) => !message.content.startsWith("[Task suggester]") && !message.content.startsWith("[Requesting task suggestions]")).map((message, index) => (
                        <div key={index} className={`p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'} mb-2`}>
                            <strong>{message.role}:</strong> {message.content}
                        </div>
                    ))}
                    <TaskCreationBox tasks={proposedTasks} />
                </div>
                <div className="flex">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSendMessage();
                            }
                        }}
                        placeholder={proposedTasks.length === 0 ? "Type your message..." : "Are you ready to act on these tasks now? If not, propose changes..."}
                        className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex gap-2">

                    <button onClick={handleSendMessage} className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        Send
                    </button>
                    <button onClick={handleSuggestTasks} className="p-2 bg-green-500 text-white rounded-lg hover:bg-blue-600" title="Suggest tasks based on conversation">
                        {proposedTasks.length > 0 ? "Modify" : "Suggest"}
                    </button>
                    <button onClick={createProposedTasks} className="p-2 bg-purple-800 text-white rounded-lg hover:bg-blue-600" title="Create proposed tasks">
                        Create
                    </button>
                    <button onClick={rejectProposedTasks} className="p-2 bg-red-800 text-white rounded-lg hover:bg-blue-600" title="Reject proposed tasks">
                        Reject
                    </button>
                </div>
            </div>

        </nav>
    );
};

