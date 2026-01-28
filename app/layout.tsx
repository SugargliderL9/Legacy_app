import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-liminal",
});

export const metadata: Metadata = {
  title: "Task Manager Legacy",
  description: "Sistema de gestión de tareas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={spaceMono.variable}>
      <body className="font-liminal antialiased min-h-screen text-[15px]">{children}</body>
    </html>
  );
}
