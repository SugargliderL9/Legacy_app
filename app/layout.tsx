import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "./global.css";
import AnimatedBackground from "@/components/AnimatedBackground";

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={spaceMono.variable}>
      <body className="font-liminal antialiased min-h-screen text-[15px]">
        <AnimatedBackground />
        {children}
      </body>
    </html>
  );
}
