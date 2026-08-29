"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { AlertCircle, ArrowLeft, ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/admin/Logo";

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const { data: session, status } = useSession() ?? {};

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already signed in as ADMIN, leave the login page.
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      router.replace(callbackUrl);
    }
  }, [status, session, callbackUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setError("Incorrect email or password.");
        setSubmitting(false);
        return;
      }

      // After successful signIn, session becomes available on next render.
      // We rely on the useEffect above to navigate.
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0A0A0A] md:grid md:grid-cols-2">
      {/* Brand panel (desktop only) */}
      <aside
        className="relative hidden flex-col justify-between overflow-hidden p-12 text-white md:flex"
        style={{
          background:
            "linear-gradient(160deg, #0A0A0A 0%, #18181B 60%, #1E3A8A 140%)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-[#2563EB]/30 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-12 h-64 w-64 rounded-full bg-[#3B82F6]/20 blur-3xl"
        />

        <div className="relative">
          <Logo size="md" variant="full" className="[&_span]:!text-white [&_span_span]:!text-white/60" />
        </div>

        <div className="relative max-w-md space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-white/80 backdrop-blur">
            <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} />
            Internal use only
          </div>
          <h1
            className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl"
            style={{ fontFamily: "var(--font-space-grotesk), system-ui" }}
          >
            Operate the Swift Safe Energy platform.
          </h1>
          <p className="text-sm leading-relaxed text-white/70">
            Catalog, content and homepage merchandising — all in one console.
            Authenticated via the NestJS API; access is restricted to ADMIN
            accounts.
          </p>
        </div>

        <div className="relative text-xs text-white/40">
          © {new Date().getFullYear()} Swift Safe Energy. All rights reserved.
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center px-6 py-12 md:px-12">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-1.5 text-xs text-[#71717A] transition-colors hover:text-[#0A0A0A]"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
            Back to website
          </Link>

          <div className="mb-8 md:hidden">
            <Logo size="md" />
          </div>

          <div className="mb-8">
            <h2
              className="text-2xl font-semibold tracking-tight text-[#0A0A0A]"
              style={{ fontFamily: "var(--font-space-grotesk), system-ui" }}
            >
              Sign in to Admin
            </h2>
            <p className="mt-1 text-sm text-[#71717A]">
              Use your ADMIN account credentials.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-md border border-[#FECACA] bg-[#FEF2F2] px-3 py-2.5 text-xs text-[#B91C1C]"
              >
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-medium text-[#52525B]"
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A1A1AA]"
                  strokeWidth={1.75}
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@shensafu.com"
                  disabled={submitting}
                  className="h-10 w-full rounded-md border border-[#E4E4E7] bg-white pl-9 pr-3 text-sm text-[#0A0A0A] placeholder:text-[#A1A1AA] transition-colors focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-medium text-[#52525B]"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A1A1AA]"
                  strokeWidth={1.75}
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={submitting}
                  className="h-10 w-full rounded-md border border-[#E4E4E7] bg-white pl-9 pr-10 text-sm text-[#0A0A0A] placeholder:text-[#A1A1AA] transition-colors focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[#A1A1AA] transition-colors hover:text-[#52525B]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" strokeWidth={1.75} />
                  ) : (
                    <Eye className="h-4 w-4" strokeWidth={1.75} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || status === "loading"}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#0A0A0A] px-3 text-sm font-semibold text-white transition-colors hover:bg-[#27272A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-[#A1A1AA]">
            ADMIN access only · All actions are logged
          </p>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA]">
          <Loader2 className="h-5 w-5 animate-spin text-[#A1A1AA]" />
        </div>
      }
    >
      <LoginInner />
    </Suspense>
  );
}
