import { useChatStore } from "../store/useChatStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import { X } from "lucide-react";

const ChatHeader = () => {
    const {selectedUser,setSelectedUser} = useChatStore();
    const {onlineUsers} = useAuthStore();
    return (
        <div className="h-full flex items-center w-full animate-fade-in-header">
           <div className="flex items-center justify-between w-full glass-header shadow-xl rounded-t-xl px-6 py-2 relative">
            <div className="flex items-center gap-4">
                {/* Glowing Avatar Accent */}
                <div className="relative">
                    <span className="absolute -inset-1 rounded-full bg-gradient-to-br from-blue-500/40 via-indigo-400/30 to-purple-500/30 blur-[8px] opacity-80 animate-avatar-glow z-0" />
                    {selectedUser.profilePic || selectedUser.avatar ? (
                        <>
                            <span className="inline-block rounded-full p-[2.5px] bg-gradient-to-tr from-blue-400 via-indigo-400 to-purple-400 shadow-avatar-border">
                                <img 
                                    src={selectedUser.profilePic || selectedUser.avatar} 
                                    alt={selectedUser.username}
                                    className="w-12 h-12 rounded-full object-cover relative z-10 bg-[#181f2e]"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextElementSibling.style.display = 'flex';
                                    }}
                                />
                            </span>
                            <span className="inline-block rounded-full p-[2.5px] bg-gradient-to-tr from-blue-400 via-indigo-400 to-purple-400 shadow-avatar-border">
                                <div className="hidden w-12 h-12 rounded-full bg-indigo-600 items-center justify-center text-white font-medium relative z-10">
                                    {selectedUser.fullName 
                                        ? selectedUser.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
                                        : (selectedUser.username || 'U').charAt(0).toUpperCase()
                                    }
                                </div>
                            </span>
                        </>
                    ) : (
                        <span className="inline-block rounded-full p-[2.5px] bg-gradient-to-tr from-blue-400 via-indigo-400 to-purple-400 shadow-avatar-border">
                            <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium relative z-10">
                                {selectedUser.fullName 
                                    ? selectedUser.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
                                    : (selectedUser.username || 'U').charAt(0).toUpperCase()
                                }
                            </div>
                        </span>
                    )}
                </div>

                {/*User Info */}
                <div className="pl-1">
                    <h3 className="font-semibold text-lg gradient-text-header drop-shadow-glow animate-gradient-move">
                        {selectedUser.fullName}
                    </h3>
                    <p className="text-xs font-medium text-blue-300 drop-shadow-glow animate-status-glow">
                        {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
                    </p>
                </div>
            </div>
            {/*Close Button with Glow */}
            <button onClick={() => setSelectedUser(null)} className="ml-2 p-2 rounded-full bg-transparent hover:bg-blue-900/30 transition-all duration-200 shadow-glow-btn">
                <X className="w-5 h-5 text-blue-200 hover:text-blue-400 transition-all drop-shadow-glow"/>
            </button>
           </div>

            {/* Custom Styles for Header Effects */}
            <style jsx>{`
            .shadow-avatar-border {
                box-shadow: 0 0 12px 2px #60a5fa66, 0 0 8px #a78bfa99;
            }
            .glass-header {
                background: rgba(18, 25, 40, 0.82);
                backdrop-filter: blur(18px) saturate(1.25);
                box-shadow: 0 4px 32px 0 #60a5fa33, 0 2px 12px 0 #818cf888;
                border: 1.5px solid rgba(99,102,241,0.10);
                border-radius: 1.25rem;
            }
            .gradient-text-header {
                background: linear-gradient(90deg, #60a5fa, #818cf8, #a78bfa, #818cf8, #60a5fa);
                background-size: 300% 300%;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                animation: gradientMoveHeader 6s ease-in-out infinite;
            }
            @keyframes gradientMoveHeader {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            .drop-shadow-glow {
                filter: drop-shadow(0 0 6px #60a5fa88) drop-shadow(0 0 2px #a78bfa88);
            }
            .shadow-glow-btn {
                box-shadow: 0 0 12px 2px #60a5fa44, 0 0 8px #818cf888;
            }
            .shadow-glow-btn:hover {
                box-shadow: 0 0 24px 4px #60a5fa99, 0 0 16px #a78bfa99;
            }
            .animate-avatar-glow {
                animation: avatarGlow 3.5s ease-in-out infinite alternate;
            }
            @keyframes avatarGlow {
                0% { opacity: 0.5; filter: blur(8px); }
                100% { opacity: 0.9; filter: blur(16px); }
            }
            .animate-fade-in-header {
                animation: fadeInHeader 1.1s cubic-bezier(.39,.575,.565,1.000) both;
            }
            @keyframes fadeInHeader {
                0% { opacity: 0; transform: translateY(-18px); }
                100% { opacity: 1; transform: translateY(0); }
            }
            .animate-gradient-move {
                animation: gradientMoveHeader 6s ease-in-out infinite;
            }
            .animate-status-glow {
                animation: statusGlow 2.5s ease-in-out infinite alternate;
            }
            @keyframes statusGlow {
                0% { text-shadow: 0 0 4px #60a5fa66; }
                100% { text-shadow: 0 0 12px #a78bfa88; }
            }
            `}</style>
        </div>
    )
}

export default ChatHeader;