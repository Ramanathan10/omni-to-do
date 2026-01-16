import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Omni To-Do",
  description: "OmniFocus-inspired task management app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
