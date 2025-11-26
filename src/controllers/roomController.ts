import { Request, Response } from "express";
import Room from "../models/roomModel";

// Get all rooms
export const getAllRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const rooms = await Room.find({}).populate("property");
    res.json(rooms);
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Get rooms by user ID
export const getRoomsByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;
    const roomsArr = await Room.find({ users: { $in: [userId] } })
      .populate("users")
      .populate("property");

    if (!roomsArr.length) {
      res.status(404).json({ msg: "This owner does not have any room" });
      return;
    }

    res.status(200).json(roomsArr);
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Create a new room
export const createRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const { users, property } = req.body as { users: string[]; property: string };

    if (!users || !property) {
      res.status(400).json({ msg: "Error with users or property" });
      return;
    }

    const propRoomsArr = await Room.find({ property });

    for (const item of propRoomsArr) {
      const sortedUsers = users.map((u) => u.toString()).sort();
      const itemUsers = item.users.map((u: any) => u.toString()).sort();

      if (itemUsers[0] === sortedUsers[0] && itemUsers[1] === sortedUsers[1]) {
        res.status(400).json({
          msg: "Duplicate, room already exists!",
          createdRoom: item,
        });
        return;
      }
    }

    const newRoom = await Room.create({
      users: users.sort(),
      property,
    });

    res.status(201).json({
      msg: "New room created successfully",
      createdRoom: newRoom,
    });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Delete room
export const deleteRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);

    if (!room) {
      res.status(404).json({ msg: "Room not found!" });
      return;
    }

    res.status(200).json({ msg: "Room deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};