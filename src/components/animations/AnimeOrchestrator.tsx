"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { animate, spring, onScroll } from "animejs";

/**
 * Global Anime.js v4 Botanical-Luxury Orchestrator.
 * 
 * Philosophy:
 * 1. ZERO BLINKING / NO POP-IN: All content is painted by SSR and remains visible.
 *    Never set opacity to 0 or [0, 1] on scroll triggers.
 * 2. CONTINUOUS PARALLAX DEPTH: Uses Anime.js onScroll({ sync: 0.15 }) to smoothly
 *    scrub translateY on botanical imagery across viewport scroll with analog depth.
 * 3. VISCOUS TACTILE DAMPING: Pill buttons and interactive elements respond with
 *    dense spring physics evoking cold-pressed Marula oil ("takes 2-3 minutes to sink in").
 * 4. BOTANICAL FAQ ACCORDION: Smoothly interpolates answer disclosure & chevron kinematics.
 */
export function AnimeOrchestrator() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const cleanups: Array<{ revert: () => void }> = [];

    // Small RAF delay to ensure the route DOM is mounted
    const rafId = window.requestAnimationFrame(() => {
      // =======================================================================
      // 1. CONTINUOUS BOTANICAL PARALLAX SCRUBBING (Homepage #story section)
      // =======================================================================
      const storySection = document.querySelector("#story.story-section");
      if (storySection) {
        const lotionImg = storySection.querySelector('[data-story-img="lotion"]');
        const jarImg = storySection.querySelector('[data-story-img="jar"]');
        const handsImg = storySection.querySelector('[data-story-img="hands"]');

        if (lotionImg) {
          const anim = animate(lotionImg, {
            translateY: [-22, 22],
            ease: "linear",
            autoplay: false,
          });
          const obs = onScroll({
            target: storySection as HTMLElement,
            enter: "top bottom",
            leave: "bottom top",
            sync: 0.15,
          }).link(anim);
          cleanups.push(anim, obs);
        }

        if (jarImg) {
          const anim = animate(jarImg, {
            translateY: [16, -16],
            ease: "linear",
            autoplay: false,
          });
          const obs = onScroll({
            target: storySection as HTMLElement,
            enter: "top bottom",
            leave: "bottom top",
            sync: 0.15,
          }).link(anim);
          cleanups.push(anim, obs);
        }

        if (handsImg) {
          const anim = animate(handsImg, {
            translateY: [-26, 26],
            ease: "linear",
            autoplay: false,
          });
          const obs = onScroll({
            target: storySection as HTMLElement,
            enter: "top bottom",
            leave: "bottom top",
            sync: 0.15,
          }).link(anim);
          cleanups.push(anim, obs);
        }
      }

      // =======================================================================
      // 2. CONTINUOUS BOTANICAL PARALLAX (Reseller Network section)
      // =======================================================================
      const resellerSection = document.querySelector("#network");
      if (resellerSection) {
        const resellerImg = resellerSection.querySelector('[data-reseller-img="bottle"]');
        if (resellerImg) {
          const anim = animate(resellerImg, {
            translateY: [-20, 20],
            ease: "linear",
            autoplay: false,
          });
          const obs = onScroll({
            target: resellerSection as HTMLElement,
            enter: "top bottom",
            leave: "bottom top",
            sync: 0.15,
          }).link(anim);
          cleanups.push(anim, obs);
        }
      }

      // =======================================================================
      // 3. CONTINUOUS WATERMARK PARALLAX (Footer "Divinity" typographic anchor)
      // =======================================================================
      const footerEl = document.querySelector("footer.footer-container");
      const watermarkEl = footerEl?.querySelector('[data-anime="footer-watermark"]');
      if (footerEl && watermarkEl) {
        const anim = animate(watermarkEl, {
          translateY: [28, -14],
          ease: "linear",
          autoplay: false,
        });
        const obs = onScroll({
          target: footerEl as HTMLElement,
          enter: "top bottom",
          leave: "bottom top",
          sync: 0.15,
        }).link(anim);
        cleanups.push(anim, obs);
      }

      // =======================================================================
      // 4. SMOOTH BOTANICAL FAQ ACCORDION KINEMATICS
      // =======================================================================
      const faqItems = document.querySelectorAll(".faq-item");
      faqItems.forEach((item) => {
        const details = item as HTMLDetailsElement;
        const chevron = details.querySelector(".faq-chevron");
        const answer = details.querySelector("p");

        const handleToggle = () => {
          if (details.open) {
            if (chevron) {
              animate(chevron, {
                rotate: 180,
                ease: spring({ mass: 1, stiffness: 180, damping: 14 }),
              });
            }
            if (answer) {
              animate(answer, {
                opacity: [0.5, 1],
                translateY: [-6, 0],
                duration: 420,
                ease: "outQuart",
              });
            }
          } else {
            if (chevron) {
              animate(chevron, {
                rotate: 0,
                ease: spring({ mass: 1, stiffness: 180, damping: 14 }),
              });
            }
          }
        };

        details.addEventListener("toggle", handleToggle);
        cleanups.push({
          revert: () => details.removeEventListener("toggle", handleToggle),
        });
      });

      // =======================================================================
      // 5. VISCOUS TACTILE MAGNETIC DAMPING FOR PILL BUTTONS (.btn-primary, .btn-secondary)
      // =======================================================================
      const buttons = document.querySelectorAll(".btn-primary, .btn-secondary");
      buttons.forEach((btn) => {
        const buttonEl = btn as HTMLElement;

        const onMouseEnter = () => {
          animate(buttonEl, {
            translateY: -2,
            scale: 1.015,
            ease: spring({ mass: 1.3, stiffness: 85, damping: 18 }),
          });
          const icon = buttonEl.querySelector("svg");
          if (icon) {
            animate(icon, {
              translateX: [0, 3],
              ease: spring({ mass: 1, stiffness: 160, damping: 12 }),
            });
          }
        };

        const onMouseLeave = () => {
          animate(buttonEl, {
            translateY: 0,
            scale: 1,
            duration: 420,
            ease: "outExpo",
          });
          const icon = buttonEl.querySelector("svg");
          if (icon) {
            animate(icon, {
              translateX: 0,
              duration: 350,
              ease: "outExpo",
            });
          }
        };

        const onMouseDown = () => {
          animate(buttonEl, {
            scale: 0.985,
            duration: 120,
            ease: "outQuad",
          });
        };

        const onMouseUp = () => {
          animate(buttonEl, {
            scale: 1.015,
            ease: spring({ mass: 1, stiffness: 200, damping: 12 }),
          });
        };

        buttonEl.addEventListener("mouseenter", onMouseEnter);
        buttonEl.addEventListener("mouseleave", onMouseLeave);
        buttonEl.addEventListener("mousedown", onMouseDown);
        buttonEl.addEventListener("mouseup", onMouseUp);

        cleanups.push({
          revert: () => {
            buttonEl.removeEventListener("mouseenter", onMouseEnter);
            buttonEl.removeEventListener("mouseleave", onMouseLeave);
            buttonEl.removeEventListener("mousedown", onMouseDown);
            buttonEl.removeEventListener("mouseup", onMouseUp);
          },
        });
      });
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      cleanups.forEach((item) => {
        try {
          item.revert();
        } catch {
          // Ignore cleanup errors on already-unmounted nodes
        }
      });
    };
  }, [pathname]);

  return null;
}
