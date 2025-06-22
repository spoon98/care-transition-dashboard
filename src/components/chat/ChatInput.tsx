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

// Spinner component
const Spinner = () => (
    <svg
        className="animate-spin h-4 w-4 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
    >
        <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
        />
        <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
    </svg>
);

export default function ChatInput({ value, onChange, onSend, disabled }: ChatInputProps) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (value.trim() && !disabled) {
            onSend();
        }
    };

    const isLoading = disabled;

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
                className="h-12 px-8 bg-cascala-purple hover:bg-cascala-purple/90 text-white font-medium shadow-sm transition-all duration-200 border-2 border-cascala-purple rounded-lg flex items-center justify-center gap-2 min-w-[100px]"
            >
                {isLoading ? (
                    <>
                        <Spinner />
                        <span>Thinking</span>
                    </>
                ) : (
                    'Send'
                )}
            </Button>
        </form>
    );
}