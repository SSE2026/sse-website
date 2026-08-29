"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Sidebar } from "@/components/admin/Sidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  // NextAuth v4 + React 19: useSession() 在 SSR 首帧可能返回 null
  const { data: session, status } = useSession() ?? {};

  // Client-side safety net: middleware should already gate this,
  // but if a USER role session slips through, redirect to /403.
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.replace("/403");
    }
  }, [status, session, router]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0A0A0A]">
      <Sidebar />

      <div className="md:pl-64">
        <AdminHeader />

        <main className="px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
