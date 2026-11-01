"use client";

import { useState, useEffect } from "react";
import {
  Scale,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  FileCheck,
} from "lucide-react";

export default function ReconciliationPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const fetchReconciliation = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/reconciliation");
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
    fetchReconciliation();
  }, []);

  const handleResolve = async (recordId: string) => {
    try {
      setResolvingId(recordId);
      const res = await fetch("/api/reconciliation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recordId,
          notes: "Confirmed and reconciled by business owner",
        }),
      });

      if (res.ok) {
        fetchReconciliation();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setResolvingId(null);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#00F59B] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-mono">Running ledger reconciliation heuristics...</p>
        </div>
      </div>
    );
  }

  const { records, stats } = data;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Reconciliation & Audit Engine
            <span className="text-xs bg-emerald-950 text-[#00F59B] border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-mono font-medium">
              Health: {stats.health}
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            Autonomous 1-to-1 matching between external PayPal captures and internal invoice accounts.
          </p>
        </div>

        <button
          onClick={fetchReconciliation}
          className="flex items-center gap-2 bg-[#0D1629] hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm"
        >
          <RefreshCw className="w-4 h-4 text-[#00F59B]" />
          Re-Scan Ledger
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border-l-4 border-l-slate-500 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Scanned</span>
          <div className="text-2xl font-bold text-white font-mono">{stats.total}</div>
          <p className="text-[11px] text-slate-500">Transactions examined</p>
        </div>

        <div className="glass-panel p-4 rounded-xl border-l-4 border-l-[#00F59B] space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Verified Exact Matches</span>
          <div className="text-2xl font-bold text-[#00F59B] font-mono">{stats.matched}</div>
          <p className="text-[11px] text-slate-500">100% confidence verified</p>
        </div>

        <div className="glass-panel p-4 rounded-xl border-l-4 border-l-amber-500 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Discrepancies</span>
          <div className="text-2xl font-bold text-amber-400 font-mono">{stats.discrepancies}</div>
          <p className="text-[11px] text-slate-500">Partial or amount mismatch</p>
        </div>

        <div className="glass-panel p-4 rounded-xl border-l-4 border-l-rose-500 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Unmatched Deposits</span>
          <div className="text-2xl font-bold text-rose-400 font-mono">{stats.unmatched}</div>
          <p className="text-[11px] text-slate-500">Requires manual association</p>
        </div>
      </div>

      {/* Reconciliation Records Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-[#00F59B]" />
            Reconciliation Audit Journal
          </h2>
          <span className="text-xs text-slate-400">
            Every match is backed by explainable heuristic criteria
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <th className="p-4">Transaction / PayPal Order</th>
                <th className="p-4">Matched Invoice</th>
                <th className="p-4">Match Heuristic</th>
                <th className="p-4">Confidence</th>
                <th className="p-4">Status & Reason</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {records.map((rec: any) => (
                <tr key={rec.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-200">
                      {rec.paypalOrderId || rec.transaction?.externalReference || "N/A"}
                    </div>
                    <div className="text-[11px] text-slate-500 font-sans">
                      {rec.transaction?.description}
                    </div>
                  </td>

                  <td className="p-4">
                    {rec.invoice ? (
                      <div>
                        <span className="font-bold text-[#00F59B]">{rec.invoice.invoiceNumber}</span>
                        <span className="text-[11px] text-slate-400 block font-sans">
                          {rec.invoice.customer?.name} (${Number(rec.invoice.totalAmount).toLocaleString()})
                        </span>
                      </div>
                    ) : (
                      <span className="text-rose-400 font-sans">No matching invoice</span>
                    )}
                  </td>

                  <td className="p-4">
                    <span className="text-xs font-semibold text-slate-300 font-sans">{rec.matchType}</span>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            Number(rec.confidenceScore) >= 0.95
                              ? "bg-[#00F59B]"
                              : "bg-amber-400"
                          }`}
                          style={{ width: `${Number(rec.confidenceScore) * 100}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-slate-300">
                        {Math.round(Number(rec.confidenceScore) * 100)}%
                      </span>
                    </div>
                  </td>

                  <td className="p-4 font-sans">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          rec.status === "MATCHED" || rec.status === "RESOLVED"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                            : rec.status === "DISCREPANCY"
                            ? "bg-amber-950 text-amber-400 border border-amber-500/30"
                            : "bg-rose-950 text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        {rec.status}
                      </span>
                    </div>
                    {rec.discrepancyReason && (
                      <p className="text-[11px] text-amber-400/90 mt-1">{rec.discrepancyReason}</p>
                    )}
                    {rec.notes && (
                      <p className="text-[10px] text-slate-500 mt-0.5">{rec.notes}</p>
                    )}
                  </td>

                  <td className="p-4 text-right font-sans">
                    {rec.status === "DISCREPANCY" || rec.status === "UNMATCHED" ? (
                      <button
                        onClick={() => handleResolve(rec.id)}
                        disabled={resolvingId === rec.id}
                        className="bg-[#00F59B] hover:bg-[#10E79D] text-[#080D1A] font-bold text-xs px-3 py-1.5 rounded-lg transition-colors shadow-glow"
                      >
                        {resolvingId === rec.id ? "Resolving..." : "Resolve"}
                      </button>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Verified</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

