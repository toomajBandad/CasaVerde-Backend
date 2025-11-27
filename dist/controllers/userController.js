"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactUs = exports.changeAvatar = exports.deleteUserFavorite = exports.addUserFavorite = exports.getUserFavorite = exports.searchUsersByName = exports.loginUser = exports.deleteUser = exports.updateUser = exports.sendMail = exports.createUser = exports.getUserById = exports.getUsers = exports.getMe = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const propertyModel_1 = __importDefault(require("../models/propertyModel"));
const contactModel_1 = __importDefault(require("../models/contactModel"));
const validators_1 = require("../validators/validators");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const brevo = __importStar(require("@getbrevo/brevo"));
dotenv_1.default.config();
const secretKey = process.env.JWT_SECRET;
// Get current user from JWT
const getMe = async (req, res) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
        if (!token) {
            res.status(401).json({ message: "Access token missing" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        const user = await userModel_1.default.findOne({ username: decoded.username });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json({ message: "User identified correctly", user });
    }
    catch (err) {
        res.status(403).json({ message: "Invalid token" });
    }
};
exports.getMe = getMe;
// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await userModel_1.default.find({});
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.getUsers = getUsers;
// Get user by ID
const getUserById = async (req, res) => {
    try {
        const user = await userModel_1.default.findById(req.params.id);
        if (!user) {
            res.status(404).json({ msg: "User not found!" });
            return;
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.getUserById = getUserById;
// Create new user
const createUser = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        if (!username || !password || !email) {
            res.status(400).json({ msg: "Missing username, password, or email" });
            return;
        }
        if (!(0, validators_1.passwordValidator)(password)) {
            res.status(400).json({ msg: "Password is not acceptable" });
            return;
        }
        if (!(0, validators_1.emailValidator)(email)) {
            res.status(400).json({ msg: "Email format is not acceptable" });
            return;
        }
        const emailDuplicate = await userModel_1.default.findOne({ email });
        if (emailDuplicate) {
            res.status(400).json({ msg: "This email is already registered" });
            return;
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
        const newUser = await userModel_1.default.create({
            username,
            password: hashedPassword,
            email,
        });
        // ⚠️ Security fix: Do not include password in JWT payload
        const token = jsonwebtoken_1.default.sign({
            username: newUser.username,
            email: newUser.email,
        }, secretKey, { expiresIn: "1h" });
        res.status(201).json({
            access_token: token,
            token_type: "Bearer",
            msg: "User created successfully",
            user: newUser,
        });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.createUser = createUser;
// Send transactional email via Brevo
const sendMail = async (req, res) => {
    try {
        const { userId, type, subject } = req.body;
        if (!userId || !type || !subject) {
            res.status(400).json({ message: "Missing userId, type, or subject" });
            return;
        }
        const user = await userModel_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // ✅ Correct Brevo API setup
        const apiInstance = new brevo.TransactionalEmailsApi();
        apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);
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
        }
        else {
            sendSmtpEmail.htmlContent = `<p>Information from Casa Verde!</p>`;
        }
        sendSmtpEmail.sender = { name: "Casa Verde", email: "tbandad@gmail.com" };
        sendSmtpEmail.to = [{ email: user.email, name: user.username }];
        sendSmtpEmail.replyTo = { name: "Casa Verde", email: "tbandad@gmail.com" };
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        res.send("Email sent successfully via Brevo API");
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Error sending email");
    }
};
exports.sendMail = sendMail;
// Update user
const updateUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !password || !email) {
            res.status(400).json({ msg: "Missing username, password, or email" });
            return;
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
        const user = await userModel_1.default.findByIdAndUpdate(req.params.id, { username, password: hashedPassword, email }, { new: true });
        if (!user) {
            res.status(404).json({ msg: "User not found" });
            return;
        }
        res.status(201).json({ msg: "User updated successfully", user });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.updateUser = updateUser;
// Delete user
const deleteUser = async (req, res) => {
    try {
        const user = await userModel_1.default.findByIdAndDelete(req.params.id);
        if (!user) {
            res.status(404).json({ msg: "User not found" });
            return;
        }
        res.json({ msg: "User deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.deleteUser = deleteUser;
// Login user
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ msg: "Missing username or password" });
            return;
        }
        const user = await userModel_1.default.findOne({ username });
        if (!user) {
            res.status(403).json({ msg: "User not found" });
            return;
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ msg: "Invalid password" });
            return;
        }
        // ⚠️ Security fix: do not include password in JWT payload
        const token = jsonwebtoken_1.default.sign({ username: user.username, email: user.email }, secretKey, { expiresIn: "1h" });
        res.json({ msg: "Login successful", token, user });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.loginUser = loginUser;
// Search users by username (case-insensitive regex)
const searchUsersByName = async (req, res) => {
    try {
        const username = req.params.username;
        const users = await userModel_1.default.find({
            username: { $regex: username, $options: "i" },
        });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.searchUsersByName = searchUsersByName;
// Get user favorites
const getUserFavorite = async (req, res) => {
    try {
        const user = await userModel_1.default.findById(req.params.userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json(user.favorites);
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.getUserFavorite = getUserFavorite;
// Add property to favorites
const addUserFavorite = async (req, res) => {
    try {
        const { userId } = req.params;
        const { propertyId } = req.body;
        const user = await userModel_1.default.findById(userId);
        const property = await propertyModel_1.default.findById(propertyId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if (!property) {
            res.status(404).json({ message: "Property not found" });
            return;
        }
        // Check if property already exists in favorites
        const alreadyExists = user.favorites?.some((favId) => favId.toString() === propertyId);
        if (alreadyExists) {
            res.status(400).json({ msg: "Item is repetitive, denied!" });
            return;
        }
        user.favorites?.push(property._id);
        await user.save();
        res.status(201).json({
            msg: "Added to favorites successfully",
            favorites: user.favorites,
        });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.addUserFavorite = addUserFavorite;
// Delete property from favorites
const deleteUserFavorite = async (req, res) => {
    try {
        const user = await userModel_1.default.findById(req.params.userId);
        const propertyId = req.body.propertyId; // expect propertyId in body
        const property = await propertyModel_1.default.findById(propertyId);
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
        const selectedItemIndex = user.favorites.findIndex((item) => item.title === property.title);
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
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.deleteUserFavorite = deleteUserFavorite;
// Change user avatar
const changeAvatar = async (req, res) => {
    try {
        const { username, image } = req.body;
        if (!username || !image) {
            res.status(400).json({ msg: "Missing username or image" });
            return;
        }
        const user = await userModel_1.default.findOne({ username });
        if (!user) {
            res.status(404).json({ msg: "User not found" });
            return;
        }
        user.image = image;
        await user.save();
        res.json({ msg: "User avatar updated successfully", user });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.changeAvatar = changeAvatar;
// Contact form submission
const contactUs = async (req, res) => {
    try {
        const { name, family, message, email } = req.body;
        if (!name || !family || !message || !email) {
            res.status(400).json({ msg: "Missing contact form fields" });
            return;
        }
        const newContact = await contactModel_1.default.create({ name, family, message, email });
        res.json({ msg: "Your message delivered successfully", newContact });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.contactUs = contactUs;
//# sourceMappingURL=userController.js.map