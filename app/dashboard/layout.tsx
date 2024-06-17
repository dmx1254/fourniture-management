import Sidebar from "@/components/Sidebar";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex items-start gap-0 font-mulish">
      <Toaster />
      <div className="sticky left-0 top-0 bottom-0">
        <Sidebar />
      </div>
      <div className="flex-1 w-full h-full">{children}</div>
    </main>
  );
}
