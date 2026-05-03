import { TwitterApi } from "twitter-api-v2";

export function getClient() {
  const required = [
    "X_API_KEY",
    "X_API_SECRET",
    "X_ACCESS_TOKEN",
    "X_ACCESS_TOKEN_SECRET",
  ];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(
      `Missing env vars: ${missing.join(", ")}. See docs/marketing/x-automation-plan.md Step 3.`
    );
  }
  return new TwitterApi({
    appKey: process.env.X_API_KEY,
    appSecret: process.env.X_API_SECRET,
    accessToken: process.env.X_ACCESS_TOKEN,
    accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
  });
}

export const HANDLE = "x9elysium";
export const TWEETS_ON_HOMEPAGE = 5;
