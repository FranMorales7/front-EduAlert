/** Layout del lado servidor **/
import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
import ClientLayout from './layout-client';

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
        <ClientLayout>{children}</ClientLayout> {/** Se monta dinámicamente **/}
      </body>
    </html>
  );
}
