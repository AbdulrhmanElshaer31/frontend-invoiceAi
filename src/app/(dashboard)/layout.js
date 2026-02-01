import Sidebar from "@/components/sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#EAEFEF]">
      <Sidebar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}