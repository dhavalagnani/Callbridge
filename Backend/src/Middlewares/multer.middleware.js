import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp"); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Customize the filename as needed
  },
});

export const upload = multer({ storage: storage });
