"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice";

export default function GithubCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    
    if (!code) {
      setError("No authorization code provided by GitHub.");
      setTimeout(() => router.push("/login"), 3000);
      return;
    }

    const authenticate = async () => {
      try {
        const response = await fetch("http://localhost:4000/auth/github", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });

        const data = await response.json();

        if (!response.ok || data.error) {
          throw new Error(data.message || data.error || "Failed to authenticate with GitHub");
        }

        // Save credentials to Redux and local storage
        dispatch(
          setCredentials({
            user: data.user,
            token: data.access_token,
          })
        );

        // Redirect to dashboard
        router.push("/dashboard");
      } catch (err: any) {
        console.error("GitHub Auth Error:", err);
        setError(err.message || "An error occurred during authentication.");
        setTimeout(() => router.push("/login"), 3000);
      }
    };

    authenticate();
  }, [searchParams, router, dispatch]);

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 rounded-2xl bg-[var(--background-secondary)] border border-[var(--border)] shadow-xl text-center">
        {error ? (
          <div>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">Authentication Failed</h2>
            <p className="text-[var(--foreground-secondary)]">{error}</p>
            <p className="text-sm text-gray-500 mt-4">Redirecting to login...</p>
          </div>
        ) : (
          <div>
            <div className="w-16 h-16 mx-auto mb-6 relative">
              <div className="absolute inset-0 border-4 border-[var(--border)] rounded-full"></div>
              <div className="absolute inset-0 border-4 border-[#38bdf8] rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">Authenticating</h2>
            <p className="text-[var(--foreground-secondary)]">Please wait while we connect your GitHub account...</p>
          </div>
        )}
      </div>
    </div>
  );
}
