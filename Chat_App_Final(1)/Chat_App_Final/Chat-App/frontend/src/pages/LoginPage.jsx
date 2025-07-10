import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, MessageSquare, Eye, EyeOff, Loader2, MessageCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-toastify";

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
        duration: 0.7,
        repeat: Infinity,
        delay: delay,
        ease: 'easeInOut',
      }}
    />
  );
};

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();
  const navigate = useNavigate();

  const handleInputChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await login(formData);
      if (res?.user) {
        toast.success("Login successful!");
        navigate("/");
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || 
                         (err.code === 'ERR_NETWORK' 
                          ? 'Unable to connect to the server. Please check your connection.' 
                          : 'Login failed. Please try again.');
      toast.error(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1E1E2D] flex flex-col overflow-hidden">
      {/* Navbar */}
      <nav className="w-full bg-[#1A1A27] py-4 px-6 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-md flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-white" />
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
      <main className="flex-1 flex flex-col lg:flex-row overflow-auto">
        {/* Left - Form */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-[#2a2954] via-[#393a6d] to-[#23243a] flex items-center justify-center p-6 sm:p-8 lg:p-12 overflow-auto min-h-[calc(100vh-64px)]">
          <div className="glass-card glass-card-glow shadow-xl">
            <div className="flex flex-col items-center justify-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-2 glass-heading text-center">Welcome Back</h1>
              <p className="glass-subheading text-center text-lg md:text-xl font-medium">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-1" style={{color: '#d1b3ff'}}>Email</label>
                <div className="relative">
                  <Mail className="absolute inset-y-0 left-0 ml-3 mt-3 h-5 w-5 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-[#1E1E2D] border border-[#2D2D3A] rounded-lg py-3 pl-10 pr-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium" style={{color: '#d1b3ff'}}>Password</label>
                  
                </div>
                <div className="relative">
                  <Lock className="absolute inset-y-0 left-0 ml-3 mt-3 h-5 w-5 text-gray-400" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-[#1E1E2D] border border-[#2D2D3A] rounded-lg py-3 pl-10 pr-10 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 mr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium flex items-center justify-center space-x-2 hover:from-blue-600 hover:to-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#151521] glow-btn glow-btn-border"
              >
                {isLoggingIn && <Loader2 className="animate-spin h-5 w-5" />}
                <span className="glow-btn-text text-lg md:text-xl">{isLoggingIn ? "Signing In..." : "Sign In"}</span>
              </button>
            </form>

            <p className="mt-6 text-center text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
                Create account
              </Link>
            </p>
          </div>
        </div>

        {/* Right - Info/Promo */}
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
            {/* Carousel dots */}
            <div className="flex justify-center items-center mt-8">
              <AnimatedWave />
            </div>
            {/* Animated gradient background overlay */}
            <div className="absolute inset-0 pointer-events-none z-0" style={{background: 'radial-gradient(circle at 60% 40%, #a78bfa33 0%, #009efd11 100%)'}}></div>
          </div>
        </div>
        {/* Decorative blur circles */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-purple-500/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-40 h-40 rounded-full bg-blue-500/10 blur-3xl"></div>
      </main>
    </div>
  );
};

export default LoginPage;
