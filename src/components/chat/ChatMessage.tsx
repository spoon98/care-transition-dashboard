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
        <div className={cn("flex items-start gap-4 w-full px-6 py-3", isUser ? "justify-end" : "justify-start")}>
            {!isUser && (
                <Avatar className="h-10 w-10 border-2 border-cascala-gray-200">
                    <AvatarImage src="/placeholder-assistant.png" alt="Assistant" />
                    <AvatarFallback className="bg-cascala-purple text-white font-medium">A</AvatarFallback>
                </Avatar>
            )}
            <div
                className={cn(
                    "max-w-[70%] rounded-xl px-5 py-4 shadow-subtle flex flex-col",
                    isUser
                        ? "bg-cascala-purple text-white rounded-br-sm border-2 border-cascala-purple"
                        : "bg-white text-cascala-gray-900 rounded-bl-sm border-2 border-cascala-gray-200"
                )}
            >
                {message.text && (
                    <p className={cn(
                        "text-sm leading-relaxed whitespace-pre-wrap",
                        (message.actionCards && message.actionCards.length > 0) ? "mb-4" : ""
                    )}>
                        {message.text}
                    </p>
                )}

                {message.actionCards && message.actionCards.length > 0 && (
                    <div className="mt-3 space-y-4 w-full">
                        {message.actionCards.map((card, index) => (
                            <ActionCardDisplay key={index} card={card} />
                        ))}
                    </div>
                )}

                <p className={cn(
                    "text-xs mt-3 pt-2 border-t",
                    isUser
                        ? "text-cascala-purple/80 text-right border-cascala-purple/20"
                        : "text-cascala-gray-500 text-left border-cascala-gray-100"
                )}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
            {isUser && (
                <Avatar className="h-10 w-10 border-2 border-cascala-gray-200">
                    <AvatarImage src="/placeholder-user.png" alt="User" />
                    <AvatarFallback className="bg-cascala-gray-700 text-white font-medium">U</AvatarFallback>
                </Avatar>
            )}
        </div>
    );
}