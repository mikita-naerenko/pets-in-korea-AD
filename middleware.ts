import { authMiddleware } from "@clerk/nextjs";

// export default authMiddleware({});

export default authMiddleware({
  publicRoutes: ["/api/public/:path*"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
