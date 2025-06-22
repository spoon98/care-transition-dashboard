// src/components/chat/MessageList.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Message } from '@/types/chat';
import ChatMessage from './ChatMessage';
import { Button } from '@/components/ui/button';

interface MessageListProps {
    messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showNewMessageButton, setShowNewMessageButton] = useState(false);
    const [isUserScrolling, setIsUserScrolling] = useState(false);
    const previousMessageCount = useRef(messages.length);

    // Scroll to bottom function
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            setShowNewMessageButton(false);
        }
    };

    // Check if user is near bottom
    const isNearBottom = () => {
        if (!scrollContainerRef.current) return true;
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        return scrollHeight - scrollTop - clientHeight < 100;
    };

    // Handle scroll event
    const handleScroll = () => {
        if (!scrollContainerRef.current) return;

        // Check if user is near bottom
        if (isNearBottom()) {
            setIsUserScrolling(false);
            setShowNewMessageButton(false);
        } else {
            setIsUserScrolling(true);
        }
    };

    // Auto-scroll on new messages
    useEffect(() => {
        // Check if new messages were added
        if (messages.length > previousMessageCount.current) {
            if (!isUserScrolling || isNearBottom()) {
                // Auto-scroll if user is at bottom or not scrolling
                setTimeout(scrollToBottom, 100);
            } else {
                // Show new message button if user has scrolled up
                setShowNewMessageButton(true);
            }
        }
        previousMessageCount.current = messages.length;
    }, [messages.length, isUserScrolling]);

    // Initial scroll to bottom
    useEffect(() => {
        scrollToBottom();
    }, []);

    return (
        <div className="relative h-full flex-grow overflow-hidden">
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="h-full overflow-y-auto py-4 px-6 scroll-smooth"
            >
                {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} />
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* New Messages Button */}
            {showNewMessageButton && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Button
                        onClick={scrollToBottom}
                        className="bg-cascala-purple hover:bg-cascala-purple/90 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border-2 border-white"
                        size="sm"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                        </svg>
                        New messages
                    </Button>
                </div>
            )}
        </div>
    );
}