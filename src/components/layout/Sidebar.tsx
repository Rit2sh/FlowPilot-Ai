"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  FileText,
  Users,
  CreditCard,
  Scale,
  Zap,
  BarChart3,
  CheckCircle2,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "AI Agent", href: "/dashboard/agent", icon: Sparkles, badge: "AI" },
  { name: "Invoices", href: "/dashboard/invoices", icon: FileText },
  { name: "Customers", href: "/dashboard/customers", icon: Users },
  { name: "Payments (AG Grid)", href: "/dashboard/payments", icon: CreditCard, highlight: true },
  { name: "Reconciliation", href: "/dashboard/reconciliation", icon: Scale },
  { name: "Automation", href: "/dashboard/automation", icon: Zap },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Approvals", href: "/dashboard/approvals", icon: CheckCircle2, alertBadge: "2" },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-[#1E293B] bg-[#080D1A] flex flex-col justify-between shrink-0 min-h-[calc(100vh-57px)]">
      <div className="p-4 space-y-6">
        {/* Navigation list */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Operations
          </p>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? "bg-[#0D1629] text-[#00F59B] border border-[#00F59B]/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#0D1629]/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? "text-[#00F59B]" : "text-slate-400 group-hover:text-slate-200"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span className="text-[10px] bg-emerald-950 text-[#00F59B] border border-[#00F59B]/40 px-1.5 py-0.2 rounded font-semibold">
                    {item.badge}
                  </span>
                )}

                {item.alertBadge && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.2 rounded font-bold">
                    {item.alertBadge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom Branding / PayPal Status Badge */}
      <div className="p-4 border-t border-[#1E293B] bg-[#060A14]">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-2 h-2 rounded-full bg-[#00F59B]" />
          <span className="text-[11px] font-semibold text-slate-300">PayPal Sandbox Ready</span>
        </div>
        <p className="text-[10px] text-slate-500 leading-tight">
          Orders API v2 & Webhooks configured for test financial workflows.
        </p>
      </div>
    </aside>
  );
}

