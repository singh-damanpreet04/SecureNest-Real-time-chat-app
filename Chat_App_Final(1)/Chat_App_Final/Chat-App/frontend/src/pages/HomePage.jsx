import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import Sidebar from "../components/Sidebar.jsx";
import NoChatSelected from "../components/NoChatSelected.jsx";
import ChatContainer from "../components/ChatContainer.jsx";
import Navbar from "../components/Navbar.jsx";

const HomePage = () => {
    const { selectedUser } = useChatStore();
    
    return (
        <div className="fixed inset-0 min-h-screen min-w-screen w-screen h-screen flex flex-col bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 overflow-hidden p-0 m-0">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-blue-950/90 to-blue-900/20" />
            
            {/* Animated grid pattern */}
            <div className="absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
            </div>
            
            {/* Glowing orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/3 -left-1/4 w-[800px] h-[800px] bg-blue-500/30 rounded-full filter blur-[100px] opacity-30 animate-pulse" />
                <div className="absolute -bottom-1/4 -right-1/4 w-[1000px] h-[1000px] bg-indigo-500/20 rounded-full filter blur-[120px] opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
            </div>
            
            {/* Navbar with glass effect */}
            <div className="h-16 w-full flex-shrink-0 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 backdrop-blur-xl border-b border-white/10 z-10 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5" />
                <Navbar />
            </div>
            
            {/* Main content area */}
            <div className="flex flex-1 min-h-0 relative">
                {/* Enhanced Sidebar with glass effect */}
                <div className="w-20 lg:w-80 bg-gradient-to-b from-[#0f172a]/90 to-[#0a0f1a]/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-blue-500/10 flex-shrink-0 overflow-hidden flex flex-col transform transition-all duration-500 hover:shadow-blue-500/20 relative group h-full">
                    {/* Animated border glow */}
                    <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-blue-400/30 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="w-full h-full rounded-2xl bg-[#0a0f1a]" />
                    </div>
                    
                    {/* Inner glow */}
                    <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_30px_rgba(99,102,241,0.1)] pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col h-full">
                        {/* Sidebar content with custom scrollbar */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 relative">
                            {/* Animated background pattern */}
                            <div className="absolute inset-0 opacity-5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]">
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:20px_20px]" />
                            </div>
                            <div className="relative z-10">
                                <Sidebar />
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Vertical glowing border between sidebar and chat */}
                <div className="hidden lg:block w-[3px] h-full bg-gradient-to-b from-blue-400/80 via-indigo-400/60 to-transparent blur-[2px] shadow-lg mx-0" />
                {/* Chat area with glass effect */}
                <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a]/70 backdrop-blur-md rounded-2xl border border-white/5 shadow-xl overflow-hidden h-full">
                    {!selectedUser ? (
                        <NoChatSelected />
                    ) : (
                        <ChatContainer />
                    )}
                </div>
            </div>
            
            {/* Custom scrollbar */}
            <style jsx global>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-3px); }
                }
                
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                
                .float-animation {
                    animation: float 6s ease-in-out infinite;
                }
                
                .gradient-text {
                    background: linear-gradient(90deg, #60a5fa, #818cf8, #a78bfa, #818cf8, #60a5fa);
                    background-size: 300% 300%;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: gradient 8s ease infinite;
                }
                
                /* Custom scrollbar */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 3px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    transition: all 0.3s ease;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.15);
                }
                
                /* Smooth transitions */
                * {
                    transition: background-color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;
                }
                
                /* Glossy button effect */
                .glossy-btn {
                    position: relative;
                    overflow: hidden;
                }
                .glossy-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 50%;
                    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.2), transparent);
                    border-radius: inherit;
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
};

export default HomePage;    