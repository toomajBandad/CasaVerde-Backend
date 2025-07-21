const Message = require("../models/messageModel");
const User = require("../models/userModel");

const getAllMessage = async (req, res) => {
  try {
    const messages = await Message.find({});
    res.json(messages);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getMessagesByUSerId = async (req, res) => {
  try {
    const messagesArr = await Message.find({ sender: req.params.userId });
    if (!messagesArr.length) {
      return res.status(404).json({ msg: "Message did not find !" });
    }
    res.json(messagesArr);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
const getMessagesByRoomId = async (req, res) => {
  try {
    const messagesArr = await Message.find({ roomId: req.params.roomId });
    if (!messagesArr.length) {
      return res.status(404).json({ msg: "Messages not found !" });
    }
    res.json(messagesArr);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const createMessage = async (req, res) => {
  try {
    const { senderId, receiverId, roomId, message } = req.body;

    if (!senderId || !receiverId || !roomId || !message) {
      return res.status(400).json({ msg: "error with  datas" });
    }

    const sender = await User.findById(senderId);
    const reciever = await User.findById(receiverId);

    if (!sender || !reciever) {
      return res.status(400).json({ msg: "sender or reciever not found" });
    }

    const newMessage = await Message.create({
      senderId: senderId,
      senderName: sender.username,
      receiverId: receiverId,
      receiverName: reciever.username,
      roomId,
      message,
      time: new Intl.DateTimeFormat("default", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      }).format(new Date()),
      date : new Intl.DateTimeFormat("en-US").format(new Date())
    });

    res.status(201).json({
      msg: "new Message created successfully",
      createdMessage: newMessage,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({ msg: "Message did not find !" });
    }

    res.status(200).json({ msg: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getAllMessage,
  getMessagesByUSerId,
  getMessagesByRoomId,
  createMessage,
  deleteMessage,
};
