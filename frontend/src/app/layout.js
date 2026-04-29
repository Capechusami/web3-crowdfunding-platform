import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/context/Web3Context";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "FundChain — Decentralized Crowdfunding Platform",
  description: "Raise capital, invest in innovation, and support early-stage startups on Ethereum with complete blockchain transparency.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white">
        <Web3Provider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </Web3Provider>
      </body>
    </html>
  );
}
