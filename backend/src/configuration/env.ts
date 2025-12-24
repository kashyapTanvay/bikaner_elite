export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",

  MONGO_URI:
    process.env.NODE_ENV === "production"
      ? process.env.MONGO_URI_PROD
      : process.env.MONGO_URI_DEV,

  CORS_ORIGIN:
    process.env.NODE_ENV === "production"
      ? process.env.CORS_ORIGIN_PROD
      : process.env.CORS_ORIGIN_DEV,
};
