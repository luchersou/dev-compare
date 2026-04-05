"use client";

import { motion } from "motion/react";
import { SearchBar } from "@/components/search/search-bar";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden">

      {/* CONTENT */}
      <motion.div
        className="relative z-30 mx-auto max-w-5xl px-6 py-32 text-center"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.15 }}
      >

        {/* Badge */}
        <motion.div variants={fadeUp} transition={{ duration: 0.5 }}>
          <span className="relative font-mono text-xs tracking-widest text-muted-foreground uppercase border border-border rounded-full px-3 py-1">
            npm intelligence
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="mt-4 text-5xl tracking-tighter text-foreground md:text-7xl"
        >
          <span className="font-sans font-semibold">Compare</span>{" "}
          <em className="font-serif font-normal italic text-primary">
            npm packages
          </em>
          <span className="mt-2 block font-sans font-semibold bg-gradient-to-r from-muted-foreground to-muted-foreground/30 bg-clip-text text-transparent">
            side by side
          </span>
        </motion.h1>

        {/* Divider */}
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-8 h-px w-16 bg-border"
        />

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          Analyze downloads, bundle size, and performance to choose the best
          package for your project.
        </motion.p>

        {/* Search */}
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="mt-10"
        >
          <SearchBar />
        </motion.div>

      </motion.div>
    </section>
  );
}