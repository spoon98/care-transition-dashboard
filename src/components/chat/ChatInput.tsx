// src/components/chat/ChatInput.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    disabled?: boolean; // Optional: to disable input/button during loading
}

export default function ChatInput({ value, onChange, onSend, disabled }: ChatInputProps) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (value.trim()) {
            onSend();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-4 w-full">
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 h-12 px-5 text-sm border-2 border-cascala-gray-200 focus:border-cascala-purple focus:ring-2 focus:ring-cascala-purple/20 rounded-lg"
                disabled={disabled}
            />
            <Button
                type="submit"
                disabled={!value.trim() || disabled}
                className="h-12 px-8 bg-cascala-purple hover:bg-cascala-purple/90 text-white font-medium shadow-sm transition-all duration-200 border-2 border-cascala-purple rounded-lg"
            >
                Send
            </Button>
        </form>
    );
}