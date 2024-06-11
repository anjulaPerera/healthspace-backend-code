import { Types } from "mongoose";
import { ApplicationError } from "../common/application-error";
import { DUser, IUser } from "../models/user-model";
import User from "../schemas/user-schema";
import UserType from "../enums/UserType";

export namespace AdminDao {
  export async function registerAnUser(data: DUser): Promise<IUser> {
    const saveUser = new User(data);
    let userSaved = await saveUser.save();
    return userSaved;
  }

  export async function doesUserIdExists(userId: any) {
    const userFound = await User.findById(userId);
    return userFound;
  }

  export async function blockOrUnBlockUser(
    userId: Types.ObjectId,
    status: string
  ): Promise<IUser> {
    let updateUser: IUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          userStatus: status,
        },
      },
      { new: true }
    );

    return updateUser;
  }
  export async function verifyUser(
    userId: Types.ObjectId,
    status: string,
    isVerified: boolean,
    verificationToken: string
  ): Promise<IUser> {
    let updateUser: IUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          userStatus: status,
          isVerified: isVerified,
          verificationToken: verificationToken,
        },
      },
      { new: true }
    );

    return updateUser;
  }
  export async function deleteUser(userId: any): Promise<any> {
    await User.deleteOne({ _id: userId });
  }

  export async function getUsers() {
    const userFound = await User.find({
      userType: { $ne: UserType.SUPER_ADMIN },
    });
    return userFound;
  }
}
