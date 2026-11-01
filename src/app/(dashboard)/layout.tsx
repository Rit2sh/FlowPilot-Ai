import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { getServerSession } from "@/server/security/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  // If no session found and no demo fallback, redirect to login
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#080D1A] flex flex-col">
      <Navbar businessName={session.businessName} userName={session.name} />
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-[#080D1A] via-[#090F1E] to-[#0B1224]">
          {children}
        </main>
      </div>
    </div>
  );
}

