import { Express } from "express";
import { Authentication } from "../middleware/authentication";
import { DemoEp } from "../end-points/demo-ep";
import { Util } from "../common/Util";

export function initDemoRoutes(app: Express) {
  /* PUBLIC ROUTES */
  app.post(
    "/api/public/register/demo",
    DemoEp.registerForADemoValidationRules(),
    DemoEp.registerForADemo
  );

  /* AUTH ROUTES */
  app.get(
    "/api/auth/get/demo-mails/:limit/:offset",
    Authentication.superAdminUserVerification,
    Util.limitOffsetValidationRules(),
    DemoEp.getAllDemoEmails
  );

  app.post(
    "/api/auth/reject/demo",
    Authentication.superAdminUserVerification,
    DemoEp.rejectADemoEmail
  );
}
