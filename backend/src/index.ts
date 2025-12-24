/// <reference path="./types/env.d.ts" />

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import {
  FileControllers,
  ProfileControllers,
  UserControllers,
} from "./controller";
import { logger } from "./utility/logger";
import { URLConfiguration } from "./configuration";
import { createSuperAdminUser } from "./utility/user";
import passport from "passport";
import "./configuration/passport";
// ======================================================
// App & Environment
// ======================================================
const app = express();

const PORT = Number(process.env.PORT) || 8080;
const isDevelopment = process.env.NODE_ENV === "development";

// ======================================================
// MongoDB Connection (with retry)
// ======================================================
const connectWithRetry = async () => {
  const mongoUri =
    process.env.NODE_ENV === "production"
      ? process.env.MONGO_URI_PROD
      : process.env.MONGO_URI_DEV;

  if (!mongoUri) {
    logger.error("❌ MongoDB URI is not defined");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      retryReads: true,
      retryWrites: true,
    });

    logger.info("✅ MongoDB connected");
  } catch (error) {
    logger.error("❌ MongoDB connection failed. Retrying in 5s...", error);
    setTimeout(connectWithRetry, 5000);
  }
};

mongoose.connection.on("disconnected", () => {
  logger.warn("⚠️ MongoDB disconnected");
});

// ======================================================
// Security Middlewares
// ======================================================

// Helmet (security headers)
app.use(helmet());

// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isDevelopment ? 100000 : 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// ======================================================
// CORS (EXPRESS 5 SAFE – NO "*")
// ======================================================

const allowedOrigins: string[] = [
  process.env.NODE_ENV === "production"
    ? process.env.CORS_ORIGIN_PROD
    : process.env.CORS_ORIGIN_DEV,
  "http://localhost:5173",
].filter((origin): origin is string => Boolean(origin));
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman, curl, server-to-server
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // IMPORTANT: do NOT throw an error
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"],
    maxAge: 86400,
  })
);

// ======================================================
// Body Parsers
// ======================================================
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(passport.initialize());

// ======================================================
// Routes
// ======================================================

// Root
app.get("/", (_req, res) => {
  res.send("Bikaner Elite Backend is running 🚀");
});

// Health check
app.get("/health", async (_req, res) => {
  try {
    if (!mongoose.connection?.db) {
      throw new Error("MongoDB not connected");
    }

    await mongoose.connection.db.admin().ping();

    res.status(200).json({
      status: "healthy",
      dbStatus: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "unhealthy",
      dbStatus: "disconnected",
      message: isDevelopment ? (error as Error).message : undefined,
      timestamp: new Date().toISOString(),
    });
  }
});

app.use((req, _res, next) => {
  console.log("➡️ Incoming:", req.method, req.url);
  next();
});

// API routes
app.use(URLConfiguration.API.BASE_URL, UserControllers);
app.use(URLConfiguration.API.BASE_URL, ProfileControllers);
app.use(URLConfiguration.API.BASE_URL, FileControllers);
// ======================================================
// Global Error Handler
// ======================================================
app.use((err: any, _req: any, res: any, _next: any) => {
  logger.error("Unhandled error:", err);

  res.status(500).json({
    error: "Internal Server Error",
    message: isDevelopment ? err.message : "Something went wrong",
  });
});

// ======================================================
// Server Bootstrap
// ======================================================
(async () => {
  try {
    await connectWithRetry();
    await createSuperAdminUser();

    app.listen(PORT, () => {
      logger.info(
        `🚀 Server running in ${
          isDevelopment ? "DEVELOPMENT" : "PRODUCTION"
        } mode on port ${PORT}`
      );
    });
  } catch (error) {
    logger.error("❌ Application startup failed:", error);
    process.exit(1);
  }
})();

// ======================================================
// Process Safety
// ======================================================
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  if (!isDevelopment) process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection:", reason);
});

export default app;
