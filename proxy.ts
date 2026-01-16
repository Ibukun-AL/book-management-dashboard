import type { NextRequest } from "next/server"; // still works, but Request is base
import { auth0 } from "@/lib/auth0";

export async function proxy(request: Request) {
  // Cast if needed for full NextRequest features
  const req = request as NextRequest;

  const authResponse = await auth0.middleware(req);

  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/auth")) {
    return authResponse;
  }

  if (pathname.startsWith("/dashboard")) {
    const session = await auth0.getSession(req); // pass req
    if (!session) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("returnTo", pathname);
      return Response.redirect(loginUrl);
    }
  }

  return authResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};