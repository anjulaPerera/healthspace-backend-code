import { check } from "express-validator";
import { Types } from "mongoose";
let dateTime = new Date();

export const Validations = {
  email: () =>
    check("email")
      .not()
      .isEmpty()
      .withMessage("Email is required!")
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false })
      .withMessage("Invalid email address!"),
  phone: () =>
    check("phone")
      .isMobilePhone("en-US")
      .withMessage("Phone number is invalid or outside the US"),
  website: () => check("website").optional(),
  company: () =>
    check("company")
      .isString()
      .isLength({ max: 1000 })
      .withMessage("Company field should not be more than 1000 chars long!"),
  password: () =>
    check("password")
      .isString()
      .not()
      .isEmpty()
      .withMessage("Password is required!")
      .isLength({ min: 6, max: 40 })
      .withMessage(
        "Password must be at least 6 chars long & not more than 40 chars long!"
      )
      .not()
      .isIn(["123", "password", "god", "abc"])
      .withMessage("Do not use a common word as the password")
      .matches(/\d/)
      .withMessage("Password must contain a number!"),
  newPassword: () =>
    check("newPassword")
      .isString()
      .not()
      .isEmpty()
      .withMessage("New Password is required!")
      .isLength({ min: 6, max: 40 })
      .withMessage(
        "New Password must be at least 6 chars long & not more than 40 chars long!"
      )
      .not()
      .isIn(["123", "password", "god", "abc"])
      .withMessage("Do not use a common word as the New password")
      .matches(/\d/)
      .withMessage("New Password must contain a number!"),
  name: () =>
    check("name")
      .isString()
      .isLength({ max: 1000 })
      .withMessage("Name field should not be more than 1000 chars long!"),
  text: (key: string) => check(key).isString().isLength({ max: 1000 }),

  largeText: (key: string) => check(key).isString().isLength({ max: 10000 }),
  noPermissions: () => check("permissions").not().exists(),
  zip: () => check("zip").isPostalCode("US").withMessage("Invalid zip code!"),
  currency: (key: string = "price") => check(key).not().isEmpty().isNumeric(),
  objectId: (key: string = "_id") =>
    check(key)
      .not()
      .isEmpty()
      .withMessage(`${key} cannot be empty`)
      .custom((v) => isObjectId(v))
      .withMessage(`${key} is not a valid mongoDb objectID`),
  uploads: (key: string = "uploads") =>
    check(`${key}.*._id`)
      .not()
      .isEmpty()
      .withMessage(`${key} objects cannot be empty`)
      .custom((v) => isObjectId(v))
      .withMessage(`${key} objects are invalid`),
  validString: (key: string) =>
    check(key)
      .notEmpty()
      .withMessage(`${key} is required`)
      .isString()
      .withMessage(`${key} is not a string`),
  validDate: (key: string) =>
    check(key).isISO8601().withMessage(`${key} is not a valid date`),
};

export function isObjectId(v: string): boolean {
  return Types.ObjectId.isValid(v) && Types.ObjectId(v).toHexString() === v;
}
