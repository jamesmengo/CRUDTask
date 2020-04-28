require("./db/mongoose");
const express = require("express");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

// Server Config
const app = express();

// Middleware
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app;
