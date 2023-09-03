import path from "path";
import multer from "multer";

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    req.cv = Date.now() + ext;
    cb(null, req.cv);
  },
});
export var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("File must be a PDF!"), false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
});
