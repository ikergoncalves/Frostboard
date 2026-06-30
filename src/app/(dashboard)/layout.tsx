import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNavProvider } from "@/components/layout/mobile-nav-context";
import { ToastProvider } from "@/components/layout/toast-boundary";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <MobileNavProvider>
        <div className="fb-shell">
          <Sidebar />
          <div className="fb-main">
            <Header />
            <main className="fb-content">{children}</main>
          </div>
        </div>
      </MobileNavProvider>
    </ToastProvider>
  );
}
