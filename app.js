const express = require("express");

const path = require("path");

//const multer = require("multer");

const mongoose = require("mongoose");

const cors = require("cors");

const bodyParser = require("body-parser");

const feedRoutes = require("./routes/feed");

const app = express();

app.use(cors());

/*
 * configuration filestorage
 */
/* const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});
 */
/*
 * configuration filter file
 */
/* const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
}; */

app.use(bodyParser.urlencoded({ extended: false }));

//app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"));

app.use(bodyParser.json());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/feed", feedRoutes);

/*
 * definition global error
 */
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({
    message: message,
  });
});

mongoose
  .connect(
    "mongodb+srv://andihoerudin34:andihoerudin@cluster0.dx4sn.mongodb.net/posts?retryWrites=true&w=majority",
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    }
  )
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => {
    console.log("err", err);
  });
