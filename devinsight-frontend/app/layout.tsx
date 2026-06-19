import "./globals.scss";
import { Inter, Oswald } from "next/font/google";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import StoreProvider from "./StoreProvider";
import AuthGuard from "@/components/AuthGuard";
import { ThemeProvider } from "@/components/ThemeProvider";
import Footer from "@/components/Footer";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

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
      <body className={`${inter.variable} ${oswald.variable} font-sans bg-[var(--background)] text-[var(--foreground)]`}>
        <AnimatedBackground />
        
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <StoreProvider>
            <AuthGuard>
              <div className="relative z-10 flex min-h-screen flex-col">
                <Navbar />
                <div className="flex-1">
                  {children}
                </div>
                <Footer />
              </div>
            </AuthGuard>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
