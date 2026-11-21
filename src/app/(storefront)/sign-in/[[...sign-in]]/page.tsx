import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Sign In",
  description:
    "Sign in to your Divinity Cosmetics account to view order history and manage stockist applications.",
  path: "/sign-in",
  noIndex: true,
  follow: false,
});

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn />
    </div>
  );
}
