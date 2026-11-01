"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building,
  CreditCard,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Globe,
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form fields
  const [businessName, setBusinessName] = useState("Apex Digital Dynamics");
  const [businessType, setBusinessType] = useState("AGENCY");
  const [country, setCountry] = useState("US");
  const [currency, setCurrency] = useState("USD");
  const [timezone, setTimezone] = useState("America/New_York");
  const [description, setDescription] = useState(
    "Full-service digital engineering, cloud architecture, and UX consultancy."
  );
  const [paypalEmail, setPaypalEmail] = useState("sb-biz47@business.example.com");
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: businessName,
          paypalEmail,
        }),
      });
      if (res.ok) {
        router.push("/dashboard");
      }
    } catch (e) {
      console.error(e);
      router.push("/dashboard");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080D1A] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00F59B]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl space-y-6 relative z-10">
        {/* Progress header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold text-[#00F59B]">
            <Sparkles className="w-3.5 h-3.5" /> Workspace Onboarding
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Configure Your Financial Operations
          </h1>
          <p className="text-xs text-slate-400">
            Set up your organization, currency preferences, and connect your PayPal Sandbox account.
          </p>
        </div>

        {/* Wizard Form */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
            <span className={step >= 1 ? "text-[#00F59B]" : ""}>1. Business Profile</span>
            <span className={step >= 2 ? "text-[#00F59B]" : ""}>2. PayPal Sandbox</span>
            <span className={step >= 3 ? "text-[#00F59B]" : ""}>3. Ready</span>
          </div>

          {step === 1 && (
            <div className="space-y-4 text-xs animate-in fade-in">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Business Organization Name</label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-[#080D1A] border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-[#00F59B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Business Type</label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full bg-[#080D1A] border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-[#00F59B]"
                  >
                    <option value="AGENCY">Digital Agency</option>
                    <option value="FREELANCER">Freelancer / Independent</option>
                    <option value="SERVICES">B2B Professional Services</option>
                    <option value="ECOMMERCE">E-Commerce Merchant</option>
                    <option value="CONSULTANT">Consulting Firm</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Default Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-[#080D1A] border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-[#00F59B]"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD ($)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Description / Scope of Operations</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#080D1A] border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-[#00F59B]"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1.5 bg-[#00F59B] hover:bg-[#10E79D] text-[#080D1A] font-bold px-4 py-2 rounded-xl transition-all shadow-glow"
                >
                  Next: PayPal Sandbox <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 text-xs animate-in fade-in">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#00F59B]" />
                  <span>Connect PayPal Sandbox Environment</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  FlowPilot uses official PayPal Sandbox credentials to create test checkout orders, capture payments, and verify webhooks.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">PayPal Sandbox Merchant Email</label>
                <input
                  type="email"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  className="w-full bg-[#080D1A] border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-[#00F59B]"
                />
              </div>

              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-[11px] text-slate-300 flex items-center justify-between">
                <span>Explore with pre-configured Sandbox Workspace</span>
                <span className="font-bold text-[#00F59B]">Enabled</span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={saving}
                  className="flex items-center gap-1.5 bg-[#00F59B] hover:bg-[#10E79D] text-[#080D1A] font-bold px-5 py-2.5 rounded-xl transition-all shadow-glow"
                >
                  {saving ? "Configuring..." : "Launch Command Center"} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

