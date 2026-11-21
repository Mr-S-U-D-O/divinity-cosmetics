import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Create Account",
  description:
    "Create your Divinity Cosmetics account to track orders and apply as an authorized South African stockist.",
  path: "/sign-up",
  noIndex: true,
  follow: false,
});

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp />
    </div>
  );
}
