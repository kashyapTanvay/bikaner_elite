import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { URLConfiguration } from "../configuration";
import { UserModels } from "../models";
import { ApplicationEnums, UserEnums } from "../enums";
import { generateToken } from "../utility/jwt";

const userController = Router();

/* Get All Users with Pagination, Search, and Filters */
userController.get(
  `${URLConfiguration.API.USER}`,
  async (req: Request, res: Response) => {
    try {
      // Extract pagination and filter parameters
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sortBy = (req.query.sortBy as string) || "createdAt";
      const sortOrder = (req.query.sortOrder as string) === "asc" ? 1 : -1;
      const search = (req.query.search as string) || "";
      const role = req.query.role as string;
      const status = req.query.status as string;

      // Calculate skip value
      const skip = (page - 1) * limit;

      // Build filter
      let filter: any = {};

      // Search filter
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { contactNumber: { $regex: search, $options: "i" } },
        ];
      }

      // Role filter
      if (role && Object.values(UserEnums.UserRole).includes(role as any)) {
        filter.role = role;
      }

      // Status filter
      if (
        status &&
        Object.values(UserEnums.UserStatus).includes(status as any)
      ) {
        filter.status = status;
      }

      // Get total count
      const totalUsers = await UserModels.UserModel.countDocuments(filter);
      const totalPages = Math.ceil(totalUsers / limit);

      // Fetch users
      const users = await UserModels.UserModel.find(filter)
        .select("-password")
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean();

      // Pagination metadata
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      return res.status(ApplicationEnums.StatusCode.SUCCESS).json({
        success: true,
        data: users,
        pagination: {
          total: totalUsers,
          totalPages,
          currentPage: page,
          pageSize: limit,
          hasNextPage,
          hasPrevPage,
          nextPage: hasNextPage ? page + 1 : null,
          prevPage: hasPrevPage ? page - 1 : null,
        },
        message: "Users fetched successfully",
      });
    } catch (error: any) {
      console.error("Error fetching users:", error);
      return res
        .status(ApplicationEnums.StatusCode.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          message: "Failed to fetch users",
          error: error.message,
        });
    }
  }
);

/* Login */
userController.post(
  `${URLConfiguration.API.USER}/login`,
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      const user = await UserModels.UserModel.findOne({ email }).select(
        "+password"
      );

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // FIX: Check if comparePassword exists before calling it
      if (!user.comparePassword) {
        return res.status(500).json({
          success: false,
          message: "Server configuration error",
        });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      if (user.status !== UserEnums.UserStatus.ACTIVE) {
        return res.status(403).json({
          success: false,
          message: `Account is ${user.status}. Please contact administrator.`,
        });
      }

      // Update last login
      await UserModels.UserModel.updateOne(
        { _id: user._id },
        { $set: { lastLogin: new Date() } }
      );

      const token = generateToken(user);

      // Remove password from response - FIX: Use type assertion
      const userResponse = user.toObject();
      if ("password" in userResponse) {
        delete (userResponse as any).password;
      }

      return res.json({
        success: true,
        token,
        user: userResponse,
        message: "Login successful",
      });
    } catch (error: any) {
      console.error("Login error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
);

/* Register Customer */
userController.post(
  `${URLConfiguration.API.USER}/register`,
  async (req: Request, res: Response) => {
    try {
      const { name, email, contactNumber, password } = req.body;

      // Validation
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Name, email, and password are required",
        });
      }

      // Check if user exists
      const existingUser = await UserModels.UserModel.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "User already exists with this email",
        });
      }

      // Hash password in controller
      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = new UserModels.UserModel({
        name,
        email,
        contactNumber,
        password: hashedPassword, // Already hashed
        role: UserEnums.UserRole.USER,
        status: UserEnums.UserStatus.ACTIVE,
        isTemporaryPassword: false, // Regular registration
      });

      await newUser.save();

      const token = generateToken(newUser);
      const userResponse = newUser.toObject();
      if ("password" in userResponse) {
        delete (userResponse as any).password;
      }

      return res.status(ApplicationEnums.StatusCode.CREATED).json({
        success: true,
        message: "User registered successfully",
        token,
        user: userResponse,
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      return res.status(500).json({
        success: false,
        message: "Registration failed",
        error: error.message,
      });
    }
  }
);

/* Create Staff Account (Admin Only) */
userController.post(
  `${URLConfiguration.API.USER}/staff`,
  async (req: Request, res: Response) => {
    try {
      const {
        name,
        email,
        contactNumber,
        role = UserEnums.UserRole.STAFF,
      } = req.body;

      // Validation
      if (!name || !email || !contactNumber) {
        return res.status(400).json({
          success: false,
          message: "Name, email, and contact number are required",
        });
      }

      // Validate role
      if (!Object.values(UserEnums.UserRole).includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role specified",
        });
      }

      // Check if user exists
      const existingUser = await UserModels.UserModel.findOne({
        $or: [{ email }, { contactNumber }],
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message:
            existingUser.email === email
              ? "Email already registered"
              : "Contact number already registered",
        });
      }

      // Generate temporary password
      const tempPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(tempPassword, 12);

      const newStaff = new UserModels.UserModel({
        name,
        email,
        contactNumber,
        password: hashedPassword, // Already hashed in controller
        role,
        status: UserEnums.UserStatus.ACTIVE,
        isTemporaryPassword: true, // Flag for temporary password
      });

      await newStaff.save();

      // Remove password from response
      const staffResponse = newStaff.toObject();
      if ("password" in staffResponse) {
        delete (staffResponse as any).password;
      }

      return res.status(ApplicationEnums.StatusCode.CREATED).json({
        success: true,
        message: "Staff account created successfully",
        data: {
          user: staffResponse,
          temporaryPassword: tempPassword, // Return plain text temp password
          instructions:
            "Share this temporary password with the staff member. They should change it on first login.",
        },
      });
    } catch (error: any) {
      console.error("Staff creation error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to create staff account",
        error: error.message,
      });
    }
  }
);

/* Update User Status */
userController.patch(
  `${URLConfiguration.API.USER}/:userId/status`,
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { status } = req.body;

      if (
        !status ||
        !Object.values(UserEnums.UserStatus).includes(status as any)
      ) {
        return res.status(400).json({
          success: false,
          message: "Valid status is required",
        });
      }

      const updatedUser = await UserModels.UserModel.findByIdAndUpdate(
        userId,
        { status },
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
        message: `User status updated to ${status}`,
      });
    } catch (error: any) {
      console.error("Status update error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update user status",
        error: error.message,
      });
    }
  }
);

/* Update User Role */
userController.patch(
  `${URLConfiguration.API.USER}/:userId/role`,
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!role || !Object.values(UserEnums.UserRole).includes(role as any)) {
        return res.status(400).json({
          success: false,
          message: "Valid role is required",
        });
      }

      const updatedUser = await UserModels.UserModel.findByIdAndUpdate(
        userId,
        { role },
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
        message: `User role updated to ${role}`,
      });
    } catch (error: any) {
      console.error("Role update error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update user role",
        error: error.message,
      });
    }
  }
);

/* Delete User */
userController.delete(
  `${URLConfiguration.API.USER}/:userId`,
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      const deletedUser = await UserModels.UserModel.findByIdAndDelete(userId);

      if (!deletedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.json({
        success: true,
        message: "User deleted successfully",
        data: { userId },
      });
    } catch (error: any) {
      console.error("Delete user error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to delete user",
        error: error.message,
      });
    }
  }
);

/* Bulk Update Users */
userController.patch(
  `${URLConfiguration.API.USER}/bulk/update`,
  async (req: Request, res: Response) => {
    try {
      const { userIds, status, role } = req.body;

      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: "User IDs array is required",
        });
      }

      const updateData: any = {};
      if (
        status &&
        Object.values(UserEnums.UserStatus).includes(status as any)
      ) {
        updateData.status = status;
      }
      if (role && Object.values(UserEnums.UserRole).includes(role as any)) {
        updateData.role = role;
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          success: false,
          message: "Either status or role must be provided for update",
        });
      }

      const result = await UserModels.UserModel.updateMany(
        { _id: { $in: userIds } },
        updateData
      );

      return res.json({
        success: true,
        message: `${result.modifiedCount} users updated successfully`,
        data: result,
      });
    } catch (error: any) {
      console.error("Bulk update error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update users",
        error: error.message,
      });
    }
  }
);

/* Get User by ID */
userController.get(
  `${URLConfiguration.API.USER}/:userId`,
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      const user = await UserModels.UserModel.findById(userId).select(
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
        message: "User fetched successfully",
      });
    } catch (error: any) {
      console.error("Get user error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch user",
        error: error.message,
      });
    }
  }
);

export default userController;
