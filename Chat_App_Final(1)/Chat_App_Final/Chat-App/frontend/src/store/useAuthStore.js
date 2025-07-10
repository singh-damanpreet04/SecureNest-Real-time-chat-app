import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5003";
export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigninUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,
    
    checkAuth: async() => {
        try {
            const response = await axiosInstance.get("/auth/check");
            set({ authUser: response.data });
            // Connect socket after state update
            setTimeout(() => get().connectSocket(), 0);
        } catch (error) {
            // Don't log 401 errors as they're expected when not authenticated
            if (error.response?.status !== 401) {
                console.error("Error in checkAuth", error);
            }
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    
    login: async (credentials) => {
        try {
            set({ isLoggingIn: true });
            const response = await axiosInstance.post("/auth/login", credentials);
            let userData = response.data.user || response.data; // Handle different response formats
            
            // Ensure createdAt exists, if not add current timestamp
            if (!userData.createdAt) {
                userData = { ...userData, createdAt: new Date().toISOString() };
            }
            
            set({ authUser: userData });
            // Connect socket after state update
            setTimeout(() => get().connectSocket(), 0);
            
            toast.success("Login successful");
            return { user: userData };
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            set({ isLoggingIn: false });
        }
    },
    
    signup: async (data) => {
        try {
            console.log('Starting signup with data:', { ...data, password: '***' });
            set({ isSigninUp: true });
            const response = await axiosInstance.post("/auth/signup", data);
            console.log('Signup successful, response:', response.data);
            
            // Set the authUser with the created user data including createdAt
            if (response.data.user) {
                const userData = response.data.user;
                // Only set createdAt if it doesn't exist in the response
                if (!userData.createdAt) {
                    userData.createdAt = new Date().toISOString();
                }
                set({ authUser: userData });
                get().connectSocket();
            }
            
            return { 
                success: true, 
                data: response.data,
                message: 'Signup successful!'
            };
        } catch (error) {
            console.error('Signup error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            
            // Throw a more descriptive error
            const errorMessage = error.response?.data?.message || 'Failed to create account';
            throw new Error(errorMessage);
        } finally {
            set({ isSigninUp: false });
        }
    },
    
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            // Disconnect socket before clearing authUser
            get().disconnectSocket();
            set({ authUser: null });
            return { success: true, message: 'Logged out successfully' }
        } catch (error) {
            console.error('Logout error:', error);
            // Even if there's an error, we still want to clear the user
            set({ authUser: null });
            throw error;
        }
    },
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const response = await axiosInstance.put("/auth/update-profile", data);
            const updatedUser = response.data.user;
            
            // Update the authUser in the store
            set((state) => ({
                authUser: {
                    ...state.authUser,
                    ...updatedUser
                }
            }));
            
            toast.success(response.data.message || "Profile updated successfully!");
            return { success: true, user: updatedUser };
        } catch (error) {
            console.error('Update profile error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to update profile';
            toast.error(errorMessage);
            throw error;
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser) return;
        
        // Disconnect existing socket if any
        const currentSocket = get().socket;
        if (currentSocket) {
            console.log('Disconnecting existing socket...');
            currentSocket.disconnect();
        }
        
        console.log('Connecting socket for user:', authUser._id);
        const socket = io(BASE_URL, {
            withCredentials: true,
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000,
            transports: ['websocket'],
            upgrade: false
        });
        
        // Connection established
        socket.on("connect", () => {
            console.log("Socket connected, adding user:", authUser._id);
            socket.emit("addUser", authUser._id);
        });
        
        // Handle online users list
        socket.on("getOnlineUsers", (users) => {
            console.log('Online users updated:', users);
            set({ onlineUsers: users });
        });
        
        // Handle disconnection
        socket.on("disconnect", (reason) => {
            console.log("Socket disconnected, reason:", reason);
            if (reason === 'io server disconnect') {
                // Reconnect if server disconnects us
                console.log('Server disconnected, attempting to reconnect...');
                socket.connect();
            }
        });
        
        // Handle connection errors
        socket.on("connect_error", (error) => {
            console.error("Socket connection error:", error.message);
            // Try to reconnect after delay
            setTimeout(() => {
                console.log('Attempting to reconnect socket...');
                socket.connect();
            }, 5000);
        });
        
        // Handle successful reconnection
        socket.io.on("reconnect", (attempt) => {
            console.log(`Socket reconnected after ${attempt} attempts`);
            if (authUser?._id) {
                console.log('Re-adding user after reconnection:', authUser._id);
                socket.emit("addUser", authUser._id);
            }
        });
        
        socket.io.on("reconnect_attempt", () => {
            console.log('Attempting to reconnect socket...');
        });
        
        set({ socket });
        return socket;
    },
    disconnectSocket: () => {
        const { socket, authUser } = get();
        if (socket) {
            console.log('Disconnecting socket...');
            // Notify server about manual disconnection
            if (authUser?._id) {
                console.log('Emitting disconnectUser for user:', authUser._id);
                socket.emit('disconnectUser', authUser._id);
            }
            // Clean up all event listeners
            socket.off('connect');
            socket.off('disconnect');
            socket.off('connect_error');
            socket.off('getOnlineUsers');
            // Disconnect the socket
            socket.disconnect();
            // Clear socket and online users
            set({ socket: null, onlineUsers: [] });
        }
    }
}));
