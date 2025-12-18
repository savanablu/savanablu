import { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE_NAME = "sb_admin_auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  // Only handle admin routes (pages + API)
  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  // Allow access to the login page and login API without auth
  if (
    (isAdminPage && pathname === "/admin/login") ||
    (isAdminApi && pathname === "/api/admin/login")
  ) {
    return NextResponse.next();
  }

  const authCookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const isAuthed = authCookie === "true";

  if (isAuthed) {
    return NextResponse.next();
  }

  // Unauthenticated API calls → 401
  if (isAdminApi) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Unauthenticated admin pages → redirect to login
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.searchParams.set("from", pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

