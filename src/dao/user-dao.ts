import { Types } from "mongoose";
import { ApplicationError } from "../common/application-error";
import { DUser, IUser } from "../models/user-model";
import User from "../schemas/user-schema";

export namespace UserDao {
  export async function doesUserExist(email: string) {
    const userFound = await User.findOne({ email: email });
    return userFound;
  }

  export async function registerAnUser(data: DUser): Promise<IUser> {
  try {
    const saveUser = new User(data);
    const userSaved = await saveUser.save();
    return userSaved;
  } catch (error) {
    console.error('Error saving user:', error);
    throw error;
  }
}


  export async function loginWithEmail(
    email: string,
    password: string,
    medium: string,
    remember: boolean,
    user: any
  ): Promise<any> {
    const isMatch = await user.comparePassword(password);
    if (isMatch) {
      var tokenString = await user.createAccessToken(
        remember ? "365 days" : "24 hours"
      );

      return {
        token: tokenString,
      };
    } else {
      throw new ApplicationError("Incorrect email/password combination!");
    }
  }

  export async function updateToANewPassword(
    userId: Types.ObjectId,
    password: string
  ): Promise<IUser> {
    let updatePassword: IUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        password: password,
      },
      { new: true }
    );

    return updatePassword;
  }

  export async function getUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email: email });
  }
  export async function getUserById(id: any): Promise<IUser | null> {
    return await User.findOne({ _id: id });
  }
  export async function getUsersByFreePackage(): Promise<IUser[]> {
    return await User.find({ packageBought: "FREE" }).exec();
  }
  export async function getUsersBySilverPackage(): Promise<IUser[]> {
    return await User.find({ packageBought: "SILVER" }).exec();
  }
  export async function getUsersByGoldPackage(): Promise<IUser[]> {
    return await User.find({ packageBought: "GOLD" }).exec();
  }
}
