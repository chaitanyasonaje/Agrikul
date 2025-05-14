import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "@/lib/auth";
import { SessionProvider } from "@/components/SessionProvider";
import { CartProviderWrapper } from "@/components/cart/CartProviderWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agrikul - B2B Agricultural Marketplace",
  description: "Connect directly with farmers and buyers for a sustainable agricultural ecosystem",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.className} bg-dark-900 text-white`}>
        <SessionProvider session={session}>
          <CartProviderWrapper>
            {children}
          </CartProviderWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}
