import { Loader2, User, Mail, Lock, Eye, EyeOff, MessageCircle, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

// Animated Wave Component
const AnimatedWave = () => (
  <svg width="140" height="24" viewBox="0 0 140 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display:'block'}}>
    <motion.path
      d="M6 12C18 4 30 20 42 12C54 4 66 20 78 12C90 4 102 20 114 12C126 4 138 20 138 12"
      stroke="url(#waveGradient)"
      strokeWidth="5"
      strokeLinecap="round"
      initial={{ pathLength: 0.7 }}
      animate={{ pathLength: [0.7, 1, 0.7] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      filter="url(#glow)"
    />
    <defs>
      <linearGradient id="waveGradient" x1="0" y1="0" x2="140" y2="0" gradientUnits="userSpaceOnUse">
        <stop stopColor="#7fffd4" />
        <stop offset="0.5" stopColor="#009efd" />
        <stop offset="1" stopColor="#a78bfa" />
      </linearGradient>
      <filter id="glow" x="-10" y="-10" width="160" height="44" filterUnits="userSpaceOnUse">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
  </svg>
);

// Animated Dot Component
const AnimatedDot = ({ active, delay = 0 }) => {
  return (
    <motion.div
      className={`w-2.5 h-2.5 rounded-full ${active ? 'bg-blue-400' : 'bg-gray-600'}`}
      animate={{
        y: [0, -8, 0],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        delay: delay,
        ease: 'easeInOut',
      }}
    />
  );
};

const SignUpPage = () => {
    const navigate = useNavigate();
    const { signup, isLoading } = useAuthStore();
    
    // State for form data and UI
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        password: ""
    });

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            const userData = {
                fullName: formData.fullName.trim(),
                username: formData.username.trim().toLowerCase(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password
            };
            
            const result = await signup(userData);
            
            if (result?.success) {
                toast.success('Account created successfully!');
                navigate('/login');
            } else {
                toast.error(result?.message || 'Failed to create account');
            }
        } catch (error) {
            console.error('Signup error:', error);
            const errorMessage = error.response?.data?.message || 
                               (error.code === 'ERR_NETWORK' 
                                ? 'Unable to connect to the server. Please check your connection.' 
                                : 'Failed to create account');
            toast.error(errorMessage);
        }
    };

    // Form validation
    const validateForm = () => {
        const { fullName, username, email, password } = formData;
        
        if (!fullName || !username || !email || !password) {
            toast.error('All fields are required');
            return false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address');
            return false;
        }
        
        // Detailed password validation
        const passwordErrors = validatePassword(password);
        if (passwordErrors.length > 0) {
            passwordErrors.forEach(error => toast.error(error));
            return false;
        }
        
        return true;
    };

    // Password validation rules
    const validatePassword = (password) => {
        const errors = [];
        
        if (password.length < 12) {
            errors.push("Password must be at least 12 characters long");
        }
        if (!/(?=.*[a-z])/.test(password)) {
            errors.push("Password must contain at least one lowercase letter");
        }
        if (!/(?=.*[A-Z])/.test(password)) {
            errors.push("Password must contain at least one uppercase letter");
        }
        if (!/(?=.*\d)/.test(password)) {
            errors.push("Password must contain at least one number");
        }
        if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?])/.test(password)) {
            errors.push("Password must contain at least one special character");
        }
        
        return errors;
    };

    return (
        <div className="fixed inset-0 bg-[#1E1E2D] flex flex-col overflow-hidden">
            {/* Navbar */}
            <nav className="w-full bg-[#1A1A27] py-4 px-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-purple-600 rounded-md flex items-center justify-center">
                            <MessageCircle className="h-8 w-8 text-purple-400" />
                        </div>
                        <span className="text-white font-bold text-xl">SecureNest</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#" className="text-gray-300 hover:text-white">Home</a>
                        <a href="#" className="text-gray-300 hover:text-white">Chat</a>
                        <a href="#" className="text-gray-300 hover:text-white">Settings</a>
                    </div>
                </div>
            </nav>

            {/* Main content */}
            <main className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-64px)]">
                {/* Left - Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-bl from-[#23243a] via-[#393a6d] to-[#2a2954] p-2 overflow-hidden">
                  <div className="glass-card glass-card-glow shadow-xl flex flex-col items-center w-full max-w-md mx-auto py-2 px-3 animate-fadein-glass">
                    <h1 className="text-2xl md:text-3xl font-bold mb-1 glass-heading text-center">Create Your Account</h1>
                    <p className="glass-subheading text-sm text-center mb-4">Get started with your account</p>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute inset-y-0 left-0 ml-3 mt-3 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="fullName"
                                        placeholder="Your full name"
                                        className="w-full bg-[#1E1E2D] border border-[#2D2D3A] rounded-lg py-3 pl-10 pr-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Username */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                                <div className="relative">
                                    <User className="absolute inset-y-0 left-0 ml-3 mt-3 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="Choose a username"
                                        className="w-full bg-[#1E1E2D] border border-[#2D2D3A] rounded-lg py-3 pl-10 pr-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute inset-y-0 left-0 ml-3 mt-3 h-5 w-5 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="your@email.com"
                                        className="w-full bg-[#1E1E2D] border border-[#2D2D3A] rounded-lg py-3 pl-10 pr-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex justify-between mb-1">
                                    <label className="block text-sm font-medium text-gray-300">Password</label>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-xs text-purple-400 hover:text-purple-300"
                                    >
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute inset-y-0 left-0 ml-3 mt-3 h-5 w-5 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="••••••••"
                                        className="w-full bg-[#1E1E2D] border border-[#2D2D3A] rounded-lg py-3 pl-10 pr-10 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Must be at least 12 characters with uppercase, lowercase, number & special character
                                </p>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                        Creating Account...
                                    </>
                                ) : 'Create Account'}
                            </button>

                            <div className="text-center mt-6">
                                <p className="text-sm text-gray-400">
                                    Already have an account?{' '}
                                    <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                                        Sign In
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Side Content */}
                <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-bl from-[#23243a] via-[#393a6d] to-[#2a2954] p-12 relative">
                  <div className="glass-card glass-card-glow shadow-xl flex flex-col items-center justify-center w-full max-w-md mx-auto py-12 px-8 animate-fadein-glass relative overflow-hidden">
                    <div className="relative flex items-center justify-center mb-8" style={{height:'120px', width:'120px'}}>
                      <div className="rounded-full floating-pulse flex items-center justify-center"
                           style={{
                             position:'absolute', top:0, left:0, right:0, bottom:0, margin:'auto', width:'96px', height:'96px',
                             background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 40%, rgba(0,238,255,0.18) 100%)',
                             backdropFilter: 'blur(6px)',
                             boxShadow: '0 0 32px 6px #7fffd4cc, 0 0 48px 16px #a78bfa88',
                           }}>
                        <MessageCircle className="h-12 w-12 text-cyan-200 drop-shadow-glow" />
                      </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-3 glass-heading text-center">Welcome to the Future of Secure Messaging</h2>
                    <p className="glass-subheading text-lg md:text-xl text-center mb-10">Connect with people around the world and start chatting in real-time.</p>
                    <div className="flex justify-center items-center mt-8">
                      <AnimatedWave />
                    </div>
                    <div className="absolute inset-0 pointer-events-none z-0" style={{background: 'radial-gradient(circle at 60% 40%, #a78bfa33 0%, #009efd11 100%)'}}></div>
                  </div>
                  {/* Decorative blur circles */}
                  <div className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-purple-500/10 blur-3xl"></div>
                  <div className="absolute bottom-1/4 left-1/4 w-40 h-40 rounded-full bg-blue-500/10 blur-3xl"></div>
                </div>
            </main>
        </div>
    );
};

export default SignUpPage;
