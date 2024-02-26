import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/toaster";
import Receive from "./modals/receive";
import Withdraw from "./modals/send";
import { getCurrentUser } from "./actions";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chimoney -- Ayomide",
  description: "A simple app to demo the powers of the chimoney api",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  const isAuthenticated = !!user?.email;

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <Header />
        <main className="px-6 md:px-10">{children}</main>
        <Toaster />

        {/* Modals */}
        {isAuthenticated && (
          <>
            <Receive />
            <Withdraw />
          </>
        )}
      </body>
    </html>
  );
}
