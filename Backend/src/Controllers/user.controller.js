import User from "../Models/user.model.js";
import asyncHandler from "../Utils/asyncHandler.util.js";
import {
  ApiError,
  NotFoundError,
  ValidationError,
} from "../Utils/ApiError.util.js";
import ApiResponse from "../Utils/ApiResponse.util.js";
import jwt from "jsonwebtoken";
import { hash, compare } from "bcrypt";
import { uploadOnCloudinary } from "../Utils/cloudinary.util.js"; // Importing the upload function

export const generateAccessAndRefreshToken = async (userId) => {
  try {
    const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(
      { id: userId },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating tokens:", error.message);
    throw new ApiError(500, "Failed to generate tokens");
  }
};

// export default generateAccessAndRefreshToken;
// Register a new user
export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    throw new ApiError(400, "Username and password are required");
  }
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new ApiError(400, "Username already exists");
  }
  const hashedPassword = await hash(password, 10);
  // const hashedMpin = mpin ? await hash(mpin, 10) : null;

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    // mpin: hashedMpin,
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
  console.log("User fetched from database:", user); // Log user data
  if (!user) {
    console.error("No user found with username");
    throw new ApiError(401, "Invalid credentials");
  }

  const isPasswordMatch = await compare(password, user.password);
  if (!isPasswordMatch) {
    console.error("Password mismatch");
    throw new ApiError(401, "Invalid credentials");
  }

  console.log("Generating tokens for user ID:", user._id);
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .status(200)
    .json(new ApiResponse(200, "User logged in successfully", loggedInUser));
});

// User logout
export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken").clearCookie("accessToken");
  res.status(200).json(new ApiResponse(200, "User logged out successfully"));
});

// Validate MPIN
export const validateMpin = asyncHandler(async (req, res) => {
  const { username, mpin } = req.body;
  const user = await User.findOne({ username });

  if (!user || !compare(mpin, user.mpin)) {
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
