import { clerkMiddleware } from "@clerk/nextjs/server";

export const proxy = clerkMiddleware();
export default proxy;

export const config = {
  matcher: [
    // Skip Next.js internals, static files, and SEO/metadata/AI endpoints
    "/((?!_next|sitemap\\.xml|robots\\.txt|opengraph-image|twitter-image|icon\\.png|apple-icon\\.png|llms\\.txt|llms-full\\.txt|pricing\\.md|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|xml|txt|md)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
