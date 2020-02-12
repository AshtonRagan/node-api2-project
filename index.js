const express = require("express");
const server = express();
const port = 5000;

const postRouter = require("./SeverRouter/Post-Router.js");

server.use("/api/post", postRouter);

server.listen(port, () => console.log("it is in fact running"));
