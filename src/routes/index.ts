import { Express, Request, Response } from "express";
import { initTournamentRoutes } from "./tournament";
import { initTeamRoutes } from "./team";
import { initMatchRoutes } from "./match";
import { initUserRoutes } from "./user";
import { initAdminRoutes } from "./admin";
import { initDemoRoutes } from "./demo";

export function initRoutes(app: Express) {
  app.get("/", (req: Request, res: Response) => {
    res.send("Well done!");
  });

  initTournamentRoutes(app);
  initTeamRoutes(app);
  initMatchRoutes(app);
  initUserRoutes(app);
  initAdminRoutes(app);
  initDemoRoutes(app);

  /* ALL INVALID REQUESTS */
  app.get("/", (req: Request, res: Response) => res.redirect(301, "/api/v1"));
  // app.all('*', (req: Request, res: Response) => res.sendError("Invalid Route"));
}
