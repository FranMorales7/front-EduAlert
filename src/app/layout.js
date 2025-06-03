import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
import SessionWrapper from "@/lib/SessionWrapper";
import { Toaster } from "react-hot-toast";
import GlobalNotificationListener from "@/components/notification/GlobalNotificationListener";

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
        <SessionWrapper className="w-full min-h-screen">
          {children}
          <GlobalNotificationListener />
          </SessionWrapper>
         <Toaster position="top-right" />
      </body>
    </html>
  );
}