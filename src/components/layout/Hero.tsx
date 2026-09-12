"use client";

import React, { useEffect, useRef } from "react";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <section className="hero">
      {/* Background video — centered, transparent bg, plays once */}
      <video
        ref={videoRef}
        className="hero-video"
        muted
        playsInline
        preload="auto"
      >
        <source
          src="/videos/White_lotion_bottle_spinning_1080p_20260912160202.webm"
          type="video/webm"
        />
      </video>

      {/* Text overlay — right side, vertically centered */}
      <div className="hero-text">
        <h1 className="hero-heading">
          <span className="hero-heading-top">Natural</span>
          <span className="hero-heading-bottom">Restoration</span>
        </h1>
      </div>

      {/* CTA buttons — bottom left */}
      <div className="hero-actions">
        <button className="hero-btn" type="button">Explore</button>
        <button className="hero-btn" type="button">Rituals</button>
      </div>
    </section>
  );
}