import * as mongoose from "mongoose";
import { Types } from "mongoose";

interface Common {
  name?: string;
  email?: string;
  userType?: string;
  password?: string;
  userStatus?: string;
  packageBought?: string;
  isVerified?: boolean;
  verificationToken?: string;
  paymentState?: string;
  paymentLink?: string;
}

export interface DUser extends Common {
  _id?: Types.ObjectId;
}

export interface IUser extends Common, mongoose.Document {
  createAccessToken(expiresIn?: string): string;

  comparePassword(password: string): Promise<boolean>;
}
