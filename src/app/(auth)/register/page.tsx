"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Lock, Mail, User, Building } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, businessName, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080D1A] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00F59B]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#10B981] to-[#00F59B] p-0.5 flex items-center justify-center shadow-glow">
              <span className="font-extrabold text-[#080D1A] text-xl">F</span>
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">
              Flow<span className="text-[#00F59B]">Pilot</span>
            </span>
          </Link>
          <h2 className="text-lg font-bold text-white">Create Your Financial Operations Workspace</h2>
          <p className="text-xs text-slate-400">
            Set up autonomous invoicing, PayPal integration, and AI payment reconciliation.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Your Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Vance"
                  className="w-full bg-[#080D1A] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#00F59B]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Business / Company Name</label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Apex Digital Dynamics"
                  className="w-full bg-[#080D1A] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#00F59B]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Business Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="billing@yourcompany.com"
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
                  placeholder="At least 8 characters"
                  className="w-full bg-[#080D1A] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#00F59B]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00F59B] hover:bg-[#10E79D] text-[#080D1A] font-extrabold text-xs py-2.5 rounded-xl shadow-glow transition-all flex items-center justify-center gap-1.5"
            >
              {loading ? "Creating Workspace..." : "Get Started on FlowPilot"} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
            Already registered?{" "}
            <Link href="/login" className="text-[#00F59B] hover:underline font-semibold">
              Sign in to your account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

