"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
  };

  return (
    <footer className="footer-container">
      <motion.div 
        className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10"
        variants={staggerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        
        {/* Tier 1 & 2: Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          
          {/* Tier 1: The Hook (Newsletter) */}
          <motion.div className="lg:col-span-7 flex flex-col justify-center" variants={itemVariants}>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-light tracking-tight mb-8 text-[#111]">
              Join our Newsletter.
            </h2>
            <form className="editorial-input-wrapper" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email address" 
                className="editorial-input" 
                required
              />
              <button type="submit" className="editorial-submit" aria-label="Subscribe">
                &rarr;
              </button>
            </form>
          </motion.div>

          {/* Tier 2: The Nav */}
          <motion.div className="footer-nav-grid" variants={itemVariants}>
            <div className="footer-link-group">
              <h4 className="footer-link-heading">Explore</h4>
              <Link href="/shop" className="footer-link">Shop Collection</Link>
              <Link href="/about" className="footer-link">Our Story</Link>
              <Link href="/reseller" className="footer-link">Reseller Program</Link>
              <Link href="/rituals" className="footer-link">Formulations</Link>
            </div>
            <div className="footer-link-group">
              <h4 className="footer-link-heading">Support</h4>
              <Link href="/contact" className="footer-link">Contact Us</Link>
              <Link href="/shipping" className="footer-link">Shipping & Returns</Link>
              <Link href="/faq" className="footer-link">FAQ</Link>
              <Link href="/privacy" className="footer-link">Privacy Policy</Link>
            </div>
          </motion.div>
        </div>

        {/* Social & Copyright Bar */}
        <motion.div className="footer-social-bar" variants={itemVariants}>
          <p className="footer-copyright-text">
            © {currentYear} Divinity Cosmetics. Handcrafted in ZA.
          </p>
          <div className="footer-social-links">
            <a href="#" className="social-icon-link">Instagram</a>
            <span className="social-separator">/</span>
            <a href="#" className="social-icon-link">Facebook</a>
            <span className="social-separator">/</span>
            <a href="#" className="social-icon-link">TikTok</a>
          </div>
        </motion.div>

      </motion.div>

      {/* Tier 3: The Anchor */}
      <motion.div 
        className="footer-massive-text-container"
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as const }}
        viewport={{ once: true, margin: "100px" }}
      >
        <h1 className="footer-massive-text">Divinity</h1>
      </motion.div>
    </footer>
  );
}
