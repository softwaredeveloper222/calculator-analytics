import { NextRequest, NextResponse } from "next/server";
import {
  createSessionToken,
  sessionCookieOptions,
  SESSION_COOKIE,
  validateAdminCredentials,
} from "@/lib/session";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const username =
    typeof body === "object" &&
    body &&
    "username" in body &&
    typeof (body as { username: unknown }).username === "string"
      ? (body as { username: string }).username.trim()
      : "";
  const password =
    typeof body === "object" &&
    body &&
    "password" in body &&
    typeof (body as { password: unknown }).password === "string"
      ? (body as { password: string }).password
      : "";

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are required" },
      { status: 400 },
    );
  }

  if (!process.env.AUTH_SECRET) {
    return NextResponse.json(
      { error: "AUTH_SECRET is not configured" },
      { status: 500 },
    );
  }

  if (!validateAdminCredentials(username, password)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await createSessionToken(username);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return response;
}
