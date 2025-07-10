import { useChatStore } from "../store/useChatStore.js";
import ChatHeader from "./ChatHeader.jsx";
import MessageInput from "./MessageInput.jsx";
import MessageSkeleton from "./skeletons/MessageSkeleton.jsx";
import { formatMessageTime, formatMessageDate } from "../lib/utils.js";
import { useState, useEffect } from "react";
import { useEffectOnce } from "../hooks/useEffectOnce.js";
import { useAuthStore } from "../store/useAuthStore";

const ChatContainer = () => {
    const { 
        messages, 
        getMessages, 
        isMessagesLoading, 
        selectedUser, 
        subscribeToMessages, 
        unsubscribeFromMessages 
    } = useChatStore();
    
    const [groupedMessages, setGroupedMessages] = useState({});
    
    // Group messages by date
    useEffect(() => {
        if (!messages.length) return;
        
        const grouped = {};
        messages.forEach(message => {
            const date = formatMessageDate(message.createdAt);
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(message);
        });
        setGroupedMessages(grouped);
    }, [messages]);

    useEffect(() => {
        if (!selectedUser?._id) {
            console.log('No selected user ID, skipping message fetch');
            return;
        }
        
        console.log('Fetching messages for user:', selectedUser._id);
        getMessages(selectedUser._id);
        
        // Subscribe to new messages
        console.log('Subscribing to messages...');
        const cleanup = subscribeToMessages();
        
        // Cleanup on unmount or when selectedUser changes
        return () => {
            console.log('Cleaning up message subscription for user:', selectedUser._id);
            if (cleanup && typeof cleanup === 'function') {
                cleanup();
            }
            unsubscribeFromMessages();
        };
    }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

    if(isMessagesLoading) return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />
            <MessageSkeleton/>
            <MessageInput/>
        </div>
    )

    return (
        <div className="flex flex-col h-full">
            {/* Chat header with fixed height */}
            <div className="flex-shrink-0 h-16 border-b border-gray-700 bg-gray-900 z-10">
                <ChatHeader />
            </div>
            
            {/* Messages area - scrollable container */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-6">
                    {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            No messages yet. Start the conversation!
                        </div>
                    ) : (
                        Object.entries(groupedMessages).map(([date, dateMessages]) => (
                            <div key={date} className="space-y-4">
                                <div className="relative flex justify-center">
                                    <div className="px-3 py-1 text-xs text-gray-400 bg-gray-800 rounded-full">
                                        {date}
                                    </div>
                                </div>
                                {dateMessages.map((message, index) => (
                                    <div 
                                        key={message._id || index}
                                        className={`${message.senderId === selectedUser._id ? 'text-left' : 'text-right'}`}
                                    >
                                        <div 
                                            className={`chat-bubble-neo inline-block max-w-xs md:max-w-md px-4 py-2 rounded-2xl relative 
                                                ${message.senderId === selectedUser._id 
                                                    ? 'bubble-own' 
                                                    : 'bubble-other'} 
                                                animate-fade-in-bubble`}
                                        >
                                            {message.image && (
                                                <div className="mb-2 rounded-lg overflow-hidden">
                                                    <img 
                                                        src={message.image} 
                                                        alt="Message content" 
                                                        className="max-w-full h-auto rounded-lg"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = '';
                                                        }}
                                                    />
                                                </div>
                                            )}
                                            {message.text && <div className={message.image ? 'mt-2' : ''}>
                                                {message.text}
                                            </div>}
                                            <div className={`text-xs mt-1 text-right ${message.senderId === selectedUser._id ? 'text-gray-300' : 'text-gray-400'}`}>
                                                {formatMessageTime(message.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))
                    )}
                </div>
            </div>
                    
            {/* Message input at the bottom - compact */}
            <div className="flex-shrink-0 border-t border-gray-700 px-3 py-2 bg-gray-900 z-10">
                <MessageInput />
            </div>
            {/* Custom styles for chat bubbles */}
            <style jsx>{`
            .chat-bubble-neo {
                background: rgba(30, 41, 59, 0.78);
                backdrop-filter: blur(9px) saturate(1.2);
                box-shadow: 0 4px 32px 0 #60a5fa22, 0 2px 12px 0 #818cf822;
                border-radius: 1.2rem;
                border: 1.5px solid rgba(99,102,241,0.10);
                color: #e0e7ef;
                position: relative;
                transition: box-shadow 0.3s, border 0.3s;
                filter: drop-shadow(0 0 6px #60a5fa33);
            }
            .bubble-own {
                background: rgba(37, 99, 235, 0.16);
                border: 2.5px solid;
                border-image: linear-gradient(120deg, #60a5fa 0%, #818cf8 50%, #a78bfa 100%) 1;
                box-shadow: 0 0 16px 2px #60a5fa44, 0 0 8px #818cf8aa;
                animation: bubbleGlow 3.5s ease-in-out infinite alternate;
            }
            .bubble-other {
                background: rgba(17, 24, 39, 0.85);
                border: 1.5px solid rgba(99,102,241,0.10);
                box-shadow: 0 0 12px 2px #818cf822;
            }
            @keyframes bubbleGlow {
                0% { box-shadow: 0 0 12px #60a5fa33; }
                100% { box-shadow: 0 0 24px #a78bfa88; }
            }
            .chat-bubble-neo div, .chat-bubble-neo span, .chat-bubble-neo p {
                text-shadow: 0 1px 6px #000a, 0 0 4px #60a5fa22;
            }
            .animate-fade-in-bubble {
                animation: fadeInBubble 0.85s cubic-bezier(.39,.575,.565,1.000) both;
            }
            @keyframes fadeInBubble {
                0% { opacity: 0; transform: translateY(16px) scale(0.97); }
                100% { opacity: 1; transform: translateY(0) scale(1); }
            }
            `}</style>
        </div>
    )
   
};

export default ChatContainer;