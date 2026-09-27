import React, { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from 'framer-motion';
import { CAVEAT_GLYPH_PATH, SIGNATURE_STROKE_PATH } from './signatureData';

export default function HeroSignature({ onComplete, isLoaded = true, replayInterval = 5000 }) {
  const reduced = useReducedMotion();
  const svgRef = useRef(null);
  const maskStrokeRef = useRef(null);
  const inkTrailRef = useRef(null);
  const loopTimerRef = useRef(null);
  const activeTimelineRef = useRef(null);

  const startAnimation = useCallback(() => {
    if (loopTimerRef.current) {
      clearTimeout(loopTimerRef.current);
      loopTimerRef.current = null;
    }
    if (activeTimelineRef.current) {
      activeTimelineRef.current.kill();
      activeTimelineRef.current = null;
    }

    const maskStroke = maskStrokeRef.current;
    const inkTrail = inkTrailRef.current;

    if (!maskStroke || !inkTrail) {
      onComplete?.();
      return;
    }

    let totalLength = 2450;
    try {
      totalLength = maskStroke.getTotalLength() || 2450;
    } catch {
      totalLength = 2450;
    }

    // Reset stroke to hidden start position
    maskStroke.style.strokeDasharray = `${totalLength}`;
    maskStroke.setAttribute('stroke-dasharray', `${totalLength}`);
    maskStroke.style.strokeDashoffset = `${totalLength}`;
    maskStroke.setAttribute('stroke-dashoffset', `${totalLength}`);

    inkTrail.style.strokeDasharray = `${totalLength}`;
    inkTrail.setAttribute('stroke-dasharray', `${totalLength}`);
    inkTrail.style.strokeDashoffset = `${totalLength}`;
    inkTrail.setAttribute('stroke-dashoffset', `${totalLength}`);
    inkTrail.style.opacity = '1';

    const anim = { progress: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        // Keep fully revealed
        maskStroke.style.strokeDashoffset = '0';
        maskStroke.setAttribute('stroke-dashoffset', '0');
        inkTrail.style.strokeDashoffset = '0';
        inkTrail.setAttribute('stroke-dashoffset', '0');
        inkTrail.style.opacity = '0';
        onComplete?.();

        // Automatically replay every 5 seconds
        loopTimerRef.current = window.setTimeout(() => {
          startAnimation();
        }, replayInterval);
      },
    });

    activeTimelineRef.current = tl;

    tl.to(anim, {
      progress: 1,
      duration: 1.85,
      ease: 'power2.inOut',
      onUpdate: () => {
        const offset = totalLength * (1 - anim.progress);
        maskStroke.style.strokeDashoffset = `${offset}`;
        maskStroke.setAttribute('stroke-dashoffset', `${offset}`);
        if (inkTrail) {
          inkTrail.style.strokeDashoffset = `${offset}`;
          inkTrail.setAttribute('stroke-dashoffset', `${offset}`);
        }
      },
    });
  }, [onComplete, replayInterval]);

  useEffect(() => {
    if (!isLoaded) {
      return undefined;
    }

    // Safety fallback: if anything stalls, reveal solid glyphs after 2.2s
    const failsafe = window.setTimeout(() => {
      onComplete?.();
    }, 2200);

    startAnimation();

    return () => {
      window.clearTimeout(failsafe);
      if (loopTimerRef.current) window.clearTimeout(loopTimerRef.current);
      if (activeTimelineRef.current) activeTimelineRef.current.kill();
    };
  }, [reduced, isLoaded, onComplete, startAnimation]);

  return (
    <div
      className="hero__signature-container"
      onClick={() => startAnimation()}
      title="Click to replay signature (auto-replays every 5s)"
      style={{ cursor: 'pointer' }}
    >
      <svg
        ref={svgRef}
        viewBox="45 45 510 135"
        className="hero__signature-svg"
        role="img"
        aria-label="Nithish B Signature"
      >
        <title>Nithish B</title>
        <defs>
          <filter id="ink-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <mask
            id="hero-reveal-mask"
            maskUnits="userSpaceOnUse"
            maskContentUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="600"
            height="250"
          >
            <path
              ref={maskStrokeRef}
              d={SIGNATURE_STROKE_PATH}
              fill="none"
              stroke="#ffffff"
              strokeWidth="42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </mask>
        </defs>

        {/* 1. Solid Caveat Bold Glyph Letterforms revealed by mask */}
        <g
          className="signature__solid"
          mask="url(#hero-reveal-mask)"
        >
          <path d={CAVEAT_GLYPH_PATH} fill="#a8ff78" />
        </g>

        {/* 2. Soft Glowing Ink Trail following stroke */}
        <path
          ref={inkTrailRef}
          className="signature__ink-trail"
          d={SIGNATURE_STROKE_PATH}
          fill="none"
          stroke="#a8ff78"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#ink-glow)"
          style={{ opacity: 0 }}
        />
      </svg>
    </div>
  );
}
