/**
 * App Configuration
 *
 * API base URL switches automatically between development and production.
 * Set EXPO_PUBLIC_API_URL in your .env file to override the default for
 * local development, or configure the EAS environment in eas.json.
 *
 * Usage:
 *   import config from "@/constants/config";
 *   const response = await fetch(`${config.apiUrl}/endpoint`);
 */
const config = {
  apiUrl:
    process.env.EXPO_PUBLIC_API_URL ??
    (__DEV__
      ? "http://192.168.89.44:5000/api" // local backend — update to your machine's IP
      : "https://api.quickread.com/api"), // production backend
};

export default config;
