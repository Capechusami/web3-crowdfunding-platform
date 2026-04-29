"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const VISION_CARDS = [
  {
    title: "Tech Innovation",
    desc: "Funding the next breakthrough",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    alt: "Circuit board representing tech innovation",
  },
  {
    title: "AI & ML Projects",
    desc: "Building intelligent futures",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=600&q=80",
    alt: "AI and machine learning visualization",
  },
  {
    title: "Web3 Pioneers",
    desc: "Decentralizing the world",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80",
    alt: "Blockchain network nodes",
    featured: true,
  },
  {
    title: "Climate Tech",
    desc: "Sustainable startup solutions",
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=600&q=80",
    alt: "Renewable energy and sustainability",
  },
  {
    title: "DeFi Platforms",
    desc: "Reimagining finance",
    image: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?auto=format&fit=crop&w=600&q=80",
    alt: "Decentralized finance dashboard",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Support our Vision for What<br />the Future can be
          </h2>
          <p className="text-gray-600 mb-8">
            To mobilize founders and investors to transform innovative ideas into
            successful startups in the most trusted manner.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all text-sm font-medium"
            >
              Join our Community
            </Link>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all text-sm font-medium"
            >
              Launch a Campaign
            </Link>
          </div>
        </motion.div>

        {/* Image grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {VISION_CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              className={`relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group ${
                card.featured ? "md:scale-105" : ""
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Image
                src={card.image}
                alt={card.alt}
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-white font-bold text-lg mb-1 leading-tight">
                  {card.title}
                </h3>
                <p className="text-white/85 text-xs">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
