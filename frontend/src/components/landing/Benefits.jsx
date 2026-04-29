"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const PURPOSES = [
  {
    title: "Fund early-stage startups",
    desc: "Perfect for founders launching their first product, building MVPs, or scaling innovative ideas…",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=80",
    alt: "Startup team collaborating in a modern workspace",
  },
  {
    title: "Back innovative projects",
    desc: "Discover and support breakthrough ideas in tech, AI, Web3, and beyond — invest in what matters…",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=900&q=80",
    alt: "Blockchain and cryptocurrency innovation",
  },
];

export default function Benefits() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            What&apos;s the purpose<br />of FundChain?
          </motion.h2>
          <motion.p
            className="text-base text-gray-600 leading-relaxed lg:pt-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            FundChain empowers founders and investors to connect directly through transparent, 
            blockchain-secured crowdfunding — no middlemen, no platform fees, just pure innovation.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {PURPOSES.map((p, i) => (
            <motion.div
              key={p.title}
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div className="border border-gray-200 rounded-2xl p-8 hover:border-emerald-200 hover:shadow-lg transition-all">
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-6 bg-gray-100">
                  <Image
                    src={p.image}
                    alt={p.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{p.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
