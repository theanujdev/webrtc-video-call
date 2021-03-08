const express = require("express");
const { v4: uuidV4 } = require("uuid");
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => res.redirect(`/${uuidV4()}`));
app.get("/:room", (req, res) => {
  res.render("room", { roomID: req.params.room });
});

const server = app.listen(PORT, () =>
  console.log(`Listening on http://localhost:${PORT}`)
);

const io = require("socket.io")(server);
io.on("connection", (socket) => {
  socket.on("join-room", (roomID, userID) => {
    socket.join(roomID);
    socket.to(roomID).broadcast.emit("user-connected", userID);
    socket.on("disconnect", () => {
      socket.to(roomID).broadcast.emit("user-disconnected", userID);
    });
  });
});
