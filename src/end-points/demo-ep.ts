import Team from "../schemas/team-schema";
import Player from "../schemas/player-schema";
import Tournament from "../schemas/tournament-schema";
import { NextFunction, Request, Response } from "express";
import {
  check,
  param,
  ValidationChain,
  validationResult,
} from "express-validator";
import { DUser } from "../models/user-model";
import { AdminDao } from "../dao/admin-dao";
import LoginMethod from "../enums/LoginMethod";
import User from "../schemas/user-schema";
import { UserDao } from "../dao/user-dao";
import { Validations } from "../common/validation";
import UserType from "../enums/UserType";
import UserStatus from "../enums/UserStatus";
import { DemoDao } from "../dao/demo-dao";
import { DDemo, IDemo } from "../models/demo-model";
import { Util } from "../common/Util";
import DemoStatus from "../enums/DemoStatus";
import { Types } from "mongoose";
import Demo from "../schemas/demo-schema";
require("dotenv").config();

export namespace DemoEp {
  //block a user by admin validation rules
  export function registerForADemoValidationRules(): ValidationChain[] {
    return [
      Validations.email(),
      Validations.validString("name"),
      Validations.validString("message"),
    ];
  }

  export async function registerForADemo(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      //input validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(errors.array()[0]["msg"]);
      }

      //inputs
      const email = req.body.email;
      const name = req.body.name;

      //check if the mail is already used in the system
      const checkEmailExistence = await DemoDao.doesEmailExists(email);
      if (checkEmailExistence) {
        return res.sendError(
          "This Email has already Used For Registration, Please Log In!"
        );
      }

      //demo object
      const data: DDemo = {
        email: req.body.email,
        demoStatus: DemoStatus.PENDING,
        name: name,
        message: req.body.message,
      };

      //add demo mail to the system
      const addDemo = await DemoDao.registerForDemo(data);
      if (!addDemo) {
        return res.sendError("Adding Demo Mail Failed!");
      }

      //sends an email to admin
      Util.sendEmail(
        process.env.COMPANY_EMAIL,
        name + " requested to join CricView360",
        "Email : " + email + " ," + "name : " + name
      ).then(
        function (response) {
          if (response === 1) {
            console.log("Email Sent Successfully!");
          } else {
            console.log("Failed to Send The Email!");
          }
        },
        function (error) {
          console.log("Email Function Failed!");
          // return res.sendError("Email Function Failed!");
        }
      );

      res.sendSuccess(addDemo, "Successfully Registered!");
    } catch (err) {
      return res.sendError(err);
    }
  }

  export async function getAllDemoEmails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      //input validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(errors.array()[0]["msg"]);
      }

      const limit = Number(req.params.limit);
      const offset = Number(req.params.offset);

      //get user list
      const mailList = await DemoDao.getDemoMails(limit, offset);
      if (!mailList) {
        return res.sendError("Fetching Mail Addresses Failed");
      }

      res.sendSuccess(mailList, "Success!");
    } catch (err) {
      return res.sendError(err);
    }
  }

  export async function rejectADemoEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      //input validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(errors.array()[0]["msg"]);
      }

      const demoId = req.body.demoId;

      const rejectDemoId = await DemoDao.rejectDemoEmail(demoId);

      if (!rejectDemoId) {
        return res.sendError("Demo Email Rejection Failed");
      }

      res.sendSuccess(rejectDemoId, "Success!");
    } catch (err) {
      return res.sendError(err);
    }
  }
}
