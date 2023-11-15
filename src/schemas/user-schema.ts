import * as mongoose from "mongoose";
import { Schema } from "mongoose";
import * as bcrypt from "bcryptjs";
import { IUser } from "../models/user-model";
import UserStatus from "../enums/UserStatus";
const jwt = require("jsonwebtoken");

export const UserSchemaOptions: mongoose.SchemaOptions = {
  _id: true,
  id: false,
  timestamps: true,
  skipVersioning: true,
  strict: false,
  toJSON: {
    getters: true,
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.password;
    },
  },
};

export const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: Schema.Types.String,
      required: false,
    },

    userType: {
      type: Schema.Types.String,
      required: false,
    },

    password: {
      type: Schema.Types.String,
      unique: true,
      required: false,
    },
    userStatus: {
      type: String,
      enum: UserStatus,
      default: UserStatus.ACTIVE,
    },
    packageBought: {
      type: Schema.Types.String,
      required: false,
    },
    isVerified: {
      type: Schema.Types.Boolean,
      required: false,
    },
    verificationToken: {
      type: Schema.Types.String,
      required: false,
    },

    paymentLink: {
      type: Schema.Types.String,
      required: false,
    },
    profilePicture: {
      type: Schema.Types.String,
      required: false,
    },
    coverImage: {
      type: Schema.Types.String,
      required: false,
    },
    email: {
      type: Schema.Types.String,
      required: true,
    }
  },
  UserSchemaOptions
);

userSchema.pre("save", function (next) {
  const user: any = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  // noinspection JSIgnoredPromiseFromCall
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    // noinspection JSIgnoredPromiseFromCall
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

userSchema.methods.createAccessToken = function (expiresIn: string) {
  return jwt.sign({ user_id: this._id }, process.env.JWT_SECRET, {
    expiresIn: expiresIn,
  });
};

userSchema.methods.comparePassword = function (
  password: any
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    // noinspection JSIgnoredPromiseFromCall
    bcrypt.compare(password, this.password, function (err, isMatch) {
      if (err) {
        return reject(err);
      }
      return resolve(isMatch);
    });
  });
};

const User = mongoose.model<IUser>("User", userSchema);
export default User;
