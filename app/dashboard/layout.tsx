import Header from "@/components/Header";
import { ProviderSession } from "@/components/ProviderSession";
import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProviderSession>
      <main className="flex items-start gap-0 font-mulish">
        <div className="hidden md:block sticky left-0 top-0 bottom-0">
          <Sidebar />
        </div>
        <div className="md:hidden fixed left-0 top-0 bottom-0 z-50">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col w-full h-full md:ml-0 ml-[60px]">
          <Header />
          <div className="w-full mx-auto self-center">{children}</div>
        </div>
      </main>
    </ProviderSession>
  );
}
