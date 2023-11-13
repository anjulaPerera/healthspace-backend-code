const passport = require("passport");
import { NextFunction, Request, Response } from "express";
import UserType from "../enums/UserType";

export class Authentication {
  public static verifyToken(req: Request, res: Response, next: NextFunction) {
    return passport.authenticate(
      "jwt",
      { session: false },
      (err: any, user: any, info: any) => {
        if (err || !user) {
          // AppLogger.error(`Login Failed. reason: ${info}`);
          console.log(`Login Failed. reason: ${info}`);
          return res.sendError(info);
        }

        req.user = user;
        req.body.user = user._id;

        //console.log(req.user);
        return next();
      }
    )(req, res, next);
  }

  //Admin user validation
  public static superAdminUserVerification(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const userData: any = req.user;
    if (userData.userType === UserType.SUPER_ADMIN) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "No authorization to access this route!",
      });
    }
  }

  //level01 user validation
  public static level01UserVerification(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const userData: any = req.user;
    if (
      userData.userType === UserType.LEVEL01 ||
      userData.userType === UserType.SUPER_ADMIN

    ) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "No authorization to access this route!",
      });
    }
  }
  //level02 user validation
  public static level02UserVerification(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const userData: any = req.user;
    if (
      userData.userType === UserType.LEVEL02 ||
      userData.userType === UserType.SUPER_ADMIN
    ) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "No authorization to access this route!",
      });
    }
  }
}
