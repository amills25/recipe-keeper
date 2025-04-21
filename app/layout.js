import Link from "next/link";
import { Button } from "@/components/ui/button";
import "./globals.css";

export const metadata = {
  title: "Mills Recipe Book",
  description: "A simple recipe app",
  applicationName: "Mills Recipe Book",

  manifest: "/manifest.json",
  themeColor: "#0f172a",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="max-w-4xl p-4 mx-auto">
        <header className="mb-6">
          <nav>
            <Button asChild variant="outline">
              <Link href="/">Home</Link>
            </Button>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
