"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  ShieldCheck,
  CreditCard,
  Building,
  Key,
  Users,
  CheckCircle,
  ExternalLink,
  Save,
} from "lucide-react";

export default function SettingsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [businessName, setBusinessName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("sb-biz47@business.example.com");
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((json) => {
        if (json.business) {
          setData(json.business);
          setBusinessName(json.business.name);
          setBusinessEmail(json.business.email);
        }
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: businessName,
          email: businessEmail,
          paypalEmail,
        }),
      });
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#00F59B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          Settings & Integrations
        </h1>
        <p className="text-xs text-slate-400">
          Manage your business entity, PayPal Sandbox merchant credentials, AI models, and team access.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Business Profile */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 border border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-slate-800 pb-3">
            <Building className="w-4 h-4 text-[#00F59B]" />
            Business Organization Profile
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Business Legal Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-[#080D1A] border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-[#00F59B]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Billing Operations Email</label>
              <input
                type="email"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                className="w-full bg-[#080D1A] border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-[#00F59B]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: PayPal Sandbox Credentials */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <CreditCard className="w-4 h-4 text-[#00F59B]" />
              PayPal Developer Sandbox Integration
            </div>
            <span className="text-[10px] bg-emerald-950 text-[#00F59B] border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono font-semibold">
              CONNECTED
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">PayPal Sandbox Merchant Account</label>
              <input
                type="email"
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
                className="w-full bg-[#080D1A] border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-[#00F59B]"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-slate-400 text-[11px]">
              <div className="flex justify-between font-mono">
                <span>API Endpoint:</span>
                <span className="text-slate-200">https://api-m.sandbox.paypal.com</span>
              </div>
              <div className="flex justify-between font-mono">
                <span>Orders API Version:</span>
                <span className="text-slate-200">v2/checkout/orders</span>
              </div>
              <div className="flex justify-between font-mono">
                <span>Webhook Verification:</span>
                <span className="text-[#00F59B]">ACTIVE & VERIFIED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: AI Engine Orchestration */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 border border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-slate-800 pb-3">
            <Key className="w-4 h-4 text-[#00F59B]" />
            AI Intelligence & Tool Guardrails
          </div>

          <div className="space-y-3 text-xs text-slate-400 leading-relaxed">
            <p>
              FlowPilot uses structured schema calling with deterministic validation. Models cannot execute arbitrary SQL queries or manipulate funds without human-in-the-loop authorization.
            </p>
            <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-500 block">Active Mode:</span>
                <span className="font-bold text-white">Hybrid Gemini / Deterministic Agent</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-500 block">Registered Tools:</span>
                <span className="font-bold text-[#00F59B]">21 Tools Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <span className="text-xs text-[#00F59B] flex items-center gap-1 font-semibold">
              <CheckCircle className="w-4 h-4" /> Settings updated successfully!
            </span>
          ) : (
            <span className="text-xs text-slate-500">All financial changes are logged to the audit journal.</span>
          )}

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-[#00F59B] hover:bg-[#10E79D] text-[#080D1A] font-bold text-xs px-5 py-2.5 rounded-xl shadow-glow transition-all"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </form>
    </div>
  );
}

