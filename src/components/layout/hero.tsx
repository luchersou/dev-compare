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

      {/* GRID */}
      <div className="bg-grid absolute inset-0" />

      {/* BLOBS */}
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-accent opacity-20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-accent opacity-10 blur-3xl" />

      {/* CONTENT */}
      <motion.div
        className="relative z-10 mx-auto max-w-5xl px-6 py-32 text-center"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.15 }}
      >

        {/* Badge */}
        <motion.div variants={fadeUp} transition={{ duration: 0.5 }}>
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            npm intelligence
          </span>
        </motion.div>

        {/* Title — serif no destaque, sans no resto */}
        <motion.h1
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="mt-4 text-5xl tracking-tight text-foreground md:text-7xl"
        >
          <span className="font-sans font-semibold">Compare</span>{" "}
          <em className="font-serif font-normal italic text-primary not-italic">
            npm packages
          </em>
          <span className="mt-2 block font-sans font-semibold text-muted-foreground">
            side by side
          </span>
        </motion.h1>

        {/* Divider decorativo */}
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