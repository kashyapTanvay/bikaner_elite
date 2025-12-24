import { model } from "mongoose";
import { UserSchemas } from "../schemas";
import { UserInterfaces } from "../interfaces";
import { dbEnums } from "../enums";

const UserModel = model<UserInterfaces.User>(
  dbEnums.Model.USER,
  UserSchemas.userSchema
);
export { UserModel };
