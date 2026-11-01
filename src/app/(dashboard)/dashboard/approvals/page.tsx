"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  RefreshCw,
} from "lucide-react";

export default function ApprovalsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/approvals");
      if (res.ok) {
        const json = await res.json();
        setRequests(json.requests || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleAction = async (approvalId: string, action: "APPROVE" | "REJECT") => {
    try {
      setActingId(approvalId);
      const res = await fetch("/api/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvalId, action }),
      });
      if (res.ok) {
        fetchApprovals();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#00F59B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const pending = requests.filter((r) => r.status === "PENDING");
  const history = requests.filter((r) => r.status !== "PENDING");

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Approvals & Governance Inbox
            <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-mono font-bold">
              {pending.length} Pending
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            Human-in-the-loop authorization guardrail for high-impact financial operations, refunds, and communications.
          </p>
        </div>

        <button
          onClick={fetchApprovals}
          className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-[#00F59B] transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Pending Approvals */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          Awaiting Business Owner Authorization
        </h2>

        {pending.length === 0 ? (
          <div className="glass-panel p-8 rounded-2xl text-center text-slate-500 text-xs">
            🎉 All pending operations have been reviewed and executed. Your approvals queue is clear.
          </div>
        ) : (
          pending.map((req) => (
            <div
              key={req.id}
              className="glass-panel p-6 rounded-2xl border-l-4 border-l-amber-500 space-y-4 shadow-card"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded">
                    {req.riskLevel} RISK
                  </span>
                  <span className="text-xs font-mono text-slate-400">Action: {req.actionType}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                  <Clock className="w-3.5 h-3.5" /> Expires {new Date(req.expiresAt).toLocaleDateString()}
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{req.summary}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Proposed by autonomous agent following ledger review. Execution requires explicit owner authorization.
                </p>
              </div>

              {/* Details card */}
              <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
                {Object.entries(req.details || {}).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-slate-500 font-sans capitalize">{k}:</span>
                    <span className="font-semibold text-slate-200">{String(v)}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  onClick={() => handleAction(req.id, "REJECT")}
                  disabled={actingId === req.id}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-rose-400 hover:bg-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5"
                >
                  <X className="w-4 h-4" /> Reject
                </button>
                <button
                  onClick={() => handleAction(req.id, "APPROVE")}
                  disabled={actingId === req.id}
                  className="px-5 py-2 rounded-xl bg-[#00F59B] hover:bg-[#10E79D] text-[#080D1A] font-bold text-xs transition-colors shadow-glow flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Authorize & Execute
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Authorization History
          </h2>
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800/60 text-xs">
            {history.map((req) => (
              <div key={req.id} className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-200">{req.summary}</h4>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {req.actionType} • {new Date(req.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                    req.status === "APPROVED"
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                      : "bg-rose-950 text-rose-400 border border-rose-500/30"
                  }`}
                >
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

