require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const port = 3000;
const cors = require("cors");
const { Server } = require("socket.io");
// const bodyParser = require('body-parser')

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
// app.use(bodyParser.urlencoded({ extended: true,limit: '50mb' }))
app.use(express.json({ limit: "50mb" }));
// DB setup
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  family: 4,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to mongoose"));

const io = new Server(server, { cors: { origin: "*" } });

const login = require("./routes/login");
const user = require("./routes/userRoute");
const axios = require("axios");
const User = require("./models/User");

app.get("/", (req, res) => {
  res.send("Working");
});

app.use("/login", login);
app.use("/user", user);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("join", (data) => {
    console.log(data.number, "has joined");
    socket.join(data.number);
  });

  socket.on("message", async (data) => {
    console.log(data);
    var user = await User.findOne({ number: data.to });
    // console.log(io.sockets.adapter.rooms.keys(),io.sockets.adapter.rooms.values());
    if (user?.expoNotificationToken) {
      axios.post("https://api.expo.dev/v2/push/send?useFcmV1=true", {
        sound: "default",
        to: user.expoNotificationToken,
        title: data.name,
        body: data.message,
      });
    }
    io.sockets
      .in(data.to)
      .emit("new_message", {
        message: data.message,
        from: data.from,
        date: data.date,
        time: data.time,
      });
  });
});
server.listen(port, function () {
  console.log(`Running on port ${this.address().port}`);
});
