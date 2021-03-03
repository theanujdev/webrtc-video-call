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

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
