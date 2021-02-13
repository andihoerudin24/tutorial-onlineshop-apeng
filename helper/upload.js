const multer = require("multer");
/*
 * configuration filestorage
 */
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

/*
 * configuration filter file
 */
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

module.exports = {
  fileStorage: fileStorage,
  fileFilter: fileFilter,
};
