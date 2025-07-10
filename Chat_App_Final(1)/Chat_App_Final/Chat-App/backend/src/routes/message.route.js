import express from "express";
import { getMessages, sendMessage, getUsersForSidebar } from "../controllers/message.controller.js";
import {protectRoute} from "../middleware/auth.middleware.js";

const router = express.Router();

// Get all users for sidebar
export const getUsers = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const users = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(users);
    } catch (error) {
        console.log("Error in getUsers controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get all users for sidebar
router.get("/users", protectRoute, getUsersForSidebar);
// Get messages for a specific user
router.get("/:id", protectRoute, getMessages);
// Send a message
router.post("/send/:id", protectRoute, sendMessage);

export default router;