
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
import { Util } from "../common/Util";
import UserStatus from "../enums/UserStatus";
const { ObjectId } = require("mongodb");

export namespace PostsEp {
  export function postValidationRules(): ValidationChain[] {
    return [
      check("loginMethod")
        .notEmpty()
        .withMessage("loginMethod is required")
        .isString()
        .withMessage("loginMethod is not a String")
        .isIn([LoginMethod.EMAIL])
        .withMessage("loginMethod is not valid type"),
      check("remember")
        .notEmpty()
        .withMessage("remember is required")
        .isString()
        .withMessage("remember is not a String")
        .isIn(["TRUE", "FALSE"])
        .withMessage("remember is not valid type"),
    ];
  }



  export async function createPost(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(errors.array()[0]["msg"]);
      }

      const isCustomerFound = await UserDao.doesUserExist(req.body.email);
      if (isCustomerFound) {
        return res.sendError("Sorry This Email Already Exists");
      }

      const name = req.body.name;
      const email = req.body.email;
      const dob = req.body.dob;
      const city = req.body.city;
      const phone = req.body.phone;  
      const userType = req.body.userType;
      const password = req.body.password;
      const isVerified = false;
      const occupation = req.body.occupation;
      

      const verificationToken = Util.generateVerificationToken();

      const userData: DUser = {
        name: name,
        email: email,
        userType: userType,
        password: password,
        userStatus: UserStatus.PENDING_VERIFICATION,
        isVerified: isVerified,
        verificationToken: verificationToken,
        dob: dob,
        city: city,
        phone: phone,
        occupation: occupation,

      };

      const saveUser = await AdminDao.registerAnUser(userData);
      if (!saveUser) {
        return res.sendError("Registration failed");
      }

    

      console.log("saveUser", saveUser);
      return res.sendSuccess(saveUser, "User Registered!");
    } catch (err) {
      return res.sendError(err);
    }
  }

    export async function getUserDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      res.sendSuccess(req.user, "User Found!");
    } catch (err) {
      return res.sendError("Something Went Wrong!!");
    }
  }


 
 
}
