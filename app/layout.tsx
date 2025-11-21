import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Léopoldine Almeida - Coach de Vie",
  description:
    "Coach de vie spécialisée dans l'accompagnement pour retrouver clarté, confiance et équilibre",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main>{children}</main>
        <footer className="bg-gray-100 mt-12 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600">
            © {new Date().getFullYear()} Léopoldine Almeida — Coach de Vie
            Professionnelle •{" "}
            <a
              href="mailto:contact@leopoldine-almeida.com"
              className="text-purple-600"
            >
              Contact
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
