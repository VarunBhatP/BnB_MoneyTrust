import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BnB MoneyTrust",
  description: "Smart Money Management for Your BnB Business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
        <AuthProvider>
          <Header />
          <main className="flex-1 bg-gray-50">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
