import { Express } from "express";
import { UserEp } from "../end-points/user-ep";

export function initUserRoutes(app: Express) {
  /* PUBLIC ROUTES */
  app.post(
    "/api/public/login",
    UserEp.authenticateWithEmailValidationRules(),
    UserEp.authenticateWithEmail
  );
  app.post(
    "/api/public/signup",
    UserEp.signUpWithEmailValidationRules(),
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

  app.post(
    "/api/auth/plan-upgrade/silver/request",
    UserEp.sendChangePlanRequestSilver
  );
  app.post(
    "/api/auth/plan-upgrade/gold/request",
    UserEp.sendChangePlanRequestGold
  );
  app.post(
    "/api/auth/plan-upgrade/paylink",
    UserEp.sendPayLink
  );

  app.get("/api/auth/get/free-users", UserEp.getFreeUsers);
  app.get("/api/auth/get/silver-users", UserEp.getSilverUsers);
  app.get("/api/auth/get/gold-users", UserEp.getGoldUsers);
  
}
