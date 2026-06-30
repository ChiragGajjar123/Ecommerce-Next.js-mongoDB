export const env = {
  mongodbUri: process.env.MONGODB_URI ?? "mongodb://localhost:27017/",
  mongodbDb: process.env.MONGODB_DB ?? "cmg_ecommerce",
  sessionSecret:
    process.env.SESSION_SECRET ??
    "local-development-session-secret-change-before-deploying",
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  resendFrom: process.env.RESEND_FROM ?? "CMG <no-reply@example.com>",
  appUrl: process.env.APP_URL ?? "http://localhost:3000"
};
