"use client";

import { useState, useEffect } from "react";
import { Users, Search, Plus, Mail, Phone, Building, DollarSign, X } from "lucide-react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const url = new URL("/api/customers", window.location.origin);
      if (search) url.searchParams.set("query", search);
      const res = await fetch(url.toString());
      if (res.ok) {
        const json = await res.json();
        setCustomers(json.customers || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    try {
      setSubmitting(true);
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, phone, address }),
      });
      if (res.ok) {
        setShowCreateModal(false);
        setName("");
        setEmail("");
        setCompany("");
        setPhone("");
        setAddress("");
        fetchCustomers();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Customer Directory
            <span className="text-xs bg-emerald-950 text-[#00F59B] border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-mono font-medium">
              Verified Accounts
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            Client accounts, historical billing totals, outstanding balances, and payment behavior tracking.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-[#00F59B] hover:bg-[#10E79D] text-[#080D1A] font-bold text-xs px-4 py-2.5 rounded-xl shadow-glow transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-panel p-3 rounded-xl border border-slate-800 flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search customer name, email or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchCustomers()}
            className="w-full bg-[#0D1629] border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00F59B]"
          />
        </div>
        <span className="text-xs text-slate-400 font-mono hidden sm:inline">
          {customers.length} Accounts Registered
        </span>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 text-center p-8 text-slate-500 font-mono">
            Loading customers from database...
          </div>
        ) : customers.length === 0 ? (
          <div className="col-span-3 text-center p-8 text-slate-500">
            No customer accounts found.
          </div>
        ) : (
          customers.map((c) => (
            <div key={c.id} className="glass-panel p-5 rounded-2xl space-y-4 border border-slate-800 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-white font-bold flex items-center justify-center text-sm border border-slate-700">
                    {c.name.substring(0, 2).toUpperCase()}
                  </div>
                  {c.isDemo && (
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                      DEMO
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-white text-base">{c.name}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <Building className="w-3.5 h-3.5 text-slate-500" /> {c.company || c.name}
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-400 pt-1 border-t border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{c.email}</span>
                  </div>
                  {c.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{c.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Snapshot */}
              <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Billed</span>
                  <span className="font-mono font-bold text-slate-200">${c.totalBilled.toLocaleString()}</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Outstanding</span>
                  <span
                    className={`font-mono font-bold ${
                      c.outstanding > 0 ? "text-amber-400" : "text-[#00F59B]"
                    }`}
                  >
                    ${c.outstanding.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Create Customer */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D1629] border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-[#00F59B]" />
                Add Customer Profile
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Contact / Customer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe or Acme Corp"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#080D1A] border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-[#00F59B]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Billing Email</label>
                <input
                  type="email"
                  required
                  placeholder="billing@client.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#080D1A] border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-[#00F59B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Company Name</label>
                  <input
                    type="text"
                    placeholder="Acme Global Inc"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-[#080D1A] border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-[#00F59B]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#080D1A] border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-[#00F59B]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Billing Address</label>
                <input
                  type="text"
                  placeholder="100 Main St, Suite 400, New York, NY"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#080D1A] border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-[#00F59B]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#00F59B] hover:bg-[#10E79D] text-[#080D1A] font-bold px-4 py-2 rounded-lg transition-colors shadow-glow"
                >
                  {submitting ? "Saving..." : "Create Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

