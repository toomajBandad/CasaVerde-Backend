"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoom = exports.createRoom = exports.getRoomsByUserId = exports.getAllRoom = void 0;
const roomModel_1 = __importDefault(require("../models/roomModel"));
// Get all rooms
const getAllRoom = async (req, res) => {
    try {
        const rooms = await roomModel_1.default.find({}).populate("property");
        res.json(rooms);
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.getAllRoom = getAllRoom;
// Get rooms by user ID
const getRoomsByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const roomsArr = await roomModel_1.default.find({ users: { $in: [userId] } })
            .populate("users")
            .populate("property");
        if (!roomsArr.length) {
            res.status(404).json({ msg: "This owner does not have any room" });
            return;
        }
        res.status(200).json(roomsArr);
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.getRoomsByUserId = getRoomsByUserId;
// Create a new room
const createRoom = async (req, res) => {
    try {
        const { users, property } = req.body;
        if (!users || !property) {
            res.status(400).json({ msg: "Error with users or property" });
            return;
        }
        const propRoomsArr = await roomModel_1.default.find({ property });
        for (const item of propRoomsArr) {
            const sortedUsers = users.map((u) => u.toString()).sort();
            const itemUsers = item.users.map((u) => u.toString()).sort();
            if (itemUsers[0] === sortedUsers[0] && itemUsers[1] === sortedUsers[1]) {
                res.status(400).json({
                    msg: "Duplicate, room already exists!",
                    createdRoom: item,
                });
                return;
            }
        }
        const newRoom = await roomModel_1.default.create({
            users: users.sort(),
            property,
        });
        res.status(201).json({
            msg: "New room created successfully",
            createdRoom: newRoom,
        });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.createRoom = createRoom;
// Delete room
const deleteRoom = async (req, res) => {
    try {
        const room = await roomModel_1.default.findByIdAndDelete(req.params.id);
        if (!room) {
            res.status(404).json({ msg: "Room not found!" });
            return;
        }
        res.status(200).json({ msg: "Room deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.deleteRoom = deleteRoom;
//# sourceMappingURL=roomController.js.map