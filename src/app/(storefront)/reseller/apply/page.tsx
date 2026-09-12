import React from "react";
import { auth } from "@clerk/nextjs/server";
import { ResellerForm } from "@/components/reseller/ResellerForm";

export default async function ResellerApplyPage() {
  // Enforce authentication on the server-side
  const { userId, redirectToSignIn } = await auth();
  
  if (!userId) {
    return redirectToSignIn();
  }

  return (
    <main className="w-full min-h-[100dvh] bg-[#f5f5f5] pt-32 pb-24 px-6 flex items-center justify-center relative overflow-hidden">
      {/* Decorative background blob */}
      <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-[#3d7b32]/5 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none z-0"></div>

      <div className="w-full max-w-2xl relative z-10">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#111] mb-4">
            Reseller Application
          </h1>
          <p className="text-gray-600 text-lg">
            Let's get to know your business.
          </p>
        </div>

        <ResellerForm />
      </div>
    </main>
  );
}
