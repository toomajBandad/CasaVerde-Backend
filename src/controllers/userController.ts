import { Request, Response } from "express";
import User from "../models/userModel";
import Property from "../models/propertyModel";
import Contact from "../models/contactModel";
import { emailValidator, passwordValidator } from "../validators/validators";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import * as brevo from "@getbrevo/brevo";
import { Types } from "mongoose";
import { welcomeEmail } from "../templates/WelcomeEmail";
import { infoEmail } from "../templates/InfoEmail";

dotenv.config();
const secretKey = process.env.JWT_SECRET as string;

// Get all users or search by query
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email } = req.query;

    // Build dynamic query object
    const query: any = {};
    if (username) query.username = new RegExp(username as string, "i"); // case-insensitive search
    if (email) query.email = new RegExp(email as string, "i");

    const users = await User.find(query)
      .select("-password") // exclude password for security
      .populate("favorites", "title price city") // optional: show property details
      .populate("listings", "title price city"); // optional: show property details

    res.status(200).json({
      msg: "Fetched users successfully",
      count: users.length,
      users,
    });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Login user
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ msg: "Missing username or password" });
      return;
    }

    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({ msg: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ msg: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });

    res.json({ msg: "Login successful", user: { id: user._id, username: user.username } });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

export const logoutUser = (req: Request, res: Response): void => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // true in production with HTTPS
    sameSite: "strict",
  });
  res.json({ msg: "Logout successful" });
};

// Get current user from JWT in cookies
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies?.token; // read token from cookies

    if (!token) {
      res.status(401).json({ message: "Access token missing" });
      return;
    }

    const decoded = jwt.verify(token, secretKey) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({
      message: "User identified correctly",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role, // added
        profile: user.profile, // added
      },
    });
  } catch (err: any) {
    res.status(403).json({ message: "Invalid token" });
  }
};

// Get user by ID
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password") // exclude password
      .populate("favorites", "title price city") // populate favorites with selected fields
      .populate("listings", "title price city"); // populate listings with selected fields

    if (!user) {
      res.status(404).json({ msg: "User not found!" });
      return;
    }

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Create new user
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, password, email, role, profile } = req.body as {
      username: string;
      password: string;
      email: string;
      role?: string;
      profile?: {
        image?: string;
        bio?: string;
        phone?: string;
      };
    };

    if (!username || !password || !email) {
      res.status(400).json({ msg: "Missing username, password, or email" });
      return;
    }

    if (!passwordValidator(password)) {
      res.status(400).json({ msg: "Password is not acceptable" });
      return;
    }

    if (!emailValidator(email)) {
      res.status(400).json({ msg: "Email format is not acceptable" });
      return;
    }

    // Duplicate checks
    const emailDuplicate = await User.findOne({ email });
    if (emailDuplicate) {
      res.status(400).json({ msg: "This email is already registered" });
      return;
    }

    const usernameDuplicate = await User.findOne({ username });
    if (usernameDuplicate) {
      res.status(400).json({ msg: "This username is already taken" });
      return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
      role: role || "user", // default role
      profile: profile || {}, // optional profile object
      favorites: [],
      listings: [],
      recentSearches: [],
    });

    // ⚠️ Security fix: Do not include password in JWT payload
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      secretKey,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      access_token: token,
      token_type: "Bearer",
      msg: "User created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        profile: newUser.profile,
      },
    });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Update user
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, email, password, role, profile } = req.body as {
      username?: string;
      email?: string;
      password?: string;
      role?: string;
      profile?: {
        image?: string;
        bio?: string;
        phone?: string;
      };
    };

    // Build update object dynamically
    const updateData: any = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (profile) updateData.profile = profile;

    if (password) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(password, saltRounds);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    }).select("-password"); // exclude password

    if (!user) {
      res.status(404).json({ msg: "User not found" });
      return;
    }

    res.status(200).json({ msg: "User updated successfully", user });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Delete user
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id).select(
      "-password"
    ); // exclude password just in case

    if (!user) {
      res.status(404).json({ msg: "User not found" });
      return;
    }

    res.json({ msg: "User deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Update user avatar by ID
export const changeAvatar = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params; // get user ID from URL
    const { image } = req.body as { image: string };

    if (!image) {
      res.status(400).json({ msg: "Missing image", error: true });
      return;
    }

    const user = await User.findByIdAndUpdate(
      id,
      { "profile.image": image }, // update nested profile field
      { new: true, projection: { username: 1, "profile.image": 1 } }
    );

    if (!user) {
      res.status(404).json({ msg: "User not found", error: true });
      return;
    }

    res.json({ msg: "User avatar updated successfully", user });
  } catch (error: any) {
    res.status(500).json({ msg: error.message, error: true });
  }
};

//  Get all favorites
export const getUserFavorites = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate("favorites"); // populate property details
    if (!user) {
      res.status(404).json({ msg: "User not found" });
      return;
    }

    res.status(200).json({
      msg: "Fetched favorites successfully",
      favorites: user.favorites,
    });
  } catch (error: any) {
    console.error("getUserFavorites error:", error);
    res.status(500).json({ msg: error.message });
  }
};

//  Add to favorites
export const addUserFavorite = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { propertyId } = req.body;

    // Validate existence
    const propertyExists = await Property.exists({ _id: propertyId });
    if (!propertyExists) {
      res.status(404).json({ msg: "Property not found" });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favorites: new Types.ObjectId(propertyId) } }, // prevents duplicates
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).json({ msg: "User not found" });
      return;
    }

    res.status(201).json({
      msg: "Added to favorites successfully",
      favorites: updatedUser.favorites,
    });
  } catch (error: any) {
    console.error("addUserFavorite error:", error);
    res.status(500).json({ msg: error.message });
  }
};

//  Remove from favorites
export const removeUserFavorite = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, propertyId } = req.params; // fixed: destructure both together

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { favorites: new Types.ObjectId(propertyId) } }, // removes if exists
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).json({ msg: "User not found" });
      return;
    }

    res.status(200).json({
      msg: "Removed from favorites successfully",
      favorites: updatedUser.favorites,
    });
  } catch (error: any) {
    console.error("removeUserFavorite error:", error);
    res.status(500).json({ msg: error.message });
  }
};

// Send transactional email via Brevo
export const sendMail = async (req: Request, res: Response): Promise<void> => {
  try {
    type EmailType = "Welcome" | "Info" | "ResetPassword";
    const { userId, type, subject } = req.body as {
      userId: string;
      type: EmailType;
      subject: string;
    };

    if (!userId || !type || !subject) {
      res.status(400).json({ message: "Missing userId, type, or subject" });
      return;
    }
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    //  Brevo API setup
    if (!process.env.BREVO_API_KEY || !process.env.BREVO_SENDER_EMAIL) {
      throw new Error("Missing Brevo environment variables");
    }

    const apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY as string
    );

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = subject;

    if (type === "Welcome") {
      sendSmtpEmail.htmlContent = welcomeEmail(user.username);
    } else {
      sendSmtpEmail.htmlContent = infoEmail();
    }

    sendSmtpEmail.sender = {
      name: "Casa Verde",
      email: process.env.BREVO_SENDER_EMAIL as string,
    };
    sendSmtpEmail.to = [{ email: user.email, name: user.username }];
    sendSmtpEmail.replyTo = {
      name: "Casa Verde",
      email: process.env.BREVO_SENDER_EMAIL as string,
    };

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    res.status(200).json({ msg: "Email sent successfully" });
  } catch (error: any) {
    console.error("Brevo error:", error.response?.body || error);
    res.status(500).json({ msg: "Error sending email" });
  }
};

// Contact form submission
export const contactUs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, family, message, email } = req.body as {
      name: string;
      family: string;
      message: string;
      email: string;
    };

    if (!name || !family || !message || !email) {
      res.status(400).json({ msg: "Missing contact form fields" });
      return;
    }

    const newContact = await Contact.create({ name, family, message, email });

    res.status(201).json({
      msg: "Your message delivered successfully",
      contact: {
        id: newContact._id,
        name: newContact.name,
        family: newContact.family,
        email: newContact.email,
        message: newContact.message,
      },
    });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};
