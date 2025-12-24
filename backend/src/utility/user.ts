// backend/src/utilities/user.ts

import { UserModels } from "../models";
import bcrypt from "bcryptjs";
import { logger } from "./logger";
import { UserEnums } from "../enums";
import { generateToken } from "./jwt";
export const createSuperAdminUser = async () => {
  const superAdminUser = await UserModels.UserModel.findOne({
    email: "super_admin@root.com",
  });

  if (superAdminUser) {
    logger.info("Super admin user already exists");
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash("root", 10);
    const newSuperAdminUser = new UserModels.UserModel({
      name: "Super Admin",
      email: "super_admin@root.com",
      password: hashedPassword,
      contactNumber: "1234567890",
      city: "Patna",
      state: "Bihar",
      role: UserEnums.UserRole.SUPERADMIN,
      status: UserEnums.UserStatus.ACTIVE,
      isVerified: true, // Super admin doesn't need verification
      isHideEmailAddress: false,
      isHideContactNumber: false,
    });

    await newSuperAdminUser.save();
    logger.info("Super admin user created successfully");

    // Generate token (though it's not used here, it's good practice)
    generateToken(newSuperAdminUser);
  } catch (error) {
    logger.error("Error creating super admin user:", error);
    throw error; // Let the application fail if super admin can't be created
  }
};

export const allUserRole = [
  UserEnums.UserRole.ADMIN,
  UserEnums.UserRole.INTERN,
  UserEnums.UserRole.MANAGER,
  UserEnums.UserRole.STAFF,
  UserEnums.UserRole.USER,
  UserEnums.UserRole.SUPERADMIN,
];
