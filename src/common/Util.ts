import * as bcrypt from "bcryptjs";
import { ValidationChain, param } from "express-validator";
const nodemailer = require("nodemailer");
import crypto from 'crypto';
require("dotenv").config();

export namespace Util {
  export function limitOffsetValidationRules(): ValidationChain[] {
    return [
      param("limit")
        .exists()
        .withMessage("limit is required")
        .isInt({ min: 1 })
        .withMessage("limit is not a valid integer"),
      param("offset")
        .exists()
        .withMessage("offset is required")
        .isInt({ min: 1 })
        .withMessage("offset is not a valid integer"),
    ];
  }
  export async function passwordHashing(password: string): Promise<any> {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  //sends email
  export async function sendEmail(
    email: string,
    subject: string,
    text: string,
    html?: string
  ) {
    try {
      let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER, // generated ethereal user
          pass: process.env.EMAIL_PASS, // generated ethereal password
        },
      });

      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: process.env.COMPANY_EMAIL, // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        // html: html, // html body
      });

      return 1;
    } catch (err) {
      console.log(err);
      return 0;
    }
  }
  





    export async function sendVerificationEmail(email: string, verificationToken: string): Promise<number> {
    try {
        
          const verificationLink = `${process.env.VERIFICATION_URL}?email=${email}&token=${verificationToken}`;

      
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false,
        auth: {
          user: process.env.MAIL_USERNAME, 
          pass: process.env.MAIL_PASSWORD, 
        },
  });
      let info = await transporter.sendMail({
        from: process.env.MAIL_FROM_ADDRESS, 
        to: email, 
        subject: 'CricView360 account verification',
        text: `Click on this link to verify your account: ${verificationLink}`, 
        // html: html, // html body
      });

      return 1;
    } catch (err) {
      console.log(err);
      return 0;
    }
      



}
   
 export function generateVerificationToken() {
  return crypto.randomBytes(32).toString('hex');
  }
  export async function sendPayLinkEmail(email: string, payLink: string): Promise<number> {
    try {
      
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false,
        auth: {
          user: process.env.MAIL_USERNAME, 
          pass: process.env.MAIL_PASSWORD, 
        },
  });
      let info = await transporter.sendMail({
        from: process.env.MAIL_FROM_ADDRESS, 
        to: email, 
        subject: 'CricView360 account verification',
        text: `Click on this link to verify your account: ${payLink}`, 
        // html: html, // html body
      });

      return 1;
    } catch (err) {
      console.log(err);
      return 0;
    }
      



}
}
