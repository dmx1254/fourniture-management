import type { Metadata } from "next";
import { Inter, Mulish } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

const mulish = Mulish({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  variable: "--font-mulish",
});

export const metadata: Metadata = {
  title: "PMN",
  description: "Gestion de produits informatiques",
  icons:{
    icon: "/pmn.jpeg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          inter.className,
          mulish.variable,
          "bg-background text-foreground"
        )}
      >
        
        {children}
      </body>
    </html>
  );
}
