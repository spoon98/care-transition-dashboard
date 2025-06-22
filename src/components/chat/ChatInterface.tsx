// src/components/chat/ChatInterface.tsx
"use client";

import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { Message } from '@/types/chat';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const STORAGE_KEY = 'care-transition-chat-messages';

const saveMessagesToStorage = (messages: Message[]) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
        console.error('Error saving messages to localStorage:', error);
    }
};

const loadMessagesFromStorage = (): Message[] => {
    // Check if we're in the browser
    if (typeof window === 'undefined') {
        return [
            {
                id: crypto.randomUUID(),
                role: 'assistant',
                text: "Hello! How can I help you with care transitions today?",
                timestamp: new Date()
            }
        ];
    }

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            return parsed.map((msg: Message & { sender?: string }) => ({
                ...msg,
                role: msg.role || (msg.sender === 'user' ? 'user' : 'assistant'), // Handle old 'sender' field
                sender: undefined, // Remove old sender field
                timestamp: new Date(msg.timestamp)
            }));
        }
    } catch (error) {
        console.error('Error loading messages from localStorage:', error);
    }
    return [
        {
            id: crypto.randomUUID(),
            role: 'assistant',
            text: "Hello! How can I help you with care transitions today?",
            timestamp: new Date()
        }
    ];
};

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>(() => loadMessagesFromStorage());
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        saveMessagesToStorage(messages);
    }, [messages]);

    const handleSend = async () => { // Removed text parameter, uses inputValue directly
        if (inputValue.trim() === '' || isLoading) return;

        const newUserMessage: Message = {
            id: crypto.randomUUID(), // Use crypto.randomUUID for better uniqueness
            role: 'user',
            text: inputValue,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newUserMessage]);
        const currentInput = inputValue; // Capture before clearing
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: currentInput }),
            });

            const data = await response.json(); // Always try to parse JSON first

            if (!response.ok) {
                // Use error from JSON response if available, otherwise use status text
                const errorText = data?.error || `API Error: ${response.status} ${response.statusText}`;
                throw new Error(errorText);
            }

            const assistantMessage: Message = {
                id: crypto.randomUUID(),
                role: 'assistant',
                text: '', // Default empty text, will be populated based on response
                timestamp: new Date(),
            };

            if (data.actionCards && Array.isArray(data.actionCards)) {
                assistantMessage.actionCards = data.actionCards;
                if (data.actionCards.length === 0) {
                    assistantMessage.text = 'No specific actions were identified for your query.';
                } else {
                    // Optional: Add a summary text if there are cards
                    // assistantMessage.text = `Found ${data.actionCards.length} action(s).`;
                }
            } else if (data.response) { // Check for plain text response if no actionCards
                assistantMessage.text = data.response;
            } else if (data.error) { // Handle structured error from API
                assistantMessage.text = `Error: ${data.error}`;
            } else {
                assistantMessage.text = 'Received an unexpected response format from the AI.';
                console.warn("Unexpected API response format:", data);
            }
            setMessages((prev) => [...prev, assistantMessage]);

        } catch (error) {
            console.error('Error calling chat API or processing response:', error);
            const errorMessage: Message = {
                id: crypto.randomUUID(),
                role: 'assistant',
                text: error instanceof Error ? error.message : "Sorry, an unexpected error occurred. Please try again.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full h-[75vh] flex flex-col shadow-lg border-2 border-cascala-gray-200">
            <CardHeader className="p-6 border-b-2 border-cascala-gray-200 bg-white">
                <CardTitle className="text-xl text-cascala-gray-900">
                    Care Transition Assistant
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden p-0 bg-cascala-gray-50">
                <MessageList messages={messages} />
            </CardContent>
            <CardFooter className="border-t-2 border-cascala-gray-200 p-6 bg-white">
                <ChatInput
                    value={inputValue}
                    onChange={setInputValue}
                    onSend={handleSend}
                    disabled={isLoading}
                />
            </CardFooter>
        </Card>
    );
}