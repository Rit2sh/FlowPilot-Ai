"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Search,
  ExternalLink,
  Printer,
  Calendar,
  DollarSign,
  User,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [dueDateDays, setDueDateDays] = useState(14);
  const [submitting, setSubmitting] = useState(false);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const url = new URL("/api/invoices", window.location.origin);
      if (statusFilter) url.searchParams.set("status", statusFilter);
      if (search) url.searchParams.set("query", search);

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setInvoices(data.invoices || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [statusFilter]);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    try {
      setSubmitting(true);
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          amount: parseFloat(amount),
          description,
          dueDateDays,
        }),
      });

      if (res.ok) {
        setShowCreateModal(false);
        setCustomerName("");
        setCustomerEmail("");
        setAmount("");
        setDescription("");
        fetchInvoices();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 w-max"><CheckCircle className="w-3 h-3" /> Paid</span>;
      case "PENDING":
      case "ISSUED":
        return <span className="bg-cyan-950 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 w-max"><Clock className="w-3 h-3" /> Pending</span>;
      case "OVERDUE":
        return <span className="bg-amber-950 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 w-max"><AlertTriangle className="w-3 h-3" /> Overdue</span>;
      case "DRAFT":
        return <span className="bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded text-[11px] font-semibold w-max">Draft</span>;
      default:
        return <span className="bg-rose-950 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded text-[11px] font-semibold w-max">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Invoices & Payment Links
            <span className="text-xs bg-emerald-950 text-[#00F59B] border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-mono font-medium">
              PayPal Checkout Ready
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            Create, track, and capture B2B client invoices with automated PayPal Sandbox payment orders.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-[#00F59B] hover:bg-[#10E79D] text-[#080D1A] font-bold text-xs px-4 py-2.5 rounded-xl shadow-glow transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Invoice
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between glass-panel p-3 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search invoice number or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchInvoices()}
            className="w-full bg-[#0D1629] border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00F59B]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {["", "PAID", "PENDING", "OVERDUE", "DRAFT"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                statusFilter === st
                  ? "bg-[#00F59B] text-[#080D1A] font-bold"
                  : "bg-[#0D1629] text-slate-400 hover:text-slate-200"
              }`}
            >
              {st || "All Invoices"}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <th className="p-4">Invoice #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Issue / Due Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">PayPal Checkout</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 font-mono">
                    Loading invoices from database...
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No invoices found. Click "Create Invoice" to generate one.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-white">{inv.invoiceNumber}</td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-200">{inv.customer?.name}</div>
                      <div className="text-[11px] text-slate-500">{inv.customer?.email}</div>
                    </td>
                    <td className="p-4 text-slate-400">
                      <div>Issued: {new Date(inv.issueDate).toLocaleDateString()}</div>
                      <div className="text-[11px] text-slate-500">
                        Due: {new Date(inv.dueDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4 font-mono text-white font-bold text-sm">
                      ${Number(inv.totalAmount).toLocaleString()} <span className="text-xs text-slate-500 font-normal">{inv.currency}</span>
                    </td>
                    <td className="p-4">{getStatusBadge(inv.status)}</td>
                    <td className="p-4">
                      {inv.checkoutUrl ? (
                        <a
                          href={inv.checkoutUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#00F59B] bg-emerald-950/60 border border-emerald-500/30 hover:border-[#00F59B] px-2.5 py-1 rounded-md transition-colors"
                        >
                          <CreditCard className="w-3 h-3" />
                          Pay with PayPal <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ) : (
                        <span className="text-slate-500 text-[11px]">N/A</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                        title="View & Print Invoice"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Invoice */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D1629] border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#00F59B]" />
                Create New Invoice
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Client Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Corp or John Doe"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#080D1A] border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-[#00F59B]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Client Billing Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. billing@acme.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-[#080D1A] border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-[#00F59B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Amount (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="500.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-[#080D1A] border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-[#00F59B]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Due In (Days)</label>
                  <input
                    type="number"
                    value={dueDateDays}
                    onChange={(e) => setDueDateDays(parseInt(e.target.value) || 14)}
                    className="w-full bg-[#080D1A] border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-[#00F59B]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Description / Scope of Work</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Website development milestone 1 & UI implementation"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#080D1A] border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-[#00F59B]"
                />
              </div>

              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-[11px] text-slate-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#00F59B] shrink-0" />
                <span>
                  Creating this invoice will automatically configure a verified <strong>PayPal Sandbox Order</strong> and provide a live checkout URL.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#00F59B] hover:bg-[#10E79D] text-[#080D1A] font-bold px-4 py-2 rounded-lg transition-colors shadow-glow"
                >
                  {submitting ? "Generating Order..." : "Create & Issue Invoice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View & Print Invoice */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D1629] border border-slate-800 rounded-2xl w-full max-w-2xl p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedInvoice(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Printable Invoice Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-6">
              <div>
                <h2 className="text-2xl font-extrabold text-white">INVOICE</h2>
                <p className="text-xs text-[#00F59B] font-mono">{selectedInvoice.invoiceNumber}</p>
                <p className="text-xs text-slate-400 mt-2">FlowPilot Financial Operations Workspace</p>
              </div>

              <div className="text-right text-xs space-y-1">
                {getStatusBadge(selectedInvoice.status)}
                <p className="text-slate-400">Issue Date: {new Date(selectedInvoice.issueDate).toLocaleDateString()}</p>
                <p className="text-slate-400">Due Date: {new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Client Info */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500">Billed To:</span>
                <p className="font-bold text-white text-sm">{selectedInvoice.customer?.name}</p>
                <p className="text-slate-400">{selectedInvoice.customer?.email}</p>
                <p className="text-slate-400">{selectedInvoice.customer?.address || "United States"}</p>
              </div>
              <div className="space-y-1 text-right">
                <span className="text-[10px] uppercase font-bold text-slate-500">Payment Method:</span>
                <p className="font-semibold text-slate-200">PayPal Sandbox Checkout</p>
                <p className="text-[11px] font-mono text-slate-400">Order ID: {selectedInvoice.paypalOrderId || "PENDING"}</p>
              </div>
            </div>

            {/* Items */}
            <div className="border border-slate-800 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-right">Quantity</th>
                    <th className="p-3 text-right">Price</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {selectedInvoice.items?.map((item: any) => (
                    <tr key={item.id}>
                      <td className="p-3 text-slate-200">{item.description}</td>
                      <td className="p-3 text-right font-mono">{item.quantity}</td>
                      <td className="p-3 text-right font-mono">${Number(item.unitPrice).toFixed(2)}</td>
                      <td className="p-3 text-right font-mono font-bold text-white">${Number(item.amount).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="flex justify-end text-sm">
              <div className="w-64 space-y-1 text-right">
                <div className="flex justify-between text-slate-400 text-xs">
                  <span>Subtotal:</span>
                  <span className="font-mono">${Number(selectedInvoice.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-xs">
                  <span>Tax (0%):</span>
                  <span className="font-mono">$0.00</span>
                </div>
                <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-slate-800">
                  <span>Total Due:</span>
                  <span className="text-[#00F59B] font-mono">${Number(selectedInvoice.totalAmount).toFixed(2)} USD</span>
                </div>
              </div>
            </div>

            {/* Print & Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-2 rounded-lg bg-slate-800"
              >
                <Printer className="w-3.5 h-3.5" /> Print Invoice
              </button>

              {selectedInvoice.checkoutUrl && (
                <a
                  href={selectedInvoice.checkoutUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 bg-[#00F59B] hover:bg-[#10E79D] text-[#080D1A] font-bold text-xs px-4 py-2 rounded-lg transition-colors shadow-glow"
                >
                  Pay via PayPal <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

