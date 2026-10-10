"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "../store/auth.store";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, TrendingUp, Flame, CheckCircle2, ChevronRight } from "lucide-react";

/* ─── Readiness Gauge — the signature component on landing ─── */
function ReadinessGauge({ value, animated }: { value: number; animated: boolean }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!animated) return;
    let frame: number;
    const start = performance.now();
    const duration = 900;
    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setDisplay(Math.round(eased * value));
      if (t < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [animated, value]);

  const hiringBar = 85;

  return (
    <div className="w-full">
      <div className="flex items-end justify-between mb-3">
        <div>
          <p className="eyebrow mb-1">Sample Readiness Score</p>
          <div className="flex items-baseline gap-2">
            <span className="stat-number text-4xl text-[var(--fg-primary)]">{display}%</span>
            <span className="text-sm text-[var(--fg-muted)]">
              / {hiringBar - display > 0 ? `${hiringBar - display}pts to hiring bar` : "Hiring bar reached ✓"}
            </span>
          </div>
        </div>
        <span className="badge badge-accent text-xs">
          <TrendingUp className="h-3 w-3" />
          +12pts this week
        </span>
      </div>

      {/* The gauge track */}
      <div className="gauge-track">
        <div
          className="gauge-fill"
          style={{ width: animated ? `${value}%` : "0%" }}
        />
        {/* Hiring bar marker at 85% */}
        <div
          className="gauge-marker"
          style={{ left: `${hiringBar}%` }}
        />
      </div>

      {/* Axis labels */}
      <div className="flex justify-between mt-1.5">
        <span className="text-xs text-[var(--fg-muted)]">0%</span>
        <span
          className="text-xs font-semibold text-[var(--border-strong)] relative"
          style={{ left: `${hiringBar - 50}%` }}
        >
          85% Hiring Bar
        </span>
        <span className="text-xs text-[var(--fg-muted)]">100%</span>
      </div>
    </div>
  );
}

/* ─── Animated question card — shows the real product ─── */
function DemoQuestionCard() {
  const [phase, setPhase] = useState<"question" | "typing" | "result">("question");
  const [typed, setTyped] = useState("");
  const answer =
    "A closure is a function that retains access to its lexical scope — variables from the enclosing scope — even after that scope has returned. This enables patterns like data encapsulation, memoization, and factory functions.";

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("typing"), 1800);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (phase !== "typing") return;
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setTyped(answer.slice(0, i));
      if (i >= answer.length) {
        clearInterval(iv);
        setTimeout(() => setPhase("result"), 600);
      }
    }, 18);
    return () => clearInterval(iv);
  }, [phase]);

  return (
    <div className="card p-6 space-y-4">
      {/* Question header */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="badge badge-neutral">Conceptual</span>
        <span className="badge badge-ok">Beginner</span>
        <span className="ml-auto stat-number text-xs text-[var(--fg-muted)]">
          {phase === "question" ? "00:00" : phase === "typing" ? "00:12" : "00:29"}
        </span>
      </div>

      {/* Question text */}
      <p className="text-sm font-medium text-[var(--fg-primary)] leading-relaxed">
        Explain what a <strong>closure</strong> is in JavaScript and describe one practical use case from your resume project.
      </p>

      {/* Answer area */}
      {phase === "question" && (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-sunken)] h-20 flex items-center justify-center">
          <span className="text-xs text-[var(--fg-muted)] animate-pulse">Waiting for answer...</span>
        </div>
      )}

      {(phase === "typing" || phase === "result") && (
        <div className="answer-area text-xs leading-relaxed" style={{ minHeight: 80, padding: "0.75rem" }}>
          {typed}
          {phase === "typing" && <span className="animate-pulse">▌</span>}
        </div>
      )}

      {/* Score reveal */}
      {phase === "result" && (
        <div className="rounded-lg bg-[var(--ok-dim)] border border-[var(--ok)]/30 p-4 flex items-center justify-between animate-[fade-up_0.35s_ease_forwards]">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-[var(--ok)] shrink-0" />
            <div>
              <p className="text-xs font-bold text-[var(--ok)]">Score: 82 / 100</p>
              <p className="text-xs text-[var(--fg-secondary)] mt-0.5">Strong on definition — add a concrete code example for full marks.</p>
            </div>
          </div>
          <span className="stat-number text-2xl text-[var(--ok)] font-medium">82</span>
        </div>
      )}
    </div>
  );
}

/* ─── Mini streak widget ─── */
function DemoStreakWidget() {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const active = [true, true, true, true, true, false, false];
  return (
    <div className="card p-4 flex items-center gap-4">
      <div className="flex items-center gap-1.5">
        <Flame className="h-5 w-5 text-[var(--accent)]" />
        <span className="stat-number text-xl font-medium">5</span>
        <span className="text-xs text-[var(--fg-muted)] ml-0.5">day streak</span>
      </div>
      <div className="flex items-center gap-1.5 ml-auto">
        {days.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className="text-[9px] font-bold text-[var(--fg-muted)] uppercase">{d}</span>
            <div
              className="h-5 w-5 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: active[i] ? "var(--accent)" : "var(--bg-sunken)",
              }}
            >
              {active[i] && <CheckCircle2 className="h-3 w-3 text-white stroke-[2.5]" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Skill radar placeholder (pure CSS) ─── */
function DemoRadar() {
  // Six axes, simple SVG polygon for illustration
  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const r = 60;
  const labels = ["Coding", "Theory", "System\nDesign", "Comms", "Algo", "DS"];
  const scores = [0.72, 0.55, 0.60, 0.80, 0.65, 0.70]; // normalised 0–1

  const pts = labels.map((_, i) => {
    const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
    const s = scores[i];
    return [cx + r * s * Math.cos(angle), cy + r * s * Math.sin(angle)];
  });

  const polygon = pts.map((p) => p.join(",")).join(" ");

  const gridPts = (scale: number) =>
    labels
      .map((_, i) => {
        const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
        return [cx + r * scale * Math.cos(angle), cy + r * scale * Math.sin(angle)].join(",");
      })
      .join(" ");

  return (
    <div className="card p-4">
      <p className="eyebrow mb-3">Skill Radar</p>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
        {[0.25, 0.5, 0.75, 1].map((s) => (
          <polygon
            key={s}
            points={gridPts(s)}
            fill="none"
            stroke="var(--border)"
            strokeWidth={1}
          />
        ))}
        {labels.map((_, i) => {
          const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={cx + r * Math.cos(angle)}
              y2={cy + r * Math.sin(angle)}
              stroke="var(--border)"
              strokeWidth={1}
            />
          );
        })}
        <polygon
          points={polygon}
          fill="var(--accent)"
          fillOpacity={0.2}
          stroke="var(--accent)"
          strokeWidth={1.5}
        />
        {labels.map((label, i) => {
          const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
          const lx = cx + (r + 14) * Math.cos(angle);
          const ly = cy + (r + 14) * Math.sin(angle);
          return (
            <text
              key={i}
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={7}
              fill="var(--fg-muted)"
              fontFamily="var(--font-sans)"
            >
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN LANDING PAGE
   ═══════════════════════════════════════════════════════ */
export default function Home() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const [gaugeVisible, setGaugeVisible] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, router]);

  useEffect(() => {
    const timer = setTimeout(() => setGaugeVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  if (isAuthenticated) return null;

  return (
    <div
      className="min-h-screen flex flex-col font-sans"
      style={{ backgroundColor: "var(--bg-base)", color: "var(--fg-primary)" }}
    >
      {/* ── Navigation ── */}
      <header
        className="sticky top-0 z-50 topnav"
      >
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] p-1 flex items-center justify-center overflow-hidden shadow-sm">
              <Image src="/logo.png" alt="CareerOS" width={32} height={32} className="w-full h-full object-contain" priority />
            </div>
            <span className="font-semibold text-sm tracking-tight text-[var(--fg-primary)] group-hover:text-[var(--accent)] transition-colors">
              CareerOS
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm text-[var(--fg-secondary)]">
            <a href="#product" className="hover:text-[var(--fg-primary)] transition-colors">Product</a>
            <a href="#how" className="hover:text-[var(--fg-primary)] transition-colors">How it works</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] transition-colors"
            >
              Sign in
            </Link>
            <Link href="/register">
              <button className="btn-primary text-sm px-5 py-2">
                Start free
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ════════════════════════════════════════
            HERO — product demo, not just copy
            ════════════════════════════════════════ */}
        <section ref={heroRef} className="py-20 md:py-28 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

              {/* Left: Copy */}
              <div className="space-y-8">
                <div className="space-y-1">
                  <p className="eyebrow text-[var(--accent)]">
                    AI-powered interview preparation
                  </p>
                  <h1 className="display text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-[var(--fg-primary)]">
                    Land the offer.
                    <span className="block italic text-[var(--accent)]">Not just pass</span>
                    <span className="block">the screen.</span>
                  </h1>
                </div>

                <p className="text-base md:text-lg text-[var(--fg-secondary)] leading-relaxed max-w-md">
                  Upload your resume. CareerOS reads your background, finds the gaps between where you are and where the job description needs you to be, then runs daily 60-minute sessions until your readiness score hits the hiring bar.
                </p>

                {/* Concrete proof points */}
                <ul className="space-y-3">
                  {[
                    "Resume-parsed curriculum — study what you're actually missing, not everything",
                    "AI questions generated from your target role's real interview patterns",
                    "Instant feedback with exact score, strengths, and what to fix",
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--fg-secondary)]">
                      <CheckCircle2 className="h-4 w-4 text-[var(--ok)] shrink-0 mt-0.5" />
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/register">
                    <button className="btn-primary px-8 py-3 text-sm w-full sm:w-auto">
                      Start preparing for free
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                  <Link href="/login">
                    <button className="btn-ghost px-6 py-3 text-sm w-full sm:w-auto">
                      Sign in to dashboard
                    </button>
                  </Link>
                </div>

                <p className="text-xs text-[var(--fg-muted)]">
                  No credit card required · Works with any PDF resume
                </p>
              </div>

              {/* Right: Live product preview */}
              <div id="product" className="space-y-4">
                {/* Readiness Gauge — the signature element */}
                <div className="card-raised p-6">
                  <ReadinessGauge value={62} animated={gaugeVisible} />
                </div>

                {/* Animated question card */}
                <DemoQuestionCard />

                {/* Mini widgets row */}
                <div className="grid grid-cols-2 gap-4">
                  <DemoStreakWidget />
                  <DemoRadar />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            HOW IT WORKS — specific, not generic
            ════════════════════════════════════════ */}
        <section id="how" className="py-20 px-6 border-t border-[var(--border)]">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <p className="eyebrow text-[var(--accent)] mb-2">The process</p>
              <h2 className="display text-4xl md:text-5xl text-[var(--fg-primary)]">
                How CareerOS works
              </h2>
              <p className="text-[var(--fg-secondary)] mt-3 max-w-xl">
                A four-step loop that runs every day until you're ready.
              </p>
            </div>

            <div className="space-y-px">
              {[
                {
                  step: "01",
                  title: "Upload your resume",
                  body: "We extract your tech stack, years of experience, projects, and stated skills. This takes about 30 seconds.",
                  detail: "Supports PDF and Word — no formatting requirements",
                },
                {
                  step: "02",
                  title: "Tell us your target role",
                  body: "\"Senior Backend Engineer at a fintech startup\" is more useful than just \"backend engineer.\" The more specific, the more calibrated your questions.",
                  detail: "e.g. Staff iOS Engineer, L5 Backend at FAANG, Frontend Lead at Series B startup",
                },
                {
                  step: "03",
                  title: "Do your 60-minute daily session",
                  body: "Three units per session: one algorithmic problem, one system design question, one behavioural. Each question is generated fresh, scored by AI, and logged against your weak areas.",
                  detail: "Skipping a question lowers your readiness score — the system notices",
                },
                {
                  step: "04",
                  title: "Watch your readiness score climb",
                  body: "Your score moves every session based on actual answers — not just showing up. When you hit 85%, you're above the median candidate for your target role.",
                  detail: "Telegram reminders keep you accountable",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group flex gap-6 p-6 rounded-lg border border-transparent hover:border-[var(--border)] hover:bg-[var(--bg-surface)] transition-all duration-200"
                >
                  <div className="shrink-0 pt-0.5">
                    <span className="stat-number text-xs text-[var(--accent)] font-medium">{item.step}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-semibold text-base text-[var(--fg-primary)]">{item.title}</h3>
                      <ChevronRight className="h-4 w-4 text-[var(--border-strong)] group-hover:text-[var(--accent)] transition-colors shrink-0" />
                    </div>
                    <p className="text-sm text-[var(--fg-secondary)] mt-1.5 leading-relaxed">{item.body}</p>
                    <p className="text-xs text-[var(--fg-muted)] mt-2 font-medium">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            PROOF — numbers, not adjectives
            ════════════════════════════════════════ */}
        <section className="py-20 px-6 border-t border-[var(--border)]">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { stat: "60", unit: "min", label: "Daily session — not 4 hours" },
                { stat: "85%", unit: "", label: "The hiring bar we aim for" },
                { stat: "3", unit: "types", label: "Algo · System design · Behavioural" },
                { stat: "0", unit: "fluff", label: "No gamification — just results" },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="stat-number text-4xl font-medium text-[var(--fg-primary)]">
                    {item.stat}
                    {item.unit && (
                      <span className="text-xl text-[var(--fg-muted)] ml-1">{item.unit}</span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--fg-secondary)] mt-2 leading-relaxed">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            CTA
            ════════════════════════════════════════ */}
        <section className="py-20 px-6 border-t border-[var(--border)]">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="display text-4xl md:text-5xl text-[var(--fg-primary)]">
              Your next interview
              <span className="block italic text-[var(--accent)]">is already scheduled.</span>
            </h2>
            <p className="text-[var(--fg-secondary)] text-base max-w-md mx-auto">
              Upload your resume and we'll tell you exactly how many sessions it will take to get ready. No estimate — a score.
            </p>
            <Link href="/register">
              <button className="btn-primary px-10 py-3.5 text-base mx-auto">
                Upload resume and start
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--border)] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded border border-[var(--border)] bg-[var(--bg-surface)] p-0.5 overflow-hidden">
              <Image src="/logo.png" alt="CareerOS" width={24} height={24} className="w-full h-full object-contain" />
            </div>
            <span className="text-sm font-medium text-[var(--fg-primary)]">CareerOS</span>
          </div>
          <p className="text-xs text-[var(--fg-muted)]">
            © {new Date().getFullYear()} CareerOS. Built for engineers, by engineers.
          </p>
          <div className="flex items-center gap-4 text-xs text-[var(--fg-muted)]">
            <Link href="/login" className="hover:text-[var(--fg-primary)] transition-colors">Sign in</Link>
            <Link href="/register" className="hover:text-[var(--fg-primary)] transition-colors">Get started</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
