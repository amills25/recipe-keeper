import Link from "next/link";
import { Button } from "@/components/ui/button";
import "./globals.css";

export const metadata = {
  title: "Recipes",
  description: "A simple recipe app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="max-w-4xl mx-auto p-4">
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
