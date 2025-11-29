import express, { Router } from "express";
import {
  getUsers,
  getMe,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
  getUserFavorites,
  addUserFavorite,
  removeUserFavorite,
  changeAvatar,
  sendMail,
  contactUs,
} from "../controllers/userController";

const router: Router = express.Router();

// ---------- Users ----------
router.get("/", getUsers);              // List all users or search via query (?name=John)
router.get("/me", getMe);               // Get current authenticated user
router.get("/:id", getUserById);        // Get user by ID
router.post("/", createUser);           // Create new user
router.put("/:id", updateUser);         // Update user by ID
router.delete("/:id", deleteUser);      // Delete user by ID

// ---------- Auth ----------
router.post("/auth/login", loginUser);  // User login
router.post("/auth/logout", logoutUser);  // User logout

// ---------- Profile ----------
router.put("/:id/avatar", changeAvatar);// Update user avatar

// ---------- Favorites ----------
router.get("/:userId/favorites", getUserFavorites);              // Get user's favorites
router.post("/:userId/favorites", addUserFavorite);             // Add to user's favorites
router.delete("/:userId/favorites/:propertyId", removeUserFavorite);// Remove favorite by property ID

// ---------- Support ----------
router.post("/support/sendMail", sendMail);   // Send support email
router.post("/support/contact", contactUs);   // Contact support

export default router;