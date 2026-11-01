"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, ShieldCheck, UserCircle, LogOut, Sparkles, ExternalLink } from "lucide-react";
import { useState } from "react";

export function Navbar({ businessName = "Apex Digital Dynamics", userName = "Alex Vance" }) {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1E293B] bg-[#080D1A]/90 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between">
      {/* Left: Brand Identity & Active Business */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#10B981] to-[#00F59B] p-0.5 flex items-center justify-center shadow-glow">
            <span className="font-extrabold text-[#080D1A] text-base">F</span>
          </div>
          <span className="font-bold text-lg tracking-tight text-white group-hover:text-[#00F59B] transition-colors">
            Flow<span className="text-[#00F59B]">Pilot</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-800">
          <div className="w-2 h-2 rounded-full bg-[#00F59B] animate-pulse" />
          <span className="text-xs font-semibold text-slate-300">{businessName}</span>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">B2B AGENCY</span>
        </div>
      </div>

      {/* Center: Sandbox Mode Badge (Prominent as required) */}
      <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-full shadow-sm">
        <ShieldCheck className="w-4 h-4 text-[#00F59B]" />
        <span className="text-xs font-medium text-emerald-400">
          PayPal Sandbox Active <span className="hidden sm:inline text-slate-400 text-[11px]">(Test Environment)</span>
        </span>
      </div>

      {/* Right: Actions, Notifications & Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Agent Trigger */}
        <Link
          href="/dashboard/agent"
          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold bg-gradient-to-r from-emerald-500/10 to-[#00F59B]/15 text-[#00F59B] border border-[#00F59B]/30 hover:border-[#00F59B] px-3 py-1.5 rounded-lg transition-all shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          AI Copilot
        </Link>

        {/* Notifications toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00F59B]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-[#0D1629] border border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Notifications</span>
                <span className="text-[11px] text-[#00F59B]">3 Unread</span>
              </div>
              <div className="divide-y divide-slate-800/60 text-xs">
                <div className="py-2.5">
                  <p className="font-semibold text-slate-200">PayPal Sandbox Connected</p>
                  <p className="text-slate-400 text-[11px]">Direct integration ready for order testing.</p>
                </div>
                <div className="py-2.5">
                  <p className="font-semibold text-amber-400">Pending High-Risk Approval</p>
                  <p className="text-slate-400 text-[11px]">Proposed $350 refund needs authorization.</p>
                </div>
                <div className="py-2.5">
                  <p className="font-semibold text-emerald-400">Ledger Auto-Reconciled</p>
                  <p className="text-slate-400 text-[11px]">28 PayPal captures verified against invoices.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User profile & Logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="flex items-center gap-2">
            <UserCircle className="w-6 h-6 text-slate-400" />
            <span className="hidden md:inline text-xs font-medium text-slate-200">{userName}</span>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

