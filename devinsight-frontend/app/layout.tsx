import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DevInsight AI",
  description: "AI powered repository analysis platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[var(--background)] text-[var(--foreground)]`}>
        <AnimatedBackground />
        
        <div className="relative z-10">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
