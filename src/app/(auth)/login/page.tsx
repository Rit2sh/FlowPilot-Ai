"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ShieldCheck, ArrowRight, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail("demo@flowpilot.ai");
    setPassword("Demo1234!");
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "demo@flowpilot.ai", password: "Demo1234!" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Demo login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080D1A] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00F59B]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#10B981] to-[#00F59B] p-0.5 flex items-center justify-center shadow-glow">
              <span className="font-extrabold text-[#080D1A] text-xl">F</span>
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">
              Flow<span className="text-[#00F59B]">Pilot</span>
            </span>
          </Link>
          <p className="text-xs text-slate-400">
            Sign in to your autonomous financial operations workspace.
          </p>
        </div>

        {/* 1-Click Demo Login Banner for Judges */}
        <div className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-2xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#00F59B] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Hackathon Judge Quick Demo
            </span>
            <span className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded font-mono">
              PRE-CONFIGURED
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-normal">
            Pre-loaded with 8 B2B clients, 20 invoices, 30 transactions, and PayPal Sandbox integration.
          </p>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full bg-[#00F59B] hover:bg-[#10E79D] text-[#080D1A] font-extrabold text-xs py-2.5 rounded-xl shadow-glow transition-all flex items-center justify-center gap-1.5"
          >
            Log In as Demo Founder (1-Click) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Form Card */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="demo@flowpilot.ai"
                  className="w-full bg-[#080D1A] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#00F59B]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#080D1A] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#00F59B]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all"
            >
              {loading ? "Authenticating..." : "Sign In with Credentials"}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
            Don't have an account?{" "}
            <Link href="/register" className="text-[#00F59B] hover:underline font-semibold">
              Create an organization
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

