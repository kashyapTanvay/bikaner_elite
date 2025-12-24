/* eslint-disable @typescript-eslint/naming-convention */

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * Application
     */
    NODE_ENV: "development" | "production";
    API_VERSION: string;
    PORT: string;

    /**
     * MongoDB
     */
    MONGO_URI?: string; // optional (legacy / fallback)
    MONGO_URI_DEV: string;
    MONGO_URI_PROD: string;

    /**
     * CORS
     */
    CORS_ORIGIN_DEV: string;
    CORS_ORIGIN_PROD: string;

    /**
     * Authentication
     */
    JWT_SECRET: string;
  }
}
