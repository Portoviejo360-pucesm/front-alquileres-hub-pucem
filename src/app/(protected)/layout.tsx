"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { tokenStorage } from "@/lib/auth/token";
import AppShell from "@/components/layout/AppShell";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = tokenStorage.get();
    if (!token) router.replace("/login");
  }, [router]);

  return <AppShell>{children}</AppShell>;
}
