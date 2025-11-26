import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";

import User from "./models/userModel";
import Property from "./models/propertyModel";

// Routes
import userRoutes from "./routes/userRoutes";
import propertyRoutes from "./routes/propertyRoutes";
import contractCategoryRoutes from "./routes/contractCategoryRoutes";
import typeCategoryRoutes from "./routes/typeCategoryRoutes";
import cityRoutes from "./routes/cityRoutes";
import newsRoutes from "./routes/newsRoutes";
import messageRoutes from "./routes/messageRoutes";
import roomRoutes from "./routes/roomRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.error("<❌ Error in connecting Mongo DB :>", error);
  });

// API Routes
app.use("/users", userRoutes);
app.use("/properties", propertyRoutes);
app.use("/contractCategory", contractCategoryRoutes);
app.use("/typeCategory", typeCategoryRoutes);
app.use("/cities", cityRoutes);
app.use("/news", newsRoutes);
app.use("/message", messageRoutes);
app.use("/room", roomRoutes);

// Welcome route
app.get("/", (req: Request, res: Response) => {
  res.json({
    mensaje: "Users and properties API",
    endpoints: {
      users: "/users",
      properties: "/properties",
      contractCategory: "/contractCategory",
      typeCategory: "/typeCategory",
      cities: "/cities",
      news: "/news",
      message: "/message",
      room: "/room",
    },
  });
});

const server = app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});

// ---------------- Socket.IO Chatting ----------------
const ADMIN = "admin";

interface ChatUser {
  id: string;
  name: string;
  room: string;
}

const UsersState = {
  users: [] as ChatUser[],
  setUsers(newUsersArray: ChatUser[]) {
    this.users = newUsersArray;
  },
};

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  // Welcome message
  socket.emit("message", buildMsg(ADMIN, "Welcome to your Chat! Select an item to continue"));

  socket.on("enterRoom", ({ name, room }: { name: string; room: string }) => {
    const prevRoom = getUser(socket.id)?.room;

    if (prevRoom) {
      socket.leave(prevRoom);
      io.to(prevRoom).emit("message", buildMsg(ADMIN, `${name} has left the room`));
    }

    const user = activateUser(socket.id, name, room);

    if (prevRoom) {
      io.to(prevRoom).emit("userList", { users: getUsersInRoom(prevRoom) });
    }

    socket.join(user.room);
    console.log("user joined to:", user.room);

    socket.emit("message", buildMsg(ADMIN, `You have selected the chat. Now you can type your message!`));

    socket.broadcast.to(user.room).emit("message", buildMsg(ADMIN, `${user.name} has joined the room`));

    io.to(user.room).emit("userList", { users: getUsersInRoom(user.room) });

    io.emit("roomList", { rooms: getAllActiveRooms() });
  });

  socket.on("disconnect", () => {
    const user = getUser(socket.id);
    userLeavesApp(socket.id);

    if (user) {
      io.to(user.room).emit("message", buildMsg(ADMIN, `${user.name} has left the room`));
      io.to(user.room).emit("userList", { users: getUsersInRoom(user.room) });
      io.emit("roomList", { rooms: getAllActiveRooms() });
    }

    console.log(`User ${socket.id} disconnected`);
  });

  socket.on("message", ({ name, text }: { name: string; text: string }) => {
    const room = getUser(socket.id)?.room;
    if (room) {
      io.to(room).emit("message", buildMsg(name, text));
    }
  });

  socket.on("activity", (name: string) => {
    const room = getUser(socket.id)?.room;
    if (room) {
      socket.broadcast.to(room).emit("activity", name);
    }
  });
});

// ---------------- Helper Functions ----------------
function buildMsg(name: string, text: string) {
  return {
    name,
    text,
    time: new Intl.DateTimeFormat("default", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }).format(new Date()),
  };
}

function activateUser(id: string, name: string, room: string): ChatUser {
  const user: ChatUser = { id, name, room };
  UsersState.setUsers([...UsersState.users.filter((u) => u.id !== id), user]);
  return user;
}

function userLeavesApp(id: string) {
  UsersState.setUsers(UsersState.users.filter((u) => u.id !== id));
}

function getUser(id: string): ChatUser | undefined {
  return UsersState.users.find((u) => u.id === id);
}

function getUsersInRoom(room: string): ChatUser[] {
  return UsersState.users.filter((u) => u.room === room);
}

function getAllActiveRooms(): string[] {
  return Array.from(new Set(UsersState.users.map((u) => u.room)));
}