// In backend/src/configuration/passport.ts
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import { UserModels } from "../models";
import bcrypt from "bcryptjs";
import { UserEnums } from "../enums";

// Configure JWT Strategy - FIXED VERSION
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET!,
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      // Your token payload has { id, emailAddress, role }
      const user = await UserModels.UserModel.findById(payload.id);

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

// Remove the Google and Local strategies if you're not using them
// Or keep them if you need them
