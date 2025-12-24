// src/schemas/user.ts - REMOVE the pre-save hook
import { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../interfaces/user";
import { UserEnums } from "../enums";

const userSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
      minlength: [6, "Password must be at least 6 characters"],
    },
    contactNumber: {
      type: String,
      trim: true,
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
    },
    role: {
      type: String,
      enum: {
        values: Object.values(UserEnums.UserRole),
        message: "Invalid role specified",
      },
      default: UserEnums.UserRole.USER,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(UserEnums.UserStatus),
        message: "Invalid status specified",
      },
      default: UserEnums.UserStatus.ACTIVE,
    },
    lastLogin: Date,
    isTemporaryPassword: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret: any) {
        delete ret.password;
        return ret;
      },
    },
  }
);

/* Compare password method */
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    const user = this as User & { password?: string };

    // Since password is select: false, we might need to fetch it
    if (!user.password) {
      // Use type assertion for Mongoose document
      const UserModel = (this as any).constructor;
      const userWithPassword = await UserModel.findById(
        (this as any)._id
      ).select("+password");
      if (!userWithPassword || !userWithPassword.password) return false;
      return bcrypt.compare(candidatePassword, userWithPassword.password);
    }

    return bcrypt.compare(candidatePassword, user.password);
  } catch (error) {
    console.error("Password comparison error:", error);
    return false;
  }
};

export { userSchema };
