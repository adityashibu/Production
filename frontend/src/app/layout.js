import { Inter } from "next/font/google";
import "./ui/globals.css";

import { motion } from "framer-motion";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PowerHouse",
  description: "PowerHouse is a modern web application for managing your home.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
