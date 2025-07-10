import {MessageSquare} from "lucide-react";

const NoChatSelected = () => {
    return (
        <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <div className="text-center px-4">
                {/* Icon with animation */}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-amber-100/10 flex items-center justify-center animate-bounce">
                        <MessageSquare className="w-10 h-10 text-amber-300/90" />
                    </div>
                </div>
                
                {/* Welcome Text */}
                <h2 className="text-2xl md:text-3xl font-bold text-amber-100 mb-2">
                    Welcome to SecureNest Community
                </h2>
                <p className="text-amber-200/80 text-lg">
                    Select a user from the sidebar to start messaging
                </p>
            </div>
        </div>
    );
};

export default NoChatSelected;  