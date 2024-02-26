import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { revokeAllSessions } from "@/lib/firebase";

export async function GET() {
  try {
    const sessionCookie = cookies().get("__chiSession")?.value;

    if (!sessionCookie)
      return NextResponse.json(
        { success: false, error: "Session not found." },
        { status: 400 }
      );

    cookies().delete("__chiSession");

    await revokeAllSessions(sessionCookie);

    return NextResponse.json({
      success: true,
      data: "Signed out successfully.",
    });
  } catch (e) {
    // console.error(e);
    return NextResponse.json({ success: false, data: e });
  }
}
