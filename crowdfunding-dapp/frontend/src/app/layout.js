import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/context/Web3Context";
import ConnectWallet from "@/components/ConnectWallet";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Crowdfunding dApp",
  description: "Decentralized crowdfunding on Ethereum",
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
      <body className="min-h-full flex flex-col bg-gray-50 dark:bg-gray-950">
        <Web3Provider>
          <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <Link href="/" className="text-lg font-semibold">
                Crowdfunding dApp
              </Link>
              <ConnectWallet />
            </div>
          </header>
          <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
            {children}
          </main>
        </Web3Provider>
      </body>
    </html>
  );
}
