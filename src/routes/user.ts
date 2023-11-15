import { Express } from "express";
import { UserEp } from "../end-points/user-ep";
import upload from "../middleware/upload-images";

export function initUserRoutes(app: Express) {
  /* PUBLIC ROUTES */
  app.post(
    "/api/public/login",
    UserEp.authenticateWithEmailValidationRules(),
    UserEp.authenticateWithEmail
  );
  app.post(
    "/api/public/signup",
    // UserEp.signUpWithEmailValidationRules(),

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
