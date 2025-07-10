import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    console.log('Fetching users...');
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      console.log('Users response:', res.data);
      set({ users: res.data });
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error(error.response?.data?.message || 'Failed to load users');
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      // Do NOT update state here! Wait for socket event (newMessage) to update chat state.
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) {
      console.log('No selected user for message subscription');
      return;
    }

    const socket = useAuthStore.getState().socket;
    if (!socket) {
      console.error('No socket available for message subscription');
      return;
    }

    console.log('Subscribing to messages for user:', selectedUser._id);

    const handleNewMessage = (newMessage) => {
      console.log('New message received:', newMessage);
      
      // Make sure the message is for the currently selected user
      const isMessageForSelectedUser = 
        newMessage.senderId === selectedUser._id || 
        newMessage.receiverId === selectedUser._id;
      
      if (!isMessageForSelectedUser) {
        console.log('Message not for current chat, ignoring');
        return;
      }

      // Ensure createdAt is always a string for frontend rendering
      if (newMessage.createdAt instanceof Date) {
        newMessage.createdAt = newMessage.createdAt.toISOString();
      } else if (typeof newMessage.createdAt !== 'string') {
        newMessage.createdAt = String(newMessage.createdAt);
      }
      set(state => {
        // Check if message already exists to prevent duplicates
        const messageExists = state.messages.some(msg => msg._id === newMessage._id);
        if (messageExists) {
          console.log('Message already exists, skipping');
          return state;
        }
        
        console.log('Adding new message to state');
        return {
          messages: [...state.messages, newMessage],
        };
      });
    };

    // Add error handler for socket
    const handleError = (error) => {
      console.error('Socket error in message subscription:', error);
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("error", handleError);
    
    console.log('Successfully subscribed to messages');
    
    // Return cleanup function
    return () => {
      console.log('Cleaning up message subscription');
      if (socket) {
        socket.off("newMessage", handleNewMessage);
        socket.off("error", handleError);
      }
    };
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));