import { Request, Response, Router } from "express";
import path from "path";
import fs from "fs";
import { FileConfiguration, URLConfiguration } from "../configuration";
import { upload } from "../configuration/file";

const fileController = Router();

interface FileResponse {
  name: string;
  originalName: string;
  mimetype: string;
  extension: string;
  destination: string;
  path: string;
  size: number;
}

const generateFileResponse = (
  file: Express.Multer.File,
  request: Request
): FileResponse => {
  const isProduction = process.env.MODE === "PRODUCTION";
  const fileUrl = isProduction
    ? (file as any).location
    : `${URLConfiguration.API.BASE_URL}/file/${file.filename}`; // Relative path

  return {
    name: file.filename || (file as any).key,
    originalName: file.originalname,
    mimetype: file.mimetype,
    extension: path.extname(file.originalname),
    destination: isProduction ? (file as any).bucket : file.destination || "",
    path: fileUrl, // Now returns "/api/v1/file/image.jpg"
    size: file.size,
  };
};

fileController.post(
  `${URLConfiguration.API.BASE_URL}/multi`,
  upload.array("files", 10),
  (request: Request, response: Response): void => {
    try {
      const files = request.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        response.status(400).json({
          success: false,
          message: "No files were uploaded",
        });
        return;
      }

      const uploadedFiles = files.map((file) =>
        generateFileResponse(file, request)
      );
      response.json({
        success: true,
        files: uploadedFiles,
      });
    } catch (error: any) {
      console.error("File upload error:", error);
      response.status(500).json({
        success: false,
        message: "File upload failed",
        error: error.message,
      });
    }
  }
);

// Single file upload endpoint
fileController.post(
  `${URLConfiguration.API.BASE_URL}/single`,
  upload.single("file"),
  (request: Request, response: Response): void => {
    try {
      if (!request.file) {
        response.status(400).json({
          success: false,
          message: "No file was uploaded",
        });
        return;
      }

      response.json({
        success: true,
        file: generateFileResponse(request.file, request),
      });
    } catch (error: any) {
      console.error("File upload error:", error);
      response.status(500).json({
        success: false,
        message: "File upload failed",
        error: error.message,
      });
    }
  }
);

// File download/access endpoint
fileController.get(
  `${URLConfiguration.API.BASE_URL}/:filename`,
  async (request: Request, response: Response): Promise<void> => {
    try {
      const { filename } = request.params;

      if (process.env.MODE === "PRODUCTION") {
        // For production, redirect to S3 URL
        const s3Url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${
          process.env.AWS_REGION || "ap-south-1"
        }.amazonaws.com/${filename}`;
        response.redirect(s3Url);
        return;
      }

      // For development, serve the file directly
      const filePath = path.join(FileConfiguration.UPLOAD_PATH, filename);

      if (!fs.existsSync(filePath)) {
        response.status(404).json({
          success: false,
          message: "File not found",
        });
        return;
      }

      // Set proper content type header
      const mimeType = getMimeType(filename);
      if (mimeType) {
        response.setHeader("Content-Type", mimeType);
      }

      // Stream the file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(response);
    } catch (error: any) {
      console.error("File download error:", error);
      response.status(500).json({
        success: false,
        message: "File download failed",
        error: error.message,
      });
    }
  }
);

// Helper function to get MIME type from filename
function getMimeType(filename: string): string | null {
  const extension = path.extname(filename).toLowerCase();
  switch (extension) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".gif":
      return "image/gif";
    case ".pdf":
      return "application/pdf";
    case ".doc":
      return "application/msword";
    case ".docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case ".xls":
      return "application/vnd.ms-excel";
    case ".xlsx":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case ".ppt":
      return "application/vnd.ms-powerpoint";
    case ".pptx":
      return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    case ".mp4":
      return "video/mp4";
    default:
      return null;
  }
}

export default fileController;
