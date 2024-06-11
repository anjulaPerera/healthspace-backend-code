import { Express } from "express";
import { AdminEp } from "../end-points/admin-ep";
import { Authentication } from "../middleware/authentication";
import { Util } from "../common/Util";

export function initAdminRoutes(app: Express) {
  /* PUBLIC ROUTES */

  /* AUTH ROUTES */
  app.post(
    "/api/auth/create/user",
    Authentication.superAdminUserVerification,
    AdminEp.createAnUserByAdminValidationRules(),
    AdminEp.createAnUserByAdmin
  );

  //this route is to block or unblock users for admin
  app.post(
    "/api/auth/update/user-status",
    Authentication.superAdminUserVerification,
    AdminEp.blockAUserByAdminValidationRules(),
    AdminEp.blockAUserByAdmin
  );

  app.get(
    "/api/auth/get/user-list",
    Authentication.superAdminUserVerification,
    AdminEp.getAllUserList
  );

  app.post(
    "/api/auth/delete/user/:userId",
    Authentication.superAdminUserVerification,
    AdminEp.deleteUser
  );

}
