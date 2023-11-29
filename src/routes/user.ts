import { Express } from "express";
import { UserEp } from "../end-points/user-ep";
import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // specify the folder where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // specify the file name
  },
});

const upload = multer({ storage: storage, limits: { fileSize: 10000000 } });




export function initUserRoutes(app: Express) {
  /* PUBLIC ROUTES */
  app.post(
    "/api/public/login",
    UserEp.authenticateWithEmailValidationRules(),
    UserEp.authenticateWithEmail
  );
  app.post(
    "/api/public/signup",
    upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
  ]),
    UserEp.signUpUser
  );
  app.get("/api/public/verify-email", UserEp.verifyEmail);


  /* AUTH ROUTES */
  app.get("/api/auth/get/user", UserEp.getUserDetails);

  app.post(
    "/api/auth/reset/password",
    UserEp.resetPasswordValidationRules(),
    UserEp.resetPassword
  );


}
