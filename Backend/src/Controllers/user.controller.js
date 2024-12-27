import User from "../Models/user.model.js";
import asyncHandler from "../Utils/asyncHandler.util.js";
import ApiError from "../Utils/ApiError.util.js";
import ApiResponse from "../Utils/ApiResponse.util.js";
import jsonwebtoken from "jsonwebtoken";
import { hash, compare } from "bcrypt";
import { uploadOnCloudinary } from "../Utils/cloudinary.util.js"; // Importing the upload function

// Register a new user
export const registerUser = asyncHandler(async (req, res) => {
  const { username, password, mpin } = req.body;
  if (!username || !password) {
    throw new ApiError(400, "Username and password are required");
  }
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new ApiError(400, "Username already exists");
  }
  const hashedPassword = await hash(password, 10);
  const hashedMpin = mpin ? await hash(mpin, 10) : null;

  const newUser = new User({
    username,
    password: hashedPassword,
    mpin: hashedMpin,
  });
  const profilePicLocalPath = req.files?.profilepic?.[0]?.path || null;
  let profileUrl = null;
  if (profilePicLocalPath) {
    try {
      profileUrl = await uploadOnCloudinary(profilePicLocalPath);
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      throw new ApiError(500, "Failed to upload profile picture.");
    }
  }

  await newUser.save();
  ApiResponse.created(res, "User registered successfully");
});

// User login
export const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || !(await compare(password, user.password))) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = jsonwebtoken.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  ApiResponse.success(res, "Login successful", { token });
});

// User logout
export const logoutUser = asyncHandler(async (req, res) => {
  // Clear token (front-end should handle actual token deletion)
  ApiResponse.success(res, "Logout successful");
});

// Validate MPIN
export const validateMpin = asyncHandler(async (req, res) => {
  const { username, mpin } = req.body;
  const user = await User.findOne({ username });

  if (!user || !(await compare(mpin, user.mpin))) {
    throw new ApiError(401, "Invalid MPIN");
  }

  ApiResponse.success(res, "M-PIN validated successfully");
});

// Get user profile
export const getUserProfile = asyncHandler(async (req, res) => {
  const { userId } = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  ApiResponse.success(res, "User profile fetched successfully", { user });
});

// Update user profile
export const updateUserProfile = asyncHandler(async (req, res) => {
  const { userId } = req.user._id;
  const updates = req.body;

  const updatedUser = await User.findByIdAndUpdate(userId, updates, {
    new: true,
  });

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  ApiResponse.success(res, "Profile updated", { user: updatedUser });
});

// Delete user account
export const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.user._id;
  const deletedUser = await User.findByIdAndDelete(userId);

  if (!deletedUser) {
    throw new ApiError(404, "User not found");
  }

  ApiResponse.success(res, "User account deleted successfully");
});
