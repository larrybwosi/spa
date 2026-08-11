import { ScrymeClientSDK } from "@scryme/sdk/client";

export const scrymeClient: ScrymeClientSDK = new ScrymeClientSDK({
  clientId: process.env.NEXT_PUBLIC_SCRYME_CLIENT_ID!,
  orgSlug: process.env.NEXT_PUBLIC_SCRYME_ORG_SLUG!,
  baseURL: process.env.NEXT_PUBLIC_SCRYME_BASE_URL!,
});
