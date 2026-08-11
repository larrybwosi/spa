import { ScrymeClientSDK } from "@scryme/sdk/client";

export const scrymeClient: ScrymeClientSDK = new ScrymeClientSDK({
  clientId: process.env.NEXT_PUBLIC_SCRYME_CLIENT_ID || "dummy-client-id",
  orgSlug: process.env.NEXT_PUBLIC_SCRYME_ORG_SLUG || "dummy-org-slug",
  baseURL: process.env.NEXT_PUBLIC_SCRYME_BASE_URL || "http://localhost:3001",
});
