import { Document } from "mongoose";
import { UserEnums } from "../enums";

// src/interfaces/user.ts
export interface User {
  _id: any;
  name: string;
  email: string;
  password: string;
  contactNumber?: string;
  role: string;
  status: string;
  lastLogin?: Date;
  isTemporaryPassword?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  googleId?: string;
  comparePassword?: (candidatePassword: string) => Promise<boolean>;
}
