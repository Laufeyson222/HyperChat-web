const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");



const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");
const friendsRouter = require("./Routes/friendsRouter");

const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);
app.use("/api/friends", friendsRouter);

const port = process.env.PORT || 5000;
const uri = process.env.ATLATS_URI;

app.listen(port , (req, res) => {
    console.log("Server is running on port...:",port);
});


mongoose.connect(uri).then(() => {console.log("Database connected...")}).catch((err) => console.log("MongdoDB connection failed: ",err.message));

app.get("/", (req, res) => {
    console.log("Welcome to HyperChat...!",req.session);
    res.send("Welcome to HyperChat...!");
});