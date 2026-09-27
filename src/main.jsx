import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import emailjs from '@emailjs/browser';
import { ArrowUpRight, BadgeCheck, BookOpen, ChevronDown, ChevronLeft, ChevronRight, Mail, MapPin, MoveRight, Phone, School, X } from 'lucide-react';
import { SiGithub, SiLeetcode } from 'react-icons/si';
import { FaLinkedinIn } from 'react-icons/fa6';
import './styles.css';
import HeroSignature from './HeroSignature';
import HeroTerminal from './HeroTerminal';
import { projects, skillsData } from './portfolioData';

const navItems = [
  ['home', 'HOME'],
  ['about', 'ABOUT'],
  ['skills', 'SKILLS'],
  ['projects', 'PROJECTS'],
  ['contact', 'CONTACT'],
  ['resume', 'RESUME'],
];





const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#01';

function ScrambleText({ text, className = '', triggerOnHover = true, as = 'span', delay = 0 }) {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const hasAnimated = useRef(false);
  const elementRef = useRef(null);
  const intervalRef = useRef(null);

  const startScramble = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    let iteration = 0;
    const length = text.length;
    setIsScrambling(true);

    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) return text[index];
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          })
          .join('')
      );

      if (iteration >= length) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setDisplayText(text);
        setIsScrambling(false);
      }
      iteration += 1 / 2;
    }, 25);
  };

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          if (delay > 0) {
            setTimeout(startScramble, delay * 1000);
          } else {
            startScramble();
          }
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, delay]);

  const Component = as;
  return (
    <Component
      ref={elementRef}
      className={`text-scramble ${isScrambling ? 'text-scramble-active' : ''} ${className}`}
      onMouseEnter={triggerOnHover ? startScramble : undefined}
    >
      {displayText}
    </Component>
  );
}

function SplitHeading({ lines, className = '', retriggerKey }) {
  const reduced = useReducedMotion();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.04,
      },
    },
  };

  const wordVariants = {
    hidden: { y: '115%', opacity: 0, rotateX: 20, filter: 'blur(3px)' },
    visible: {
      y: '0%',
      opacity: 1,
      rotateX: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.58,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  if (reduced) {
    return (
      <h2 className={className}>
        {lines.map((line, idx) => (
          <React.Fragment key={idx}>
            {line}
            {idx < lines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </h2>
    );
  }

  return (
    <motion.h2
      key={retriggerKey}
      className={`kinetic-heading ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {lines.map((line, lineIdx) => {
        if (typeof line === 'string') {
          const words = line.split(/\s+/).filter(Boolean);
          return (
            <span key={lineIdx} className="kinetic-heading__line">
              {words.map((word, wordIdx) => (
                <span key={wordIdx} className="kinetic-heading__word-wrap">
                  <motion.span className="kinetic-heading__word" variants={wordVariants}>
                    {word}
                  </motion.span>
                  {wordIdx < words.length - 1 && <span className="kinetic-heading__space">&nbsp;</span>}
                </span>
              ))}
              {lineIdx < lines.length - 1 && <span className="kinetic-heading__break" />}
            </span>
          );
        }

        return (
          <span key={lineIdx} className="kinetic-heading__line">
            <span className="kinetic-heading__word-wrap">
              <motion.span className="kinetic-heading__word" variants={wordVariants}>
                {line}
              </motion.span>
            </span>
            {lineIdx < lines.length - 1 && <span className="kinetic-heading__break" />}
          </span>
        );
      })}
    </motion.h2>
  );
}

function InteractiveChars({ text, className = '' }) {
  return (
    <span className={className}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          className={char === ' ' ? '' : 'char-interactive'}
          style={char === ' ' ? { display: 'inline' } : undefined}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}

function AnimatedParagraph({ children, className = '', delay = 0, retriggerKey }) {
  const reduced = useReducedMotion();
  if (reduced) return <p className={`kinetic-paragraph ${className}`}>{children}</p>;

  if (typeof children === 'string') {
    const words = children.split(/\s+/).filter(Boolean);
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.014,
          delayChildren: delay,
        },
      },
    };

    const wordVariants = {
      hidden: {
        opacity: 0,
        y: 10,
        filter: 'blur(3px)',
      },
      visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
          duration: 0.38,
          ease: [0.16, 1, 0.3, 1],
        },
      },
    };

    return (
      <motion.p
        key={retriggerKey}
        className={`kinetic-paragraph ${className}`}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {words.map((word, index) => (
          <span key={index} className="kinetic-p-word">
            <motion.span className="kinetic-p-word__inner" variants={wordVariants}>
              {word}
            </motion.span>
            {index < words.length - 1 && <span className="kinetic-p-space">&nbsp;</span>}
          </span>
        ))}
      </motion.p>
    );
  }

  return (
    <motion.p
      key={retriggerKey}
      className={`kinetic-paragraph ${className}`}
      initial={{ opacity: 0, y: 16, filter: 'blur(3px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.p>
  );
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return reduced;
}

function CustomCursor() {
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const springX = useSpring(x, { stiffness: 500, damping: 30 });
  const springY = useSpring(y, { stiffness: 500, damping: 30 });
  useEffect(() => {
    const move = (event) => {
      setVisible(true);
      x.set(event.clientX);
      y.set(event.clientY);
    };
    const onOver = (event) => setActive(Boolean(event.target.closest('a, button, [data-cursor]')));
    const onLeave = () => setVisible(false);
    window.addEventListener('pointermove', move);
    window.addEventListener('mouseover', onOver);
    document.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [x, y]);
  return (
    <motion.div
      className={`cursor ${active ? 'cursor--active' : ''}`}
      style={{ left: springX, top: springY, opacity: visible ? 1 : 0 }}
      aria-hidden="true"
    />
  );
}

function Preloader({ onDone }) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, 1750);
    return () => window.clearTimeout(timer);
  }, [onDone]);
  return (
    <motion.div className="preloader" initial={{ opacity: 1 }} exit={{ y: '-100%' }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}>
      <div className="preloader__meta">
        <ScrambleText text="R V COLLEGE OF ENGINEERING / CSE" triggerOnHover={false} />
        <ScrambleText text="BOOTING PORTFOLIO" triggerOnHover={false} delay={0.2} />
      </div>
      <motion.div className="preloader__name" initial={{ letterSpacing: '0.8em', opacity: 0, filter: 'blur(8px)' }} animate={{ letterSpacing: '0.04em', opacity: 1, filter: 'blur(0px)' }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
        <InteractiveChars text="NITHISH" /><span className="accent">.</span>
      </motion.div>
      <div className="preloader__bar"><motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.4, ease: 'easeInOut' }} /></div>
    </motion.div>
  );
}

function MagneticButton({ children, href = '#projects', className = '', onNavigate }) {
  const ref = useRef(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18 }); const sy = useSpring(y, { stiffness: 260, damping: 18 });
  const move = (event) => { const rect = ref.current?.getBoundingClientRect(); if (!rect) return; x.set((event.clientX - (rect.left + rect.width / 2)) * 0.2); y.set((event.clientY - (rect.top + rect.height / 2)) * 0.2); };
  const target = href.replace('#', '');
  return <motion.a ref={ref} href={href} className={`magnetic ${className}`} style={{ x: sx, y: sy }} onClick={(event) => { event.preventDefault(); onNavigate?.(target); }} onMouseMove={move} onMouseLeave={() => { x.set(0); y.set(0); }}>{children}</motion.a>;
}

function Nav({ active, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = (id) => { setMenuOpen(false); onNavigate(id); };
  return <nav className="site-nav site-nav--scrolled" aria-label="Primary navigation">
    <button className="nav-logo" onClick={() => navigate('home')} aria-label="Go to home">
      <span className="nav-logo__badge">
        <span className="nav-logo__text">N<span className="nav-logo__dot">.</span></span>
      </span>
    </button>
    <div className={`nav-links ${menuOpen ? 'nav-links--open' : ''}`}>
      {navItems.map(([id, label]) => <button key={id} className={active === id ? 'nav-link nav-link--active' : 'nav-link'} onClick={() => navigate(id)}>{label}{id === 'resume' && ' ↓'}</button>)}
    </div>
    <span className="nav-status"><i /> OPEN TO WORK</span>
    <button className="nav-menu" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}><span /><span /></button>
  </nav>;
}

function ResumeDownload() {
  const reduced = useReducedMotion();
  const [state, setState] = useState('idle');
  const [typedCommand, setTypedCommand] = useState('');
  const [progress, setProgress] = useState(0);
  const timersRef = useRef([]);
  const resumeHref = '/NITHISH B(RESUME).pdf';
  const command = '$ curl -O NITHISH_B_RESUME.pdf';

  const clearTimers = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  };
  const later = (callback, delay) => {
    const timer = window.setTimeout(callback, delay);
    timersRef.current.push(timer);
  };
  const reset = () => {
    clearTimers();
    setState('idle');
    setTypedCommand('');
    setProgress(0);
  };

  useEffect(() => () => clearTimers(), []);

  const triggerDownload = () => {
    const link = document.createElement('a');
    link.href = resumeHref;
    link.download = 'NITHISH_B_RESUME.pdf';
    link.target = '_blank';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleDownload = () => {
    if (state !== 'idle') return;
    // Download is intentionally first: visual effects can fail without blocking it.
    triggerDownload();
    clearTimers();
    if (reduced) {
      setState('typing');
      later(() => setState('done'), 140);
      later(reset, 1640);
      return;
    }

    setState('typing');
    [...command].forEach((_, index) => {
      later(() => setTypedCommand(command.slice(0, index + 1)), (index + 1) * 35);
    });
    const progressStart = command.length * 35 + 200;
    later(() => setState('progress'), progressStart);
    [20, 40, 60, 80, 100].forEach((value, index) => {
      later(() => setProgress(value), progressStart + 120 + index * 150);
    });
    later(() => setState('done'), progressStart + 900);
    // Independent reset fallback, including interrupted timers or render errors.
    later(reset, progressStart + 2400);
  };

  const progressBar = `${'■'.repeat(progress / 10)}${'□'.repeat(10 - progress / 10)}`;
  const primaryText = state === 'idle' ? '$ download resume' : reduced && state === 'typing' ? '$ downloading...' : typedCommand;
  const secondaryText = state === 'progress' ? `[${progressBar}] ${progress}%` : state === 'done' ? (reduced ? '✓ done' : '✓ NITHISH_B_RESUME.pdf saved') : '';

  return <button className={`resume-download resume-download--${state}`} type="button" onClick={handleDownload} disabled={state !== 'idle'} aria-label="Download resume" aria-live="polite">
    <span className="resume-download__line">{primaryText}{state === 'idle' && <i className="resume-download__cursor" aria-hidden="true" />}</span>
    <span className="resume-download__line resume-download__result" aria-hidden={!secondaryText}>{secondaryText || '\u00a0'}</span>
  </button>;
}

function Resume() {
  return (
    <section className="resume section-shell" id="resume">
      <div className="section-tag"><ScrambleText text="/ 004 — HANDOFF" /></div>
      <div className="resume__layout">
        <SplitHeading lines={['TAKE THE', <span className="outline">SOURCE.</span>]} />
        <div>
          <AnimatedParagraph>
            One page, no maze. Download the current resume for the fast version of what I build and where I am headed.
          </AnimatedParagraph>
          <ResumeDownload />
        </div>
      </div>
    </section>
  );
}

function Hero({ onNavigate, isLoaded = true }) {
  const reduced = useReducedMotion();
  const [signatureComplete, setSignatureComplete] = useState(false);

  useEffect(() => {
    if (reduced) {
      setSignatureComplete(true);
      return undefined;
    }
    // Hard failsafe guardrail: Ensure right column content reveals even if animation fails or stalls
    const fallback = window.setTimeout(() => setSignatureComplete(true), 2400);
    return () => window.clearTimeout(fallback);
  }, [reduced]);

  const heroSocials = [
    { label: 'Email', tooltip: 'Email', href: 'mailto:nithish7483@gmail.com', icon: Mail },
    { label: 'LinkedIn', tooltip: 'LinkedIn', href: 'https://www.linkedin.com/in/nithishb03/', icon: FaLinkedinIn },
    { label: 'GitHub', tooltip: 'GitHub', href: 'https://github.com/Nithishb03', icon: SiGithub },
    { label: 'LeetCode', tooltip: 'LeetCode', href: 'https://leetcode.com/u/_nithishb/', icon: SiLeetcode },
    { label: 'Phone', tooltip: 'Call (+91 7483459123)', href: 'tel:+917483459123', icon: Phone },
  ];

  const handleScroll = (id) => {
    onNavigate?.(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const contentVariants = {
    hidden: { opacity: reduced ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reduced ? 0 : 0.12,
        delayChildren: reduced ? 0 : 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduced ? 0 : 0.45,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const socialsContainerVariants = {
    hidden: { opacity: reduced ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reduced ? 0 : 0.06,
      },
    },
  };

  const socialItemVariants = {
    hidden: reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: reduced ? 0 : 0.28,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.section
      className="hero"
      id="home"
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduced ? 0 : 0.35 }}
    >
      <div className="hero__grid" />
      <div className="hero__layout">
        {/* Left side interactive portfolio terminal (starts boot sequence alongside signature) */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduced ? 0 : 0.45,
            delay: reduced ? 0 : 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ width: '100%' }}
        >
          <HeroTerminal onNavigate={onNavigate} isLoaded={isLoaded} startDelay={0.5} />
        </motion.div>

        <div className="hero__content-col">
          {/* Topmost heading line: "Hi, I'm" + animated signature "Nithish B" */}
          <div className="hero__sig-top">
            <h1 className="hero__name-sr">Hi, I&apos;m Nithish B</h1>
            <div className="hero__greeting-line">
              <motion.span
                className="hero__greeting-text"
                initial={reduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduced ? 0 : 0.35,
                  delay: reduced ? 0 : 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                Hi, I&apos;m
              </motion.span>
              <div className="hero__signature-wrap">
                <HeroSignature
                  onComplete={() => setSignatureComplete(true)}
                  isLoaded={isLoaded}
                />
              </div>
            </div>
          </div>

          {/* Staggered content following signature completion */}
          <motion.div
            className="hero__body"
            variants={contentVariants}
            initial={reduced ? 'visible' : 'hidden'}
            animate={reduced || signatureComplete ? 'visible' : 'hidden'}
          >
            <motion.div variants={itemVariants} className="hero__roles">
              <h2 className="hero__roles-main">FULL STACK DEVELOPER</h2>
              <div className="hero__roles-sub">
                <span className="hero__roles-dot" aria-hidden="true" />
                <span>AI/ML ENGINEER</span>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <AnimatedParagraph className="hero__desc" delay={0.05}>
                Engineering high-performance web systems, RAG architectures, and security-minded backends — built with intent and shipped to production.
              </AnimatedParagraph>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="hero__socials"
            >
              <motion.div
                variants={socialsContainerVariants}
                style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}
              >
                {heroSocials.map(({ label, tooltip, href, icon: Icon }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="hero__social-btn"
                    aria-label={label}
                    data-cursor
                    variants={socialItemVariants}
                  >
                    <Icon size={18} />
                    <span className="hero__social-tooltip">{tooltip || label}</span>
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} className="hero__ctas">
              <a
                href="#projects"
                className="hero__btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  handleScroll('projects');
                }}
                data-cursor
              >
                <span>VIEW PROJECTS</span>
                <MoveRight size={15} />
              </a>
              <a
                href="#resume"
                className="hero__btn-secondary"
                onClick={(e) => {
                  e.preventDefault();
                  handleScroll('resume');
                }}
                data-cursor
              >
                <span>RESUME</span>
                <ArrowUpRight size={15} />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <button className="scroll-cue" onClick={() => onNavigate('about')}>
        <ChevronDown size={16} /> VIEW ABOUT
      </button>
    </motion.section>
  );
}

function AboutPortrait() {
  const portraitRef = useRef(null);
  const reduced = useReducedMotion();
  const [revealing, setRevealing] = useState(false);

  useEffect(() => {
    if (reduced) {
      setRevealing(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setRevealing(true); observer.disconnect(); }
    }, { threshold: 0.15 });
    if (portraitRef.current) observer.observe(portraitRef.current);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <div className="about__portrait-wrap">
      <figure ref={portraitRef} className={`about__portrait ${revealing ? 'about__portrait--revealing' : ''}`}>
        <span className="about__portrait-glow" aria-hidden="true" />
        <div className="about__portrait-img-box">
          <img
            src="/nithish-portrait.png"
            alt="Nithish B"
            className="about__portrait-img"
            loading="lazy"
          />
        </div>
      </figure>
    </div>
  );
}

function About() {
  const sectionRef = useRef(null);
  const reduced = useReducedMotion();
  const [educationVisible, setEducationVisible] = useState(false);
  const education = [
    { institution: 'RV College of Engineering, Bengaluru', program: 'BE Computer Science & Engineering (Cyber Security)', details: 'CGPA: 8.73 · Sep 2023 – Jul 2027', mapUrl: 'https://maps.app.goo.gl/bHvs8D4qLv72Nd7t9', icon: BookOpen },
    { institution: 'Vivekanada PU College', program: 'Pre-University, PCMB', details: '95.66% · 2021 – 2023', mapUrl: 'https://maps.app.goo.gl/pZxjsjz6M8qvKPh66', icon: BadgeCheck },
    { institution: 'Government High School', program: 'Grade', details: '97.76% · 2011 – 2021', mapUrl: 'https://maps.app.goo.gl/kJXQDag32wJUp7YM7', icon: School },
  ];

  useEffect(() => {
    if (reduced) { setEducationVisible(false); return undefined; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setEducationVisible(true); observer.disconnect(); }
    }, { threshold: 0.18 });
    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [reduced]);

  return <section className={`about section-shell ${educationVisible ? 'about--education-visible' : ''}`} id="about" ref={sectionRef}>
    <div className="section-tag"><ScrambleText text="/ 001 — CONTEXT" /></div>
    <div className="about__layout">
      <div className="about__left">
        <SplitHeading lines={['ABOUT', <span className="outline">ME.</span>]} />
        <div className="about__copy">
          <AnimatedParagraph delay={0.12}>
            I'm Nithish B, a Computer Science and Engineering student specializing in Cyber Security at R.V. College of Engineering, Bengaluru. I'm interested in the intersection of cybersecurity, AI/ML, software engineering, and system design, and I enjoy understanding how systems work beyond just the code that makes them run.
          </AnimatedParagraph>
          <AnimatedParagraph delay={0.65}>
            For me, learning technology is less about collecting tools and more about understanding why they work, where they break, and how different pieces come together to solve a problem. I enjoy going beyond the "it works" stage—questioning design decisions, exploring edge cases, and thinking about how a system behaves when things don't go as expected.
          </AnimatedParagraph>
          <AnimatedParagraph delay={1.18}>
            I'm someone who enjoys taking a problem apart, understanding why it exists, and figuring out how to build a practical solution for it. I'm currently focused on strengthening my fundamentals in cybersecurity and software engineering, while continuing to explore how AI can be used to build smarter and more secure systems.
          </AnimatedParagraph>
        </div>
      </div>
      <div className="about__right">
        <AboutPortrait />
      </div>
    </div>
    <div className="about__education">
      <div className="about__education-label">
        <i aria-hidden="true" />
        <ScrambleText text="// Education & Locations" />
      </div>
      <div className="about__education-grid">
        <div className="education-list">
          {education.map(({ institution, program, details, mapUrl, icon: Icon }, index) => (
            <motion.article
              className="education-entry"
              key={institution}
              initial={{ opacity: 0, y: 24, x: -10 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <Icon className="education-entry__icon" size={24} strokeWidth={1.8} aria-hidden="true" />
              <div className="education-entry__content">
                <strong><InteractiveChars text={program} /></strong>
                <a
                  className="education-entry__institution"
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open location in Google Maps"
                >
                  <MapPin size={15} strokeWidth={2} aria-hidden="true" className="education-entry__pin-icon" />
                  <span>{institution}</span>
                  <span className="education-entry__map-badge">
                    <span>Maps</span>
                    <ArrowUpRight size={13} strokeWidth={2.4} aria-hidden="true" />
                  </span>
                </a>
                <small><InteractiveChars text={details} /></small>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          className="about__education-map-card"
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="about__map-visual-wrap">
            <img
              src="/education-map.png"
              alt="Campus Geographic Map"
              className="about__map-img"
              loading="lazy"
            />
            <div className="about__map-glow" />
          </div>
          <div className="about__map-info">
            <span className="about__map-tag"><MapPin size={13} /> VERIFIED CAMPUSES</span>
            <p className="about__map-desc">Explore exact campus locations on Google Maps via the link badges.</p>
          </div>
        </motion.div>
      </div>
    </div>
  </section>;
}

function Skills() {
  const sectionRef = useRef(null);
  const reduced = useReducedMotion();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (reduced) { setEntered(false); return undefined; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setEntered(true); observer.disconnect(); }
    }, { threshold: 0.15 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <section className={`skills section-shell ${entered ? 'skills--entered' : ''}`} id="skills" ref={sectionRef}>
      <div className="section-tag"><ScrambleText text="/ 002 — SKILL INDEX" /></div>
      <div className="skills__headline">
        <SplitHeading lines={['TOOLS IN', <span className="accent">MOTION.</span>]} />
      </div>
      <div className="skills__categories" aria-label="Skills">
        {skillsData.map(({ category, skills }, index) => (
          <motion.div
            className="skills__category-row"
            key={category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: index * 0.08, duration: 0.45 }}
          >
            <div className="skills__comment">
              <span className="skills__category-dot" />
              <ScrambleText text={`/* ${category} */`} />
            </div>
            <div className="skills__chip-group">
              {skills.map((skill, skillIdx) => (
                <span
                  className="skills__chip"
                  key={skill}
                  style={{
                    '--chip-delay': `${((skillIdx * 0.38) + (index * 0.25)) % 2.8}s`,
                    '--chip-duration': `${3.2 + ((skillIdx % 4) * 0.5)}s`,
                  }}
                >
                  <InteractiveChars text={skill} />
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project, onOpen }) {
  const ref = useRef(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sx = useSpring(rx, { stiffness: 220, damping: 22 });
  const sy = useSpring(ry, { stiffness: 220, damping: 22 });

  const move = (event) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    ry.set((event.clientX - rect.left - rect.width / 2) / 18);
    rx.set(-(event.clientY - rect.top - rect.height / 2) / 18);
  };

  return (
    <motion.article
      ref={ref}
      className="project-card"
      style={{ rotateX: sx, rotateY: sy, '--card-accent': project.accent }}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={move}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      onClick={() => onOpen(project)}
      data-cursor
    >
      <div className="project-card__noise" />
      <div className="project-card__top">
        <span className="project-card__num"><ScrambleText text={project.number} /></span>
        <span className="project-card__badge"><ScrambleText text="FEATURED BUILD" /></span>
      </div>
      <h3><InteractiveChars text={project.title} /></h3>
      <div className="project-card__tagline">
        <span className="text-shimmer-green">{project.tagline || '\u00a0'}</span>
      </div>
      <p>{project.description}</p>
      <div className="project-card__stack">
        {project.stack.map((technology) => (
          <span key={technology} className="project-card__stack-pill">
            {technology}
          </span>
        ))}
      </div>
      <div className="project-card__bottom">
        <span>VIEW CASE STUDY</span>
        <ArrowUpRight size={15} />
      </div>
    </motion.article>
  );
}

function ProjectsHeader({ onPrev, onNext }) {
  const headerRef = useRef(null);
  const reduced = useReducedMotion();
  const tag = '/ 3D — DESIGNED. DEBUGGED. DEPLOYED.';
  const [typedTag, setTypedTag] = useState('');
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (reduced) {
      setTypedTag(tag);
      setInView(true);
      return undefined;
    }

    let timerId;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          setTypedTag('');
          let charIndex = 0;
          clearInterval(timerId);
          timerId = setInterval(() => {
            charIndex += 1;
            setTypedTag(tag.slice(0, charIndex));
            if (charIndex >= tag.length) {
              clearInterval(timerId);
            }
          }, 22);
        } else {
          setInView(false);
          setTypedTag('');
        }
      },
      { threshold: 0.2 }
    );

    if (headerRef.current) observer.observe(headerRef.current);
    return () => {
      observer.disconnect();
      clearInterval(timerId);
    };
  }, [reduced]);

  const lineVariants = {
    hidden: { opacity: 0, y: '115%' },
    visible: (customDelay) => ({
      opacity: 1,
      y: '0%',
      transition: {
        duration: 0.6,
        delay: customDelay,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const dotVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (customDelay) => ({
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.32,
        delay: customDelay + 0.25,
        ease: [0.175, 0.885, 0.32, 1.275],
      },
    }),
  };

  return (
    <div className="projects__header" ref={headerRef}>
      <div className="projects__eyebrow">
        <span className="projects__pulse" />
        <span>{inView ? typedTag : ''}</span>
        {!reduced && inView && typedTag.length < tag.length && <i className="projects__cursor" />}
      </div>
      <div className="projects__intro">
        <h2 className="projects__heading" aria-label="Designed. Debugged. Deployed.">
          <div className="projects__line-mask">
            <motion.span
              className="projects__line projects__line--designed"
              custom={0.1}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              variants={lineVariants}
            >
              DESIGNED
              <motion.span
                className="projects__status-dot projects__status-dot--green"
                custom={0.1}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                variants={dotVariants}
                aria-hidden="true"
              />
            </motion.span>
          </div>

          <div className="projects__line-mask">
            <motion.span
              className="projects__line projects__line--debugged"
              custom={0.5}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              variants={lineVariants}
            >
              DEBUGGED
              <motion.span
                className="projects__status-dot projects__status-dot--amber"
                custom={0.5}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                variants={dotVariants}
                aria-hidden="true"
              />
            </motion.span>
          </div>

          <div className="projects__line-mask">
            <motion.span
              className="projects__line projects__line--deployed"
              custom={0.9}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              variants={lineVariants}
            >
              DEPLOYED
              <motion.span
                className="projects__status-dot projects__status-dot--cyan"
                custom={0.9}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                variants={dotVariants}
                aria-hidden="true"
              />
            </motion.span>
          </div>
        </h2>
        <div className="projects__intro-row">
          <AnimatedParagraph className="projects__intro-copy" delay={1.15}>
            Six full-stack and AI/ML systems, each one taken from concept to a working product. Drag sideways or use arrows to explore each.
          </AnimatedParagraph>
          <div className="projects__nav-arrows">
            <button className="projects__nav-btn" onClick={onPrev} aria-label="Previous project" type="button" data-cursor>
              <ChevronLeft size={18} />
            </button>
            <button className="projects__nav-btn" onClick={onNext} aria-label="Next project" type="button" data-cursor>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Projects({ onOpen }) {
  const sectionRef = useRef(null);
  const railRef = useRef(null);
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  // Desktop mouse drag handling for horizontal card browsing
  const handleMouseDown = (e) => {
    if (e.button !== 0 || !railRef.current) return;
    isMouseDownRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - railRef.current.offsetLeft;
    scrollLeftStartRef.current = railRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isMouseDownRef.current || !railRef.current) return;
    const x = e.pageX - railRef.current.offsetLeft;
    const walk = x - startXRef.current;
    if (Math.abs(walk) > 4) {
      if (!hasDraggedRef.current) {
        hasDraggedRef.current = true;
        setIsDragging(true);
      }
      railRef.current.scrollLeft = scrollLeftStartRef.current - walk;
    }
  };

  const handleMouseUpOrLeave = () => {
    if (isMouseDownRef.current) {
      isMouseDownRef.current = false;
      setTimeout(() => {
        setIsDragging(false);
        hasDraggedRef.current = false;
      }, 50);
    }
  };

  const handleCardClick = (project) => {
    if (hasDraggedRef.current || isDragging) return;
    onOpen(project);
  };

  const scrollRail = (direction) => {
    if (!railRef.current) return;
    const card = railRef.current.querySelector('.project-card');
    const scrollAmount = card ? card.offsetWidth + 24 : 420;
    railRef.current.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
  };

  return (
    <section className="projects section-shell" id="projects" ref={sectionRef}>
      <ProjectsHeader onPrev={() => scrollRail(-1)} onNext={() => scrollRail(1)} />
      <div
        className={`project-rail ${isDragging ? 'project-rail--dragging' : ''}`}
        ref={railRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        {projects.map((project) => (
          <ProjectCard key={project.number} project={project} onOpen={handleCardClick} />
        ))}
      </div>
      <div className="projects__github">
        <a
          href="https://github.com/Nithishb03"
          target="_blank"
          rel="noopener noreferrer"
          className="projects__github-link"
          data-cursor
        >
          <SiGithub size={18} />
          <span>EXPLORE ALL REPOSITORIES ON GITHUB</span>
          <ArrowUpRight size={15} />
        </a>
      </div>
    </section>
  );
}


function Contact() {
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const details = [
    { label: 'EMAIL', value: 'nithish7483@gmail.com', href: 'mailto:nithish7483@gmail.com', icon: Mail },
    { label: 'LINKEDIN', value: 'linkedin.com/in/nithishb03', href: 'https://www.linkedin.com/in/nithishb03/', icon: FaLinkedinIn },
    { label: 'GITHUB', value: 'github.com/Nithishb03', href: 'https://github.com/Nithishb03', icon: SiGithub },
    { label: 'LEETCODE', value: 'leetcode.com/u/_nithishb', href: 'https://leetcode.com/u/_nithishb/', icon: SiLeetcode },
    { label: 'PHONE', value: '+91 7483459123', href: 'tel:+917483459123', icon: Phone },
  ];
  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      setStatus('error');
      setErrorMessage('Please fill in all fields before sending.');
      return;
    }

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_v69gvkp';
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_votx85d';
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    setStatus('sending');
    setErrorMessage('');

    try {
      const templateParams = {
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      };

      await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey ? { publicKey } : undefined
      );

      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('EmailJS submission error:', error);
      setStatus('error');
      setErrorMessage(error?.text || error?.message || 'Failed to send message. Please try again.');
    }
  };
  return <section className="contact section-shell" id="contact">
    <div className="contact__panels">
      <div className="contact__form-panel">
        <div className="section-tag"><ScrambleText text="/ GET IN TOUCH" /></div>
        <SplitHeading lines={['MAKE THE NEXT', <span className="accent">SIGNAL.</span>]} />
        <AnimatedParagraph delay={0.08}>
          Have a question, collaboration idea, or project in mind? Drop a message below and I'll receive it directly in my inbox.
        </AnimatedParagraph>
        <form className="contact-form" onSubmit={submit} noValidate>
          <label><span>NAME</span><input name="name" value={form.name} onChange={updateField} autoComplete="name" placeholder="Your name" required /></label>
          <label><span>YOUR EMAIL</span><input type="email" name="email" value={form.email} onChange={updateField} autoComplete="email" placeholder="you@company.com" required /></label>
          <label><span>SUBJECT</span><input name="subject" value={form.subject} onChange={updateField} placeholder="What are we solving?" required /></label>
          <label className="contact-form__message"><span>YOUR MESSAGE</span><textarea name="message" value={form.message} onChange={updateField} placeholder="Type your message here..." rows="5" required /></label>
          <button className="contact-submit magnetic" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'SENDING…' : status === 'success' ? 'MESSAGE SENT ✓' : 'SEND MESSAGE'} <ArrowUpRight size={17} /></button>
          {status === 'error' && <p className="form-status form-status--error" role="alert">{errorMessage || 'Please fill in all fields before sending.'}</p>}
          {status === 'success' && <p className="form-status form-status--success" role="status">Thanks — your message has been sent successfully!</p>}
        </form>
      </div>
      <motion.div className="contact__details-panel" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.65, staggerChildren: 0.1 }}>
        <div className="section-tag"><ScrambleText text="/ DIRECT CHANNELS" /></div>
        <div className="contact-links">{details.map(({ label, value, href, icon: Icon }, index) => <motion.a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined} className="contact-link" data-cursor initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.08, duration: 0.45 }}><span className="contact-link__icon"><Icon size={19} /></span><span><small>{label}</small><strong><InteractiveChars text={value} /></strong></span><ArrowUpRight size={16} className="contact-link__arrow" /></motion.a>)}</div>
      </motion.div>
    </div>
    <footer><span><ScrambleText text="© NITHISH / BUILT WITH INTENT" /></span><div><a href="mailto:nithish7483@gmail.com"><Mail size={16} /> EMAIL</a><a href="https://github.com/Nithishb03" target="_blank" rel="noreferrer"><SiGithub size={16} /> GITHUB</a><a href="https://www.linkedin.com/in/nithishb03/" target="_blank" rel="noreferrer"><FaLinkedinIn size={16} /> LINKEDIN</a></div></footer>
  </section>;
}

function CaseStudy({ project, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      className="case-study"
      initial={{ clipPath: 'inset(100% 0 0 0)' }}
      animate={{ clipPath: 'inset(0% 0 0 0)' }}
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="case-study__top-bar">
        <button className="case-study__back-btn" onClick={onClose} data-cursor aria-label="Back to projects list">
          <ChevronLeft size={18} />
          <span>BACK TO PROJECTS</span>
        </button>
        <button className="case-study__close-btn" onClick={onClose} data-cursor aria-label="Close project view">
          <span>CLOSE [ESC]</span>
          <X size={16} />
        </button>
      </div>

      <div className="case-study__inner">
        <div className="case-study__header">
          <span className="section-tag" style={{ color: project.accent }}>
            <ScrambleText text={`/ CASE ${project.number}`} />
          </span>
          <a
            className="case-study__github"
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{ '--project-accent': project.accent }}
            data-cursor
          >
            <SiGithub size={22} />
            <span>GITHUB</span>
            <ArrowUpRight size={17} />
          </a>
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <InteractiveChars text={project.title} />
        </motion.h2>
        <div className="case-study__grid">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3 }}
          >
            <span className="muted"><ScrambleText text="THE PROBLEM" /></span>
            <p>{project.problem || project.description}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.4 }}
          >
            <span className="muted"><ScrambleText text="THE SOLUTION" /></span>
            <p>{project.solution || project.tagline || 'A focused build exploring practical software systems.'}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.5 }}
          >
            <span className="muted"><ScrambleText text="TECH STACK" /></span>
            <div className="case-study__grid-stack">
              {project.stack.map((item) => (
                <span className="case-study__grid-pill" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="case-study__footer">
          <button className="case-study__footer-back-btn" onClick={onClose} data-cursor>
            <ChevronLeft size={18} />
            <span>BACK TO PROJECTS LIST</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function NavQuantumBeam({ isNavigating }) {
  if (!isNavigating) return null;
  return (
    <div className="nav-quantum-beam" aria-hidden="true">
      <motion.div
        className="nav-quantum-beam__line"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: [0, 0.7, 1] }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

function App() {
  const [loaded, setLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [openProject, setOpenProject] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    document.body.style.overflow = openProject ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [openProject]);

  // Handle browser back button / mobile swipe gesture so it returns to projects section
  useEffect(() => {
    const handlePopState = () => {
      if (openProject) {
        setOpenProject(null);
        setActiveSection('projects');
        setTimeout(() => {
          const el = document.getElementById('projects');
          if (el) el.scrollIntoView({ behavior: 'auto' });
        }, 20);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [openProject]);

  const handleOpenProject = (project) => {
    setOpenProject(project);
    window.history.pushState({ modal: 'case-study', project: project.number }, '');
  };

  const handleCloseProject = () => {
    setOpenProject(null);
    setActiveSection('projects');
    setTimeout(() => {
      const el = document.getElementById('projects');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 40);
  };

  // Track active section as user scrolls naturally through the page
  useEffect(() => {
    const sectionIds = ['home', 'about', 'skills', 'projects', 'contact', 'resume'];
    const observers = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isNavigating) {
            setActiveSection(id);
          }
        },
        { threshold: 0.25 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [loaded, isNavigating]);

  const navigate = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (!el) return;

    setIsNavigating(true);
    el.scrollIntoView({ behavior: 'smooth' });

    el.classList.add('section--nav-focused');
    window.setTimeout(() => {
      el.classList.remove('section--nav-focused');
      setIsNavigating(false);
    }, 750);
  };

  return (
    <>
      <AnimatePresence>
        {!loaded && <Preloader onDone={() => setLoaded(true)} />}
      </AnimatePresence>
      <NavQuantumBeam isNavigating={isNavigating} />
      <CustomCursor />
      <Nav active={activeSection} onNavigate={navigate} />
      <main>
        <Hero onNavigate={navigate} isLoaded={loaded} />
        <About />
        <Skills />
        <Projects onOpen={handleOpenProject} />
        <Contact />
        <Resume />
      </main>
      <AnimatePresence>
        {openProject && <CaseStudy project={openProject} onClose={handleCloseProject} />}
      </AnimatePresence>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);

