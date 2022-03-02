import express from "express";
import socketio from "socket.io";
import http from "http";
import router from "./router";

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on("connection", (socket) => {
  const id = socket.handshake.query.id;

  socket.join(id);

  // Functionality when user sends a message
  socket.on("send-message", ({ recipient, recipients, text }) => {
    console.log({ recipient, recipients, text });
    socket.broadcast.to(recipient).emit("receive-message", {
      recipients: recipients.map((r) => ({ username: r })),
      recipient,
      text,
      sender: id,
    });
  });
});

app.use(router);

// Listen to server
server.listen(PORT, () => console.log(`Server running on locolhost:${PORT}`));
