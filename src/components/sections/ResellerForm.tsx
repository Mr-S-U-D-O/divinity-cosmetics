"use client";

import React, { useRef } from "react";
import { motion } from "motion/react";

export function ResellerForm() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Staggered reveal variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  return (
    <section className="reseller-section" ref={containerRef}>
      <motion.div 
        className="reseller-container"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        
        {/* Left Side: Pitch */}
        <div className="reseller-pitch">
          <motion.h2 className="reseller-headline" variants={itemVariants}>
            Join our 
            <br />
            <em>exclusive</em> network.
          </motion.h2>
          <motion.p className="reseller-description" variants={itemVariants}>
            Partner with Divinity Cosmetics to bring premium, sustainably sourced African botanicals to your clientele. We offer dedicated support and favorable margins for our authorized stockists.
          </motion.p>
        </div>

        {/* Right Side: Form */}
        <div className="reseller-form-wrapper">
          <form className="reseller-form" onSubmit={(e) => e.preventDefault()}>
            <motion.div className="form-group" variants={itemVariants}>
              <input type="text" id="name" className="form-input" placeholder="Name" required />
            </motion.div>
            
            <motion.div className="form-group" variants={itemVariants}>
              <input type="email" id="email" className="form-input" placeholder="Email" required />
            </motion.div>
            
            <motion.div className="form-group" variants={itemVariants}>
              <input type="tel" id="phone" className="form-input" placeholder="Phone" />
            </motion.div>

            <motion.div className="form-submit-wrapper" variants={itemVariants}>
              <motion.button 
                type="submit" 
                className="form-submit-btn-creative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Submit Application
              </motion.button>
            </motion.div>
          </form>
        </div>

      </motion.div>
    </section>
  );
}
