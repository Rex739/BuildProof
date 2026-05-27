import type { Metadata } from "next";
import { BuildProofProvider } from "@/components/buildproof-provider";
import { Nav } from "@/components/nav";
import { ToastViewport } from "@/components/toast-viewport";
import "./globals.css";

export const metadata: Metadata = {
  title: "BuildProof",
  description: "Portaldot-native proof-of-work verification for builders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <BuildProofProvider>
          <div className="pointer-events-none fixed inset-0 cyber-grid opacity-30" />
          <div className="relative z-10 min-h-screen">
            <Nav />
            {children}
          </div>
          <ToastViewport />
        </BuildProofProvider>
      </body>
    </html>
  );
}
