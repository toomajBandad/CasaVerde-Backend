import { Request, Response } from "express";
import Message from "../models/messageModel";
import User from "../models/userModel";

// Get all messages
export const getAllMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const messages = await Message.find({});
    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Get messages by user ID
export const getMessagesByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const messagesArr = await Message.find({ senderId: req.params.userId });
    if (!messagesArr.length) {
      res.status(404).json({ msg: "Messages not found!" });
      return;
    }
    res.json(messagesArr);
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Get messages by room ID
export const getMessagesByRoomId = async (req: Request, res: Response): Promise<void> => {
  try {
    const messagesArr = await Message.find({ roomId: req.params.roomId });
    if (!messagesArr.length) {
      res.status(404).json({ msg: "Messages not found!" });
      return;
    }
    res.json(messagesArr);
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Create a new message
export const createMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { senderId, receiverId, roomId, message } = req.body;

    if (!senderId || !receiverId || !roomId || !message) {
      res.status(400).json({ msg: "Error with data" });
      return;
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      res.status(400).json({ msg: "Sender or receiver not found" });
      return;
    }

    const newMessage = await Message.create({
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
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Delete a message
export const deleteMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);

    if (!message) {
      res.status(404).json({ msg: "Message not found!" });
      return;
    }

    res.status(200).json({ msg: "Message deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};