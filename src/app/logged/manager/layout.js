import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
import Sidebar from "@/components/sidebar_admins";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "EduAlert!",
  description: "Keep track on class",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex`}>
        <Sidebar />
        <main className="mx-2 w-full min-h-screen p-4">
          {children}
        </main>
        
      </body>
    </html>
  );
}