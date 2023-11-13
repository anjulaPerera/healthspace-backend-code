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
  





  export async function sendVerificationEmail(
    email: string,
    verificationToken: string
  ): Promise<number> {
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

const htmlBody = `
  <table width="500" height="400" cellpadding="0" cellspacing="0" style="box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); background-color:transparent; border-radius:8px;">
    <tr>
      <td colspan="2" style="background-color:#08273e; border-radius:8px 8px 0 0; text-align:center; color:white; height:70px;">
        <h2>Email Verification</h2>
      </td>
    </tr>
    <tr>
      <td colspan="2" style="text-align:center;">
        <h4>Please click the button below to verify your email!</h4>
         <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
         <p style="font-size: 10px;">*This will take you to the login page</p>
      </td>
    </tr>
  
    <tr>
      <td colspan="2" style="background-color: #08273e; border-radius:0 0 8px 8px; text-align:start; color:white; height:70px;">
        <p style="margin-left:20px;">&copy; ${new Date().getFullYear()} HealthSpace |  All rights reserved</p>
      </td>
    </tr>
  </table>
`;


      let info = await transporter.sendMail({
        from: process.env.MAIL_FROM_ADDRESS,
        to: email,
        subject: "HealthSpace account verification",
        html: htmlBody, 
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
