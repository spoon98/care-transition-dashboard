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
        <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
                disabled={disabled}
            />
            <Button type="submit" disabled={!value.trim() || disabled}>
                Send
            </Button>
        </form>
    );
}