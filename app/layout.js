import Link from "next/link";
import { Button } from "@/components/ui/button";
import "./globals.css";

export const metadata = {
  title: "Mills Recipe Book",
  description: "A simple recipe app",
  applicationName: "Mills Recipe Book",

  manifest: "/manifest.json",
  themeColor: "#f97316",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="max-w-6xl mx-auto">
          <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-orange-200 mb-8">
            <div className="px-6 py-4">
              <nav className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    Mills Recipe Book
                  </h1>
                </div>
                <Button asChild variant="outline" className="border-orange-300 hover:bg-orange-50">
                  <Link href="/">🏠 Home</Link>
                </Button>
              </nav>
            </div>
          </header>
          <main className="px-6 pb-12">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
