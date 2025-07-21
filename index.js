const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const { Server } = require("socket.io");
const User = require("./models/userModel");
const Property = require("./models/propertyModel");

const userRoutes = require("./routes/userRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const contractCategoryRoutes = require("./routes/contractCategoryRoutes");
const typeCategoryRoutes = require("./routes/typeCategoryRoutes");
const cityRoutes = require("./routes/cityRoutes");
const newsRoutes = require("./routes/newsRoutes");
const messageRoutes = require("./routes/messageRoutes");
const roomRoutes = require("./routes/roomRoutes");

const app = express();
const port = process.env.PORT || 4000;

app.use(cors()); // Enable CORS for all requests
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.error("<❌ Error in connecting Mongo DB :>", error);
  });

//API Routes//
app.use("/users", userRoutes);
app.use("/properties", propertyRoutes);
app.use("/contractCategory", contractCategoryRoutes);
app.use("/typeCategory", typeCategoryRoutes);
app.use("/cities", cityRoutes);
app.use("/news", newsRoutes);
app.use("/message", messageRoutes);
app.use("/room", roomRoutes);

//welcome route
app.get("/", (req, res) => {
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
      message: "/room",
    },
  });
});

const server = app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});

// Socket IO Chatting Starts Here ------------------------
const ADMIN = "admin";
// state
const UsersState = {
  users: [],
  setUsers: function (newUsersArray) {
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

  // Upon connection - only to user
  socket.emit(
    "message",
    buildMsg(ADMIN, "Welcome to your Chat! Select an item to continue")
  );

  socket.on("enterRoom", ({ name, room }) => {
    // leave previous room
    const prevRoom = getUser(socket.id)?.room;

    if (prevRoom) {
      socket.leave(prevRoom);
      io.to(prevRoom).emit(
        "message",
        buildMsg(ADMIN, `${name} has left the room`)
      );
    }

    const user = activateUser(socket.id, name, room);

    // Cannot update previous room users list until after the state update in activate user
    if (prevRoom) {
      io.to(prevRoom).emit("userList", {
        users: getUsersInRoom(prevRoom),
      });
    }

    // join room
    socket.join(user.room);
    console.log("user joined to :", user.room);

    // To user who joined
    socket.emit(
      "message",
      buildMsg(
        ADMIN,
        `You have selected the chat. Now you can type your message !`
      )
    );

    // To everyone else
    socket.broadcast
      .to(user.room)
      .emit("message", buildMsg(ADMIN, `${user.name} has joined the room`));

    // Update user list for room
    io.to(user.room).emit("userList", {
      users: getUsersInRoom(user.room),
    });

    // Update rooms list for everyone
    io.emit("roomList", {
      rooms: getAllActiveRooms(),
    });
  });

  // When user disconnects - to all others
  socket.on("disconnect", () => {
    const user = getUser(socket.id);
    userLeavesApp(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        buildMsg(ADMIN, `${user.name} has left the room`)
      );

      io.to(user.room).emit("userList", {
        users: getUsersInRoom(user.room),
      });

      io.emit("roomList", {
        rooms: getAllActiveRooms(),
      });
    }

    console.log(`User ${socket.id} disconnected`);
  });

  // Listening for a message event
  socket.on("message", ({ name, text }) => {
    const room = getUser(socket.id)?.room;
    if (room) {
      io.to(room).emit("message", buildMsg(name, text));
    }
  });

  // Listen for activity
  socket.on("activity", (name) => {
    const room = getUser(socket.id)?.room;
    if (room) {
      socket.broadcast.to(room).emit("activity", name);
    }
  });
});

function buildMsg(name, text) {
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

// User functions
function activateUser(id, name, room) {
  const user = { id, name, room };
  UsersState.setUsers([
    ...UsersState.users.filter((user) => user.id !== id),
    user,
  ]);
  return user;
}

function userLeavesApp(id) {
  UsersState.setUsers(UsersState.users.filter((user) => user.id !== id));
}

function getUser(id) {
  return UsersState.users.find((user) => user.id === id);
}

function getUsersInRoom(room) {
  return UsersState.users.filter((user) => user.room === room);
}

function getAllActiveRooms() {
  return Array.from(new Set(UsersState.users.map((user) => user.room)));
}
// Socket IO Chatting Ends Here ------------------------