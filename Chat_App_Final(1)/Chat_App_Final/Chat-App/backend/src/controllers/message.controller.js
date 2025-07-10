import Message from "../models/message.model.js";
import User from "../models/user.models.js";
import CryptoJS from "crypto-js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "your-secure-key-here";
const IV = process.env.IV || "your-initialization-vector";

export const getMessages = async (req, res) => {
    try {
        const userToChatId = req.params.id;
        const userId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: userId },
            ],
        }).sort({ createdAt: 1 });

        const decryptedMessages = messages.map((msg) => {
            try {
                const decryptedText = CryptoJS.AES.decrypt(
                    msg.text,
                    CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY),
                    { iv: CryptoJS.enc.Utf8.parse(IV) }
                ).toString(CryptoJS.enc.Utf8);
                return { ...msg.toObject(), text: decryptedText };
            } catch (error) {
                console.log("Error decrypting message:", error.message);
                return { ...msg.toObject(), text: "Decryption Failed" };
            }
        });

        res.status(200).json(decryptedMessages);
    } catch (error) {
        console.log("Error in getMessages controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const receiverId = req.params.id; // Use consistent name
        const senderId = req.user._id;
        const { text, image } = req.body;

        // Logging incoming data for debugging
        console.log('sendMessage:', { senderId, receiverId, text, image });

        if (!senderId || !receiverId) {
            console.log("Missing senderId or receiverId:", { senderId, receiverId });
            return res.status(400).json({ message: "Invalid user IDs" });
        }

        if (!text && !image) {
            console.log("No content provided for message");
            return res.status(400).json({ message: "Message text or image is required" });
        }

        let imageUrl = null;
                // If there's an image, upload it to Cloudinary
        if (image) {
            try {
                // Upload the base64 image to Cloudinary
                const result = await cloudinary.uploader.upload(image, {
                    folder: 'chat-app',
                    resource_type: 'auto'
                });
                imageUrl = result.secure_url;
            } catch (uploadError) {
                console.error("Error uploading image to Cloudinary:", uploadError);
                return res.status(500).json({ message: "Failed to upload image" });
            }
        }

        // Encrypt text 
        let encryptedText = text ? CryptoJS.AES.encrypt(
            text,
            CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY),
            { iv: CryptoJS.enc.Utf8.parse(IV) }
        ).toString() : "";

        // Save message to DB
        const message = await Message.create({
            senderId,
            receiverId,
            text: encryptedText,
            image: imageUrl,
        });

        // Emit the message to both sender and receiver if online
        const receiverSocketId = getReceiverSocketId(receiverId);
        const senderSocketId = getReceiverSocketId(senderId);

        const messageToEmit = {
            ...message.toObject(),
            text, // decrypted for frontend
            image: imageUrl,
        };

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", messageToEmit);
            // Log only the ciphertext (encrypted) text
            console.log(`Message emitted to receiverId ${receiverId}:`, {
                ...messageToEmit,
                text: message.text // ciphertext only
            });
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("newMessage", messageToEmit);
            // Log only the ciphertext (encrypted) text
            console.log(`Message emitted to senderId ${senderId}:`, {
                ...messageToEmit,
                text: message.text // ciphertext only
            });
        }

        res.status(200).json({ message: "Message sent successfully" });
    } catch (error) {
        console.log("Error in sendMessage controller:", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const paramId = req.params.id;

        if (paramId) {
            const user = await User.findById(paramId).select("-password");
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json(user);
        }

        const users = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(users);
    } catch (error) {
        console.log("Error in getUsersForSidebar controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};