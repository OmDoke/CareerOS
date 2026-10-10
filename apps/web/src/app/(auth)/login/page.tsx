import { LoginForm } from "../../../features/auth/components/LoginForm";
import Link from "next/link";
import Image from "next/image";
import { PublicLayout } from "../../../layouts/PublicLayout";

export default function LoginPage() {
  return (
    <PublicLayout>
      <div
        className="min-h-screen flex items-center justify-center p-4 relative"
        style={{ backgroundColor: "var(--bg-base)" }}
      >
        {/* Single purposeful background texture — editorial dots pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--border) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            opacity: 0.5,
          }}
        />

        {/* Auth card — the ONE purposeful glass element */}
        <div className="auth-card w-full max-w-sm p-8 relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div
              className="h-8 w-8 rounded-lg border p-0.5 flex items-center justify-center overflow-hidden"
              style={{
                backgroundColor: "var(--bg-surface)",
                borderColor: "var(--border)",
              }}
            >
              <Image
                src="/logo.png"
                alt="CareerOS"
                width={32}
                height={32}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <span className="font-semibold text-sm text-[var(--fg-primary)]">CareerOS</span>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-[var(--fg-primary)] tracking-tight">
              Sign in to your account
            </h1>
            <p className="text-xs text-[var(--fg-muted)] mt-1">
              Pick up where you left off
            </p>
          </div>

          <LoginForm />

          <p className="mt-6 text-center text-xs text-[var(--fg-muted)]">
            No account?{" "}
            <Link
              href="/register"
              className="font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
            >
              Create one — it&apos;s free
            </Link>
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
