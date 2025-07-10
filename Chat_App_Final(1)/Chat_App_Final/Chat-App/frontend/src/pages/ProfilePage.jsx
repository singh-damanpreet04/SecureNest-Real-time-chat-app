import { useAuthStore } from "../store/useAuthStore";
import { Camera, LogOut, Mail, User as UserIcon, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProfilePage = () => {
    const { authUser, isUpdatingProfile, updateProfile, logout } = useAuthStore();
    const navigate = useNavigate();
    
    // Debug: Log authUser to check its structure
    console.log('authUser:', authUser);
    
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB");
            return;
        }
        
        // Check file type
        if (!file.type.match('image.*')) {
            toast.error("Please select a valid image file");
            return;
        }
        
        const reader = new FileReader();
        reader.readAsDataURL(file);
        
        reader.onloadend = async () => {
            const base64Image = reader.result;
            try {
                await updateProfile({ profilePic: base64Image });
                toast.success("Profile picture updated successfully!");
                // Refresh the page to show the updated profile
                window.location.reload();
            } catch (error) {
                console.error("Error updating profile:", error);
                toast.error(error.response?.data?.error || "Failed to update profile picture");
            }
        };
        
        reader.onerror = () => {
            console.error("Error reading file");
            toast.error("Error reading image file");
        };
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Failed to logout");
        }
    };

    return (
        <div className="fixed inset-0 bg-[#1E1E2D] flex flex-col overflow-hidden">
  {/* Decorative blur circles like LoginPage */}
  <div className='absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-purple-500/10 blur-3xl z-0'></div>
  <div className='absolute bottom-1/4 left-1/4 w-40 h-40 rounded-full bg-blue-500/10 blur-3xl z-0'></div>
  <div className="relative flex-1 pt-24 pb-10 px-4 z-10 overflow-y-auto">

            <div className="max-w-md mx-auto bg-[#181d23]/90 rounded-2xl shadow-2xl overflow-hidden profile-glass-glow-login">
                {/* Header with profile picture */}
                <div className="relative bg-[#232c43]/80 px-6 pt-8 pb-8 text-center">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#232c43]/70 to-[#10131a]/80"></div>
                    
                    <div className="relative z-10 mb-8">
                        <h1 className="text-3xl font-bold text-white">Profile</h1>
                        <p className="text-blue-300 text-sm mt-2">Your account information</p>
                    </div>
                    
                    {/* Profile Picture */}
                    <div className="relative z-20 -mb-16">
                        {authUser?.profilePic ? (
                            <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-blue-400 shadow-blue-500/40 shadow-xl mx-auto profile-pic-glow">
                                <img 
                                    src={authUser.profilePic} 
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        // If image fails to load, show initials
                                        e.target.style.display = 'none';
                                        e.target.parentNode.innerHTML = `
                                            <div class="w-full h-full bg-indigo-600 flex items-center justify-center text-white text-5xl font-bold">
                                                ${authUser?.fullName 
                                                    ? authUser.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
                                                    : (authUser?.username || 'U').charAt(0).toUpperCase()
                                                }
                                            </div>
                                        `;
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="w-36 h-36 rounded-full bg-blue-600 flex items-center justify-center text-white text-5xl font-bold shadow-2xl mx-auto">
                                {authUser?.fullName 
                                    ? authUser.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
                                    : (authUser?.username || 'U').charAt(0).toUpperCase()
                                }
                            </div>
                        )}
                        <label
                            htmlFor="avatar-upload"
                            className={`absolute -bottom-2 right-1/2 translate-x-1/2 translate-y-0 bg-white hover:bg-gray-100 text-blue-600 p-2.5 rounded-full cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 border-2 border-blue-600 ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`}
                            title="Change profile picture"
                        >
                            <Camera className="size-5" />
                            <input
                                type="file"
                                id="avatar-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={isUpdatingProfile}
                            />
                        </label>
                    </div>
                </div>
                
                {/* Main Content */}
                <div className="p-6 pt-20">
                    {/* Username Section */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white">
                            {authUser?.username || 'User'}
                        </h2>
                        <p className="text-sm text-blue-300 mt-2">
                            {isUpdatingProfile ? "Updating..." : "Click camera icon to change photo"}
                        </p>
                    </div>
                    
                    {/* User Info Cards */}
                    <div className="space-y-5">
                        <div className="bg-gray-700 p-5 rounded-xl border border-gray-600 hover:border-purple-500 transition-all duration-300 hover:shadow-lg">
                            <div className="flex items-start">
                                <div className="p-2.5 bg-purple-500/20 rounded-xl mr-4 text-purple-400">
                                    <UserIcon className="size-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-blue-300 mb-1">Full Name</p>
                                    <p className="text-white">{authUser?.fullName || 'Not set'}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gray-700 p-5 rounded-xl border border-gray-600 hover:border-purple-500 transition-all duration-300 hover:shadow-lg">
                            <div className="flex items-start">
                                <div className="p-2.5 bg-purple-500/20 rounded-xl mr-4 text-purple-400">
                                    <Mail className="size-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-blue-300 mb-1">Email Address</p>
                                    <p className="text-white break-all">{authUser?.email || 'Not set'}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gray-700 p-5 rounded-xl border border-gray-600 hover:border-purple-500 transition-all duration-300 hover:shadow-lg">
                            <div className="flex items-start">
                                <div className="p-2.5 bg-purple-500/20 rounded-xl mr-4 text-purple-400">
                                    <UserCircle className="size-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-blue-300 mb-1">Username</p>
                                    <p className="text-white profile-username-glow">@{authUser?.username || 'user'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 bg-[#1E1E2D] rounded-xl p-6 border border-[#2D2D3A]">
                        <h2 className="text-lg font-medium mb-4">Account Information</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between py-2 border-b border-[#2D2D3A] text-white">
                                <span className="text-gray-400">Member Since</span>
                                <span>{authUser?.createdAt ? new Date(authUser.createdAt).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-gray-400">Account Status</span>
                                <span className="text-green-400">Active</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Logout Button */}
                    <div className="mt-8">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors font-medium border border-red-400/20 hover:border-red-400/40"
                        >
                            <LogOut className="size-5" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
};

export default ProfilePage;