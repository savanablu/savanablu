import { NextResponse } from "next/server";

const ADMIN_COOKIE_NAME = "sb_admin_auth";

export async function POST(req: Request) {
  const adminPasscode = process.env.ADMIN_PASSCODE;

  if (!adminPasscode) {
    return NextResponse.json(
      { error: "Admin passcode not configured" },
      { status: 500 }
    );
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    // ignore
  }

  const passcode =
    typeof body.passcode === "string" ? body.passcode : "";

  if (!passcode || passcode !== adminPasscode) {
    return NextResponse.json(
      { success: false, error: "Invalid passcode" },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ success: true });

  res.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "true",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });

  return res;
}

