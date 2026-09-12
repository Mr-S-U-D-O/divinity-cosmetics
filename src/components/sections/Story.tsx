import React from "react";
import Link from "next/link";

export function Story() {
  return (
    <section className="story-section">
      <div className="story-content-creative">
        <h2 className="story-title-creative">
          <span className="story-title-line line-1">Rooted in</span>
          <span className="story-title-line line-2">African <em>Soil</em></span>
        </h2>
        
        <div className="story-meta">
          <p className="story-subtext-creative">
            We source the purest indigenous botanicals. Handcrafted with reverence for the earth and formulated for profound skin restoration.
          </p>
          <Link href="/about" className="story-btn-creative">
            discover our story
          </Link>
        </div>
      </div>
    </section>
  );
}
