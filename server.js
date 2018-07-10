require("dotenv").config();
const express = require("express");
const app = express();
const Pusher = require("pusher");
const bodyParser = require("body-parser");

var pusher = new Pusher({
  appId: process.env.APP_ID,
  key: process.env.KEY,
  secret: process.env.SECRET,
  cluster: process.env.CLUSTER,
  encrypted: true
});

app.use(express.static("."));
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/auth", (req, res) => {
  var socketId = req.body.socket_id;
  var channel = req.body.channel_name;
  var auth = pusher.authenticate(socketId, channel);
  res.send(auth);
});

app.listen(8080, () => console.log("server is listening on port 8080"));
