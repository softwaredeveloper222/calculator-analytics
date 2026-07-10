import { NextRequest } from "next/server";

export function verifyIngestAuth(request: NextRequest): boolean {
  const apiKey = process.env.ANALYTICS_API_KEY;

  if (!apiKey) {
    return process.env.NODE_ENV === "development";
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return false;
  }

  return authHeader.slice("Bearer ".length) === apiKey;
}
