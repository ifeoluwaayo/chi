import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { createSessionCookie } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  try {
    const { idToken } = (await req.json()) as { idToken: string };

    const expiry = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await createSessionCookie(idToken, {
      expiresIn: expiry,
    });

    cookies().set("__chiSession", sessionCookie, {
      maxAge: expiry,
      httpOnly: true,
      secure: true,
    });

    return NextResponse.json({
      success: true,
      data: "Signed in successfully.",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, data: e });
  }
}
