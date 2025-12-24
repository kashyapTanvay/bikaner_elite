// backend/src/configurations/file.ts
import multer from "multer";
import path from "path";
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";
import fs from "fs";

// Ensure upload directory exists in development
export const UPLOAD_PATH =
  process.env.MODE === "PRODUCTION" ? "/tmp/uploads" : "./uploads";

if (process.env.MODE !== "PRODUCTION" && !fs.existsSync(UPLOAD_PATH)) {
  fs.mkdirSync(UPLOAD_PATH, { recursive: true });
}

export const MIME_TYPES = [
  "image/jpeg",
  "image/svg+xml",
  "image/png",
  "image/webp",
  "image/heic", // For iOS photos
  "image/heif", // For iOS photos
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-ms-wmv",
  "video/webm",
];

const devStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_PATH);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const prodStorage = multerS3({
  s3: new S3Client({
    region: process.env.AWS_REGION || "ap-south-1",
  }),
  bucket: process.env.AWS_S3_BUCKET_NAME || "vidyamarg-uploads",
  // Remove this line: acl: "public-read",
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({
  storage: process.env.MODE === "PRODUCTION" ? prodStorage : devStorage,
  fileFilter: (req, file, cb) => {
    if (MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}`));
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024, // Increase to 50MB
    files: 10, // Maximum number of files
  },
});
