import Link from "next/link";

const FOOTER_LINKS = {
  Fundraise: [
    { label: "How it works", href: "/how-it-works" },
    { label: "Legacy & Memorial", href: "#" },
    { label: "Emergency", href: "#" },
    { label: "Resources", href: "#" },
  ],
  "Ways to give": [
    { label: "Discover", href: "/explore" },
    { label: "Emergency Relief", href: "#" },
    { label: "Zakat", href: "#" },
    { label: "Friday Givers", href: "#" },
  ],
  "About FundChain": [
    { label: "About us", href: "/about" },
    { label: "Careers (We're hiring!)", href: "#" },
    { label: "Contact us", href: "#" },
    { label: "Safety & Compliance", href: "#" },
    { label: "Support center", href: "#" },
  ],
  Campaign: [
    { label: "Online campaigns", href: "/explore" },
    { label: "FAQ", href: "/faq" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-bold text-gray-900 mb-4">
                {title}
              </h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-gray-500 hover:text-emerald-600 transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-gray-500 hover:text-emerald-600 transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="lg:col-span-2">
            <div className="bg-emerald-50 rounded-2xl p-6">
              <h4 className="text-sm font-bold text-gray-900 mb-2">
                Stay connected, join our newsletter
              </h4>
              <div className="flex gap-2 mt-4">
                <input
                  type="email"
                  placeholder="Email address"
                  className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
                />
                <button className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white hover:bg-emerald-700 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                Our founders started with a belief that blockchain technology can transform how startups raise capital. Join our community.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-emerald-600">FundChain</span>
            </Link>

            {/* Links */}
            <div className="flex items-center gap-6">
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">Terms</Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">Privacy</Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">Cookies</Link>
            </div>

            {/* Social */}
            <div className="flex items-center gap-3">
              <SocialIcon href="https://linkedin.com" label="LinkedIn">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                <circle cx="4" cy="4" r="2" />
              </SocialIcon>
              <SocialIcon href="https://facebook.com" label="Facebook">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </SocialIcon>
              <SocialIcon href="https://twitter.com" label="Twitter">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
              </SocialIcon>
            </div>
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">
            &copy; {new Date().getFullYear()} FundChain. Built on Ethereum. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:border-emerald-600 transition-all"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        {children}
      </svg>
    </a>
  );
}
