"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = exports.createMessage = exports.getMessagesByRoomId = exports.getMessagesByUserId = exports.getAllMessage = void 0;
const messageModel_1 = __importDefault(require("../models/messageModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
// Get all messages
const getAllMessage = async (req, res) => {
    try {
        const messages = await messageModel_1.default.find({});
        res.json(messages);
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.getAllMessage = getAllMessage;
// Get messages by user ID
const getMessagesByUserId = async (req, res) => {
    try {
        const messagesArr = await messageModel_1.default.find({ senderId: req.params.userId });
        if (!messagesArr.length) {
            res.status(404).json({ msg: "Messages not found!" });
            return;
        }
        res.json(messagesArr);
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.getMessagesByUserId = getMessagesByUserId;
// Get messages by room ID
const getMessagesByRoomId = async (req, res) => {
    try {
        const messagesArr = await messageModel_1.default.find({ roomId: req.params.roomId });
        if (!messagesArr.length) {
            res.status(404).json({ msg: "Messages not found!" });
            return;
        }
        res.json(messagesArr);
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.getMessagesByRoomId = getMessagesByRoomId;
// Create a new message
const createMessage = async (req, res) => {
    try {
        const { senderId, receiverId, roomId, message } = req.body;
        if (!senderId || !receiverId || !roomId || !message) {
            res.status(400).json({ msg: "Error with data" });
            return;
        }
        const sender = await userModel_1.default.findById(senderId);
        const receiver = await userModel_1.default.findById(receiverId);
        if (!sender || !receiver) {
            res.status(400).json({ msg: "Sender or receiver not found" });
            return;
        }
        const newMessage = await messageModel_1.default.create({
            senderId,
            senderName: sender.username,
            receiverId,
            receiverName: receiver.username,
            roomId,
            message,
            time: new Intl.DateTimeFormat("default", {
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
            }).format(new Date()),
            date: new Intl.DateTimeFormat("en-US").format(new Date()),
        });
        res.status(201).json({
            msg: "New message created successfully",
            createdMessage: newMessage,
        });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.createMessage = createMessage;
// Delete a message
const deleteMessage = async (req, res) => {
    try {
        const message = await messageModel_1.default.findByIdAndDelete(req.params.id);
        if (!message) {
            res.status(404).json({ msg: "Message not found!" });
            return;
        }
        res.status(200).json({ msg: "Message deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.deleteMessage = deleteMessage;
//# sourceMappingURL=messageController.js.map