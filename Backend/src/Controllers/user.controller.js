import User from "../Models/user.model.js";
import jsonwebtoken from "jsonwebtoken";
import { hash, compare } from "bcrypt";

// Register a new user
export async function registerUser(req, res) {
  try {
    const { username, password, mpin } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }
    const hashedPassword = await hash(password, 10);
    const hashedMpin = mpin ? await hash(mpin, 10) : null;

    const newUser = new User({
      username,
      password: hashedPassword,
      mpin: hashedMpin,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
  }
}

// User login
export async function loginUser(req, res) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jsonwebtoken.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
}

// User logout
export async function logoutUser(req, res) {
  try {
    // Clear token (front-end should handle actual token deletion)
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: "Error logging out" });
  }
}

// Validate MPIN
export async function validateMpin(req, res) {
  try {
    const { username, mpin } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await compare(mpin, user.mpin))) {
      return res.status(401).json({ error: "Invalid MPIN" });
    }

    res.json({ message: "M-PIN validated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error validating M-PIN" });
  }
}

// Get user profile
export async function getUserProfile(req, res) {
  try {
    const { userId } = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: "Error fetching user profile" });
  }
}

// Update user profile
export async function updateUserProfile(req, res) {
  try {
    const { userId } = req.user._id;
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Profile updated", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Error updating profile" });
  }
}

// Delete user account
export async function deleteUser(req, res) {
  try {
    const { userId } = req.user._id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User account deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user account" });
  }
}