// backend/src/utilities/jwt.ts
import jwt from "jsonwebtoken";
import { UserModels } from "../models";

export const generateToken = (
  user: InstanceType<typeof UserModels.UserModel>
) => {
  return jwt.sign(
    {
      id: user._id,
      emailAddress: user.email,
      role: user?.role,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "30d" }
  );
};
export const generateRefreshToken = (
  user: InstanceType<typeof UserModels.UserModel>
) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "30d",
  });
};
export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!) as {
    id: string;
    emailAddress: string;
    role: string;
    iat: number;
    exp: number;
  };
};

export const decodeToken = (token: string) => {
  return jwt.decode(token) as {
    id: string;
    emailAddress: string;
    role: string;
    iat: number;
    exp: number;
  } | null;
};
