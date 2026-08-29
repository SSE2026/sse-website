import { NextResponse } from "next/server";

// Temporary diagnostic endpoint: tests frontend→backend connectivity
// from within the Vercel function, logging the result so we can read it
// via `vercel logs`. Remove after debugging.
export async function GET() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  // eslint-disable-next-line no-console
  console.log("[dbg]url=" + apiUrl);

  if (!apiUrl) {
    // eslint-disable-next-line no-console
    console.log("[dbg]url_empty");
    return NextResponse.json({ ok: false, reason: "url_empty" });
  }

  try {
    const res = await fetch(`${apiUrl}/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "newadmin@ssebatt.com",
        password: "NewAdmin@2026!",
      }),
      signal: AbortSignal.timeout(20000),
    });
    // eslint-disable-next-line no-console
    console.log("[dbg]status=" + res.status);
    const body = (await res.text()).slice(0, 200);
    // eslint-disable-next-line no-console
    console.log("[dbg]body=" + body);
    return NextResponse.json({ ok: res.ok, status: res.status, body });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log("[dbg]err=" + String((e as Error)?.message || e).slice(0, 120));
    return NextResponse.json({ ok: false, error: String((e as Error)?.message || e) });
  }
}
