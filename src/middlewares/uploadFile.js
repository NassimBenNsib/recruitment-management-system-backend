import path from "path";
import multer from "multer";

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    req.body.candidateCv = Date.now() + ext;
    cb(null, req.body.candidateCv);
  },
});
export var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file && file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 50,
  },
});
