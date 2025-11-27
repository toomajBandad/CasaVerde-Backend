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

dotenv.config();
const secretKey = process.env.JWT_SECRET as string;

// Get current user from JWT
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
      res.status(401).json({ message: "Access token missing" });
      return;
    }

    const decoded = jwt.verify(token, secretKey) as { username: string; email: string };

    const user = await User.findOne({ username: decoded.username });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ message: "User identified correctly", user });
  } catch (err: any) {
    res.status(403).json({ message: "Invalid token" });
  }
};

// Get all users
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);

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
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, email } = req.body as {
      username: string;
      password: string;
      email: string;
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

    const emailDuplicate = await User.findOne({ email });
    if (emailDuplicate) {
      res.status(400).json({ msg: "This email is already registered" });
      return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
    });

    // ⚠️ Security fix: Do not include password in JWT payload
    const token = jwt.sign(
      {
        username: newUser.username,
        email: newUser.email,
      },
      secretKey,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      access_token: token,
      token_type: "Bearer",
      msg: "User created successfully",
      user: newUser,
    });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Send transactional email via Brevo
export const sendMail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, type, subject } = req.body as {
      userId: string;
      type: string;
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

    // ✅ Correct Brevo API setup
    const apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY as string
    );

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = subject;

    if (type === "Welcome") {
      sendSmtpEmail.htmlContent = `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 30px; border-radius: 8px;">
          <h1 style="color: #01796f;">Hello ${user.username} 👋</h1>
          <p>Welcome aboard!</p>
          <p>Thanks for signing up—your journey with us starts now, and we're excited to have you as part of our community.</p>
          <ul>
            <li>🔒 Member-only features</li>
            <li>📢 News and updates</li>
            <li>💬 Personalized support</li>
          </ul>
          <p>Just hit reply if you need anything. We're here for you!</p>
          <p style="margin-top: 20px;">Cheers,<br><strong>The Team 🚀</strong></p>
          <small style="color: #888;">You received this email because you signed up for our service.</small>
        </div>
      `;
    } else {
      sendSmtpEmail.htmlContent = `<p>Information from Casa Verde!</p>`;
    }

    sendSmtpEmail.sender = { name: "Casa Verde", email: "tbandad@gmail.com" };
    sendSmtpEmail.to = [{ email: user.email, name: user.username }];
    sendSmtpEmail.replyTo = { name: "Casa Verde", email: "tbandad@gmail.com" };

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    res.send("Email sent successfully via Brevo API");
  } catch (error: any) {
    console.error(error);
    res.status(500).send("Error sending email");
  }
};

// Update user
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body as {
      username: string;
      email: string;
      password: string;
    };

    if (!username || !password || !email) {
      res.status(400).json({ msg: "Missing username, password, or email" });
      return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, password: hashedPassword, email },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ msg: "User not found" });
      return;
    }

    res.status(201).json({ msg: "User updated successfully", user });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      res.status(404).json({ msg: "User not found" });
      return;
    }

    res.json({ msg: "User deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Login user
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body as { username: string; password: string };

    if (!username || !password) {
      res.status(400).json({ msg: "Missing username or password" });
      return;
    }

    const user = await User.findOne({ username });
    if (!user) {
      res.status(403).json({ msg: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ msg: "Invalid password" });
      return;
    }

    // ⚠️ Security fix: do not include password in JWT payload
    const token = jwt.sign(
      { username: user.username, email: user.email },
      secretKey,
      { expiresIn: "1h" }
    );

    res.json({ msg: "Login successful", token, user });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Search users by username (case-insensitive regex)
export const searchUsersByName = async (req: Request, res: Response): Promise<void> => {
  try {
    const username = req.params.username;
    const users = await User.find({
      username: { $regex: username, $options: "i" },
    });
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Get user favorites
export const getUserFavorite = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user.favorites);
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Add property to favorites
export const addUserFavorite = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { propertyId } = req.body;

    const user = await User.findById(userId);
    const property = await Property.findById(propertyId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (!property) {
      res.status(404).json({ message: "Property not found" });
      return;
    }

    // Check if property already exists in favorites
    const alreadyExists = user.favorites?.some(
      (favId) => favId.toString() === propertyId
    );

    if (alreadyExists) {
      res.status(400).json({ msg: "Item is repetitive, denied!" });
      return;
    }

    user.favorites?.push(property._id as Types.ObjectId);

    await user.save();

    res.status(201).json({
      msg: "Added to favorites successfully",
      favorites: user.favorites,
    });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Delete property from favorites
export const deleteUserFavorite = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.userId);
    const propertyId = req.body.propertyId as string; // expect propertyId in body
    const property = await Property.findById(propertyId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (!property) {
      res.status(404).json({ message: "Property not found" });
      return;
    }

    // ✅ Ensure favorites is always an array
    if (!user.favorites) {
      user.favorites = [];
    }

    const selectedItemIndex = user.favorites.findIndex(
      (item: any) => item.title === property.title
    );

    if (selectedItemIndex === -1) {
      res.status(404).json({ message: "Favorite not found" });
      return;
    }

    user.favorites.splice(selectedItemIndex, 1);
    await user.save();

    res.status(200).json({
      msg: "Removed from favorites successfully",
      favorites: user.favorites,
    });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Change user avatar
export const changeAvatar = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, image } = req.body as { username: string; image: string };

    if (!username || !image) {
      res.status(400).json({ msg: "Missing username or image" });
      return;
    }

    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({ msg: "User not found" });
      return;
    }

    user.image = image;
    await user.save();

    res.json({ msg: "User avatar updated successfully", user });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
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

    res.json({ msg: "Your message delivered successfully", newContact });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};


