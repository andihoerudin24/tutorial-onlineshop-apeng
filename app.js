const express = require("express");

const path = require("path");

const mongoose = require("mongoose");

const cors = require("cors");

const bodyParser = require("body-parser");

const feedRoutes = require("./routes/feed");

const authRoutes = require("./routes/user");

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

/*
 * definition global error
 */
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    message: message,
    data: data,
  });
});

mongoose
  .connect(
    "mongodb+srv://andihoerudin34:andihoerudin@cluster0.dx4sn.mongodb.net/apeng?retryWrites=true&w=majority",
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    }
  )
  .then((result) => {
    const server = app.listen(8080);
    const io = require("./socket").init(server);
    io.on('connection',socket =>{
      console.log('Client Connected')
    })
  })
  .catch((err) => {
    console.log("err", err);
  });

module.exports = app
