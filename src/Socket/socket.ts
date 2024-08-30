import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import dotenv from 'dotenv'

dotenv.config()

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.HOST,
    methods: ["GET", "POST"],
  },
});

interface UserSocketMap {
  [userId: string]: string;
}

interface UnreadMessages {
  [to: string]: {
    [from: string]: number;
  };
}

const userSocketMap: UserSocketMap = {};
const unreadMessages: UnreadMessages = {};

const getReceiverSocketId = (receiverId: string): string | undefined => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket: Socket) => {
  const userId = socket.handshake.query.userId as string | undefined;

  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  // Typing status
  socket.on("typing", () => {
    const receiverId = getReceiverSocketId(userId!);
    if (receiverId) {
      io.to(receiverId).emit("typing", { userId });
    }
  });

  socket.on("stopTyping", () => {
    const receiverId = getReceiverSocketId(userId!);
    if (receiverId) {
      io.to(receiverId).emit("stopTyping", { userId });
    }
  });-

  // Handle new message
  socket.on("sendnewMessage", ({ to, from }: { to: string; from: string }) => {
    if (!unreadMessages[to]) {
      unreadMessages[to] = {};
    }
    if (!unreadMessages[to][from]) {
      unreadMessages[to][from] = 0;
    }
    unreadMessages[to][from] += 1;

    const receiverSocketId = getReceiverSocketId(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newunreadMessage", {
        from,
        unreadCount: unreadMessages[to][from],
      });
    }
  });

  // Mark messages as read
  socket.on("markAsRead", ({ from, to }: { from: string; to: string }) => {
    if (unreadMessages[to] && unreadMessages[to][from]) {
      delete unreadMessages[to][from];
    }
  });

  socket.on(
    "callingUser",
    ({
      Caller,
      userId,
      personalLink,
    }: {
      Caller: any;
      userId: string;
      personalLink: string;
    }) => {
      const receiverSocketId = getReceiverSocketId(userId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("incomingCall", {
          Caller,
          userId,
          personalLink,
        });
      }
    }
  );

  socket.on("onRejected", ({ Caller }: { Caller: any }) => {
    console.log(Caller, "call REJECTED");
    const receiverSocketId = getReceiverSocketId(Caller._id);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("callRejected");
    }
  });
});

export { app, io, server, getReceiverSocketId };
