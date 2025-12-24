import { Router, Request, Response } from "express";
import { URLConfiguration } from "../configuration";
import { AuthenticateAndAuthorize } from "../middlewares/authentication";
import { allUserRole } from "../utility/user";
import { UserModels } from "../models";
import { UserInterfaces } from "../interfaces";
import bcrypt from "bcryptjs";

const profileController = Router();

/* Get Current User Profile */
profileController.get(
  `${URLConfiguration.API.PROFILE}`,
  AuthenticateAndAuthorize(allUserRole),
  async (req: Request, res: Response) => {
    try {
      const loggedInuser: any = req?.user;
      const loggedInuserId = loggedInuser?._id; // Assuming you have auth middleware

      if (!loggedInuserId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const user = await UserModels.UserModel.findById(loggedInuserId).select(
        "-password"
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.json({
        success: true,
        data: user,
        message: "Profile fetched successfully",
      });
    } catch (error: any) {
      console.error("Get profile error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch profile",
        error: error.message,
      });
    }
  }
);

/* Update Profile */
profileController.patch(
  `${URLConfiguration.API.PROFILE}`,
  AuthenticateAndAuthorize(allUserRole),
  async (req: Request, res: Response) => {
    try {
      const loggedInuser: UserInterfaces.User | any = req?.user;
      const loggedInuserId = loggedInuser?._id.toString(); // From auth middleware
      const { name, email, contactNumber } = req.body;
      console.log("in function of changing", req.body);
      if (!loggedInuserId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      // Check if email is being changed and if it's already taken
      if (email) {
        const existingUser = await UserModels.UserModel.findOne({
          email,
          _id: { $ne: loggedInuserId },
        });

        if (existingUser) {
          return res.status(409).json({
            success: false,
            message: "Email already in use",
          });
        }
      }

      const updatedUser = await UserModels.UserModel.findByIdAndUpdate(
        loggedInuserId,
        {
          name,
          email,
          contactNumber,
          ...(email && { emailVerified: false }), // Reset email verification if email changed
        },
        { new: true, runValidators: true }
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.json({
        success: true,
        data: updatedUser,
        message: "Profile updated successfully",
      });
    } catch (error: any) {
      console.error("Update profile error:", error);

      if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map(
          (err: any) => err.message
        );
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to update profile",
        error: error.message,
      });
    }
  }
);
/* Update Password */
profileController.patch(
  `${URLConfiguration.API.PROFILE}/password`,
  AuthenticateAndAuthorize(allUserRole),
  async (req: Request, res: Response) => {
    try {
      const loggedInuser: UserInterfaces.User | any = req?.user;
      const loggedInuserId = loggedInuser?._id.toString();
      const { currentPassword, newPassword } = req.body;
      console.log("in password change function", req.user, loggedInuserId);
      if (!loggedInuserId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password and new password are required",
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "New password must be at least 6 characters",
        });
      }
      console.log("in password change function");
      // Get user with password
      const user = await UserModels.UserModel.findById(loggedInuserId).select(
        "+password"
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Verify current password
      if (!user.comparePassword) {
        return res.status(500).json({
          success: false,
          message: "Server configuration error",
        });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update password
      await UserModels.UserModel.findByIdAndUpdate(loggedInuserId, {
        password: hashedPassword,
        isTemporaryPassword: false, // Reset temporary password flag
      });

      return res.json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error: any) {
      console.error("Update password error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update password",
        error: error.message,
      });
    }
  }
);

/* Upload Profile Image */
profileController.patch(
  `${URLConfiguration.API.PROFILE}/image`,
  async (req: Request, res: Response) => {
    try {
      const loggedInuser: UserInterfaces.User | any = req?.user;
      const loggedInuserId = loggedInuser._id;

      if (!loggedInuserId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      // TODO: Implement file upload logic (using multer/multer-s3)
      // For now, return a placeholder
      const profileImage = `https://ui-avatars.com/api/?name=User&background=e53e3e&color=fff&size=256`;

      const updatedUser = await UserModels.UserModel.findByIdAndUpdate(
        loggedInuserId,
        { profileImage },
        { new: true }
      ).select("-password");

      return res.json({
        success: true,
        data: updatedUser,
        message: "Profile image updated successfully",
      });
    } catch (error: any) {
      console.error("Upload image error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to upload profile image",
        error: error.message,
      });
    }
  }
);

/* Remove Profile Image */
profileController.delete(
  `${URLConfiguration.API.PROFILE}/image`,
  async (req: Request, res: Response) => {
    try {
      const loggedInuser: UserInterfaces.User | any = req?.user;
      const loggedInuserId = loggedInuser._id;

      if (!loggedInuserId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const updatedUser = await UserModels.UserModel.findByIdAndUpdate(
        loggedInuserId,
        { profileImage: null },
        { new: true }
      ).select("-password");

      return res.json({
        success: true,
        data: updatedUser,
        message: "Profile image removed successfully",
      });
    } catch (error: any) {
      console.error("Remove image error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to remove profile image",
        error: error.message,
      });
    }
  }
);
export default profileController;
