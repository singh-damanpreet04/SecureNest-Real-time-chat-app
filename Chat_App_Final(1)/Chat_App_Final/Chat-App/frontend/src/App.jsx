import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import AIChatPage from "./pages/AIChatPage.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { useAuthStore } from "./store/useAuthStore.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
    const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();

    console.log('Online users:', onlineUsers);

    useEffect(() => {
        console.log('App mounted, checking auth...');
        checkAuth().then(() => {
            console.log('Auth check completed');
        }).catch(error => {
            console.error('Error in checkAuth:', error);
        });
    }, [checkAuth]);

    console.log('Rendering App:', { 
        authUser, 
        isCheckingAuth,
        hasAuthChecked: !isCheckingAuth,
        shouldShowLogin: !isCheckingAuth && !authUser
    });

    if (isCheckingAuth) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className="size-10 animate-spin"/>
            </div>
        );
    }


    return (
        <div className="min-h-screen w-full">
            <ToastContainer 
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <Navbar/>
            <main className="container mx-auto p-4">
                <Routes>
                    <Route path="/" element={authUser ? <HomePage/> : <Navigate to="/login"/>}/>
                    <Route path="/signup" element={!authUser ? <SignUpPage/> : <Navigate to="/"/>}/>
                    <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to="/"/>}/>
                    <Route path="/profile/:username" element={authUser ? <ProfilePage/> : <Navigate to="/login"/>}/>
                    <Route path="/profile" element={authUser ? <Navigate to={`/profile/${authUser.username || 'user'}`} replace/> : <Navigate to="/login"/>}/>
                    <Route path="/ai-chat" element={authUser ? <AIChatPage/> : <Navigate to="/login"/>}/>
                </Routes>
            </main>
        </div>
    );
};

export default App;