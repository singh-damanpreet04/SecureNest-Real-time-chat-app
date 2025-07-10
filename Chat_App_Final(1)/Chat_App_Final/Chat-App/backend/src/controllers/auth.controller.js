import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { v2 as cloudinary } from "cloudinary";
import cloudinaryConfig from "../lib/cloudinary.js";

// Initialize Cloudinary with config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dvwndmmur",
    api_key: process.env.CLOUDINARY_API_KEY || "941449398598616",
    api_secret: process.env.CLOUDINARY_API_SECRET || "h9VKzji4y8XnfXMh8bVGPSFvPuI"
});

export const signup = async (req, res) => {
    const { fullName, username, email, password } = req.body;

    try {
        // Validate required fields
        if (!fullName || !email || !password || !username) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 12) {
            return res.status(400).json({ error: "Password must be at least 12 characters" });
        }

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ error: "Email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            fullName,
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            password: hashedPassword
        });

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();

            const userResponse = {
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                profilePic: newUser.profilePic,
                createdAt: newUser.createdAt
            };

            console.log('New user created:', userResponse);
            res.status(201).json(userResponse);
        } else {
            res.status(400).json({ error: "Failed to create user" });
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    const { email, username, password } = req.body;
    try {
        const user = await User.findOne({
            $or: [
                { email: email },
                { username: username },
            ],
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        if (isPasswordCorrect) {
            generateToken(user._id, res);
            res.status(200).json({
                _id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                profilePic: user.profilePic,
                createdAt: user.createdAt
            });
        } else {
            res.status(400).json({ error: "Invalid credentials" });
        }
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged Out Successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ error: "Profile picture is required" });
        }

        console.log('Starting profile picture upload...');

        // Upload base64 image to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
                profilePic,
                {
                    folder: 'profile-pics',
                    resource_type: 'auto',
                    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp']
                },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        return reject(error);
                    }
                    resolve(result);
                }
            );
        });

        console.log('Cloudinary upload successful:', uploadResult.secure_url);

        // Update user with the new profile picture URL
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                profilePic: uploadResult.secure_url,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        ).select('-password -__v');

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        console.log('User profile updated successfully');

        // Return the updated user data in the expected format
        const userResponse = {
            _id: updatedUser._id,
            fullName: updatedUser.fullName,
            username: updatedUser.username,
            email: updatedUser.email,
            profilePic: updatedUser.profilePic,
            createdAt: updatedUser.createdAt
        };

        res.status(200).json({
            user: userResponse,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        console.error("Error in updateProfile controller:", error);
        res.status(500).json({
            message: "Error updating profile",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        });
    }
};

export const checkAuth = async (req, res) => {
    try {
        // Fetch the latest user data from the database
        const user = await User.findById(req.user._id).select('-password -__v');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            profilePic: user.profilePic,
            createdAt: user.createdAt
        });
    } catch (error) {
        console.error("Error in checkAuth controller:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        });
    }
};