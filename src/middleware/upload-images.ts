import multer from "multer";
import path from "path";
import * as fs from "fs";

const storage = multer.diskStorage({
  destination: function (
    req: any,
    file: any,
    cb: (error: NodeJS.ErrnoException | null, destination: string) => void
  ) {
    const parentDirectory = path.join(__dirname, "..");

    const uploadPath = path.join(parentDirectory, "uploads");

    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      if (err) {
        console.error("Error creating destination folder:", err);
        cb(err, "");
      } else {
        cb(null, uploadPath);
      }
    });
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

export default upload;
