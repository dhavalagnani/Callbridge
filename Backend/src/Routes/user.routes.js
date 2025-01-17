import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  validateMpin,
  getUserProfile,
  updateUserProfile,
  deleteUser,
} from "../Controllers/user.controller.js";

const router = Router();

// Authentication routes
router.post("/register", registerUser); // Register a new user
router.post("/login", loginUser); // User login
router.post("/logout", logoutUser); // User logout
router.post("/mpin", validateMpin); // Validate MPIN
// router.post('/biometric', biometricLogin);  // Biometric login

// User profile management
router.get("/:userId", getUserProfile); // Get user profile
router.put("/:userId", updateUserProfile); // Update user profile
router.delete("/:userId", deleteUser); // Delete user account

export default router;
