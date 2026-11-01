"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardOverview() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/analytics");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#00F59B] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-mono">Aggregating database ledger records...</p>
        </div>
      </div>
    );
  }

  const { summary, revenueChart, recentTransactions, topCustomers } = data;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Welcome with Quick Agent Command */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-[#0D1629] via-[#0F1E38] to-[#0D1629] border border-slate-800 p-6 rounded-2xl shadow-card relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#00F59B] uppercase tracking-wider">Financial Autopilot</span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
              DEMO DATA ACTIVE
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Financial Operations Command Center
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            FlowPilot orchestrates PayPal payments, reconciles ledger transactions, and executes verified financial operations through structured AI agents.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={fetchAnalytics}
            title="Refresh Ledger Calculations"
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-[#00F59B] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            href="/dashboard/agent"
            className="flex items-center gap-2 bg-[#00F59B] hover:bg-[#10E79D] text-[#080D1A] font-bold text-xs px-4 py-2.5 rounded-xl shadow-glow transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Launch AI Agent
          </Link>
        </div>
      </div>

      {/* 4 Primary Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Revenue */}
        <div className="glass-panel p-5 rounded-xl space-y-2 border-l-4 border-l-[#00F59B]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Settled Revenue</span>
            <DollarSign className="w-4 h-4 text-[#00F59B]" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            ${summary.totalRevenue.toLocaleString()} <span className="text-xs font-normal text-slate-400">USD</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#00F59B]">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{summary.paidCount} verified settled payments</span>
          </div>
        </div>

        {/* Card 2: Pending Receivables */}
        <div className="glass-panel p-5 rounded-xl space-y-2 border-l-4 border-l-cyan-500">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Receivables</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            ${summary.totalPending.toLocaleString()} <span className="text-xs font-normal text-slate-400">USD</span>
          </div>
          <div className="text-[11px] text-cyan-400">
            Awaiting PayPal customer checkout
          </div>
        </div>

        {/* Card 3: Overdue Balance */}
        <div className="glass-panel p-5 rounded-xl space-y-2 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Overdue Balance</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            ${summary.totalOverdue.toLocaleString()} <span className="text-xs font-normal text-slate-400">USD</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-amber-400">
            <span>Automated reminders prepared</span>
          </div>
        </div>

        {/* Card 4: Collection Success Rate */}
        <div className="glass-panel p-5 rounded-xl space-y-2 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Collection Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {summary.collectionRate}
          </div>
          <div className="text-[11px] text-slate-400">
            Across {summary.invoiceCount} generated client invoices
          </div>
        </div>
      </div>

      {/* Main Charts & Financial Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Revenue Over Time</h2>
              <p className="text-xs text-slate-400">Verified monthly transaction collections</p>
            </div>
            <span className="text-xs font-mono text-[#00F59B] bg-emerald-950/60 border border-emerald-500/20 px-2.5 py-1 rounded-md">
              USD Ledger
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChart}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F59B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00F59B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748B"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0D1629", borderColor: "#1E293B", borderRadius: "8px", fontSize: "12px" }}
                  formatter={(val: any) => [`$${val.toLocaleString()} USD`, "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#00F59B"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Financial Insights & Risk Brief */}
        <div className="glass-panel p-6 rounded-2xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#00F59B]">
              <Sparkles className="w-4 h-4" />
              <h2 className="text-base font-bold text-white tracking-tight">Agent Intelligence</h2>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
              <span className="font-semibold text-slate-200">Cash Flow Velocity</span>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Payment collection cycle averaged 4.2 days this month, outperforming previous quarters by 18%.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-amber-500/20 space-y-2 text-xs">
              <span className="font-semibold text-amber-400">Delinquency Alert</span>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                3 client invoices are currently overdue totaling $10,600. Quantum Media and Summit Financial have reminders queued.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/agent"
            className="flex items-center justify-between text-xs font-semibold text-[#00F59B] bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-xl hover:bg-emerald-950/80 transition-colors"
          >
            <span>Ask FlowPilot to act on overdue invoices</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Bottom Section: Recent Transactions & Top Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Recent Transactions</h2>
              <p className="text-xs text-slate-400">Synchronized PayPal sandbox ledger records</p>
            </div>
            <Link
              href="/dashboard/payments"
              className="text-xs text-[#00F59B] hover:underline flex items-center gap-1"
            >
              Open AG Grid Ledger <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Description</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {recentTransactions.map((tx: any) => (
                  <tr key={tx.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 text-slate-400 font-sans">{tx.date}</td>
                    <td className="py-3 font-semibold text-slate-200 font-sans">{tx.customer}</td>
                    <td className="py-3 text-slate-400 truncate max-w-[200px] font-sans">{tx.description}</td>
                    <td className="py-3 text-[#00F59B] font-bold">${tx.amount.toLocaleString()}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          tx.status === "SETTLED"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                            : "bg-amber-950 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Customers Breakdown */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Top Revenue Accounts</h2>
            <p className="text-xs text-slate-400">Total settled billing by customer</p>
          </div>

          <div className="space-y-3">
            {topCustomers.map((cust: any, index: number) => (
              <div key={cust.name} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800/40">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-[10px]">
                    {index + 1}
                  </span>
                  <span className="text-slate-200 font-medium">{cust.name}</span>
                </div>
                <span className="text-[#00F59B] font-mono font-bold">${cust.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              href="/dashboard/invoices"
              className="w-full flex items-center justify-center gap-2 bg-[#0D1629] hover:bg-slate-800 text-slate-200 text-xs font-semibold py-2.5 rounded-xl border border-slate-800 transition-colors"
            >
              Create New Invoice
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

