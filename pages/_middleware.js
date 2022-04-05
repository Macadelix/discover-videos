import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const verifyToken = (token) => {
  if (token) {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decodedToken?.issuer;
    return userId;
  }
  return null;
};

export async function middleware(req) {
  const tokenCookie = req ? req.cookies?.token : null;
  const userId = await verifyToken(tokenCookie);

  const { pathname } = req.nextUrl;
  const url = req.nextUrl.clone();

  if (
    pathname.includes("/api/login") ||
    userId ||
    pathname.includes("/static")
  ) {
    return NextResponse.next();
  }

  if (!tokenCookie && pathname !== "/login") {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
}
