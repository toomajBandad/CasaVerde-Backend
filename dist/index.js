"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
// Routes
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const propertyRoutes_1 = __importDefault(require("./routes/propertyRoutes"));
const contractCategoryRoutes_1 = __importDefault(require("./routes/contractCategoryRoutes"));
const typeCategoryRoutes_1 = __importDefault(require("./routes/typeCategoryRoutes"));
const cityRoutes_1 = __importDefault(require("./routes/cityRoutes"));
const newsRoutes_1 = __importDefault(require("./routes/newsRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes"));
const roomRoutes_1 = __importDefault(require("./routes/roomRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// MongoDB Connection
mongoose_1.default
    .connect(process.env.MONGODB_URI)
    .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
})
    .catch((error) => {
    console.error("<❌ Error in connecting Mongo DB :>", error);
});
// API Routes
app.use("/users", userRoutes_1.default);
app.use("/properties", propertyRoutes_1.default);
app.use("/contractCategory", contractCategoryRoutes_1.default);
app.use("/typeCategory", typeCategoryRoutes_1.default);
app.use("/cities", cityRoutes_1.default);
app.use("/news", newsRoutes_1.default);
app.use("/message", messageRoutes_1.default);
app.use("/room", roomRoutes_1.default);
// Welcome route
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
            room: "/room",
        },
    });
});
const server = app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});
// ---------------- Socket.IO Chatting ----------------
const ADMIN = "admin";
const UsersState = {
    users: [],
    setUsers(newUsersArray) {
        this.users = newUsersArray;
    },
};
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});
io.on("connection", (socket) => {
    console.log(`User ${socket.id} connected`);
    // Welcome message
    socket.emit("message", buildMsg(ADMIN, "Welcome to your Chat! Select an item to continue"));
    socket.on("enterRoom", ({ name, room }) => {
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
    socket.on("message", ({ name, text }) => {
        const room = getUser(socket.id)?.room;
        if (room) {
            io.to(room).emit("message", buildMsg(name, text));
        }
    });
    socket.on("activity", (name) => {
        const room = getUser(socket.id)?.room;
        if (room) {
            socket.broadcast.to(room).emit("activity", name);
        }
    });
});
// ---------------- Helper Functions ----------------
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
function activateUser(id, name, room) {
    const user = { id, name, room };
    UsersState.setUsers([...UsersState.users.filter((u) => u.id !== id), user]);
    return user;
}
function userLeavesApp(id) {
    UsersState.setUsers(UsersState.users.filter((u) => u.id !== id));
}
function getUser(id) {
    return UsersState.users.find((u) => u.id === id);
}
function getUsersInRoom(room) {
    return UsersState.users.filter((u) => u.room === room);
}
function getAllActiveRooms() {
    return Array.from(new Set(UsersState.users.map((u) => u.room)));
}
//# sourceMappingURL=index.js.map