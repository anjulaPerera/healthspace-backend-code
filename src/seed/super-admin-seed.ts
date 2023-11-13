import UserStatus from "../enums/UserStatus";
import UserType from "../enums/UserType";
import { DUser } from "../models/user-model";
import User from "../schemas/user-schema";

export default async function seedSuperAdmin() {
  const data01: DUser = {
    name: "super admin",
    email: "superadmin@tempmail.com",
    userType: UserType.SUPER_ADMIN,
    password: "abc123",
    userStatus: UserStatus.ACTIVE,
  };

  const superAdmin = await createSuperAdmin(data01);

  return [superAdmin];
}

async function createSuperAdmin(data: DUser) {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    return existingUser;
  }
  return await User.create(data);
}
