import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // const token = await getToken({ req: request });
  const url = request.nextUrl;

  // const isAuthPage = ["/", "/sign-in", "/sign-up", "/verify"].some((path) =>
  //   url.pathname.startsWith(path)
  // );

  // // ✅ Redirect logged-in users away from auth pages
  // if (token && isAuthPage) {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  // 🚫 Dashboard protection is disabled for now
  // Uncomment below to protect /dashboard
  
  // if (!token && url.pathname.startsWith("/dashboard")) {
  //   return NextResponse.redirect(new URL("/home", request.url));
  // }
  

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/sign-in", "/sign-up", "/verify/:path*", "/dashboard/:path*"],
};
