// src/components/chat/ChatMessage.tsx
import React, { useState, useEffect } from 'react';
import { Message } from '@/types/chat';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ActionCardDisplay from '@/components/cards/ActionCardDisplay';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
    message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
    const [isMounted, setIsMounted] = useState(false);
    const isUser = message.role === 'user';

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Don't render anything during SSR
    if (!isMounted) {
        return null;
    }

    // Client-side rendering only
    return (
        <div className={cn("flex items-end gap-2 w-full", isUser ? "justify-end" : "justify-start")}>
            {!isUser && (
                <Avatar className="h-8 w-8 self-start mt-1">
                    <AvatarImage src="/placeholder-assistant.png" alt="Assistant" />
                    <AvatarFallback>A</AvatarFallback>
                </Avatar>
            )}
            <div
                className={cn(
                    "max-w-[75%] rounded-lg px-3 py-2 shadow-sm flex flex-col",
                    isUser
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-muted text-muted-foreground rounded-bl-none"
                )}
            >
                {message.text && (
                    <p className={cn("text-sm whitespace-pre-wrap", (message.actionCards && message.actionCards.length > 0) ? "mb-2" : "")}>{message.text}</p>
                )}

                {message.actionCards && message.actionCards.length > 0 && (
                    <div className="mt-1 space-y-2 w-full">
                        {message.actionCards.map((card, index) => (
                            <ActionCardDisplay key={index} card={card} />
                        ))}
                    </div>
                )}

                <p className={cn("text-xs opacity-70 mt-1.5", isUser ? "text-right" : "text-left")}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
            {isUser && (
                <Avatar className="h-8 w-8 self-start mt-1">
                    <AvatarImage src="/placeholder-user.png" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
            )}
        </div>
    );
}