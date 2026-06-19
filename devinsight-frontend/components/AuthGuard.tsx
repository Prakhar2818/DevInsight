"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { RootState } from "../store/store";

const publicRoutes = ["/", "/login", "/signup"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // If user is NOT authenticated and trying to access a private route
    if (!isAuthenticated && !publicRoutes.includes(pathname)) {
      router.push("/login");
    }

    // If user IS authenticated and trying to access a public route or home page
    if (isAuthenticated && (publicRoutes.includes(pathname) || pathname === "/")) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, pathname, router, isMounted]);

  // Prevent flashing of protected content before redirect
  if (!isMounted) return null;

  if (!isAuthenticated && !publicRoutes.includes(pathname)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return <>{children}</>;
}
