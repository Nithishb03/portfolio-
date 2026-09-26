import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import emailjs from '@emailjs/browser';
import { ArrowUpRight, BadgeCheck, BookOpen, ChevronDown, Mail, MapPin, MoveRight, Phone, School, X } from 'lucide-react';
import { SiGithub, SiLeetcode } from 'react-icons/si';
import { FaLinkedinIn } from 'react-icons/fa6';
import './styles.css';

const navItems = [
  ['home', 'HOME'],
  ['about', 'ABOUT'],
  ['skills', 'SKILLS'],
  ['projects', 'PROJECTS'],
  ['contact', 'CONTACT'],
  ['resume', 'RESUME'],
];

const projects = [
  {
    number: '01',
    title: 'Shiksha Sahayak',
    tagline: '// RAG-powered educational AI assistant',
    accent: '#a8ff78',
    description: 'AI learning assistant using RAG to retrieve relevant PDF knowledge and generate context-aware responses with multimodal and conversational capabilities.',
    problem: 'Students often struggle to find relevant information quickly across large PDFs and study materials. Generic AI responses may also provide answers without being grounded in their actual learning content.',
    solution: 'Built a RAG-based educational assistant that retrieves relevant information from uploaded PDFs before generating answers. Added conversational memory and multimodal capabilities to provide more interactive and context-aware learning support.',
    stack: ['Python', 'Flask', 'LangChain', 'Groq'],
    github: 'https://github.com/Nithishb03/shiksha-sahayaka-RAG-',
  },
  {
    number: '02',
    title: 'CarbonChain',
    tagline: '// AI-powered blockchain carbon verification',
    accent: '#ffd166',
    description: 'Blockchain-based carbon credit verification platform with AI-powered fraud detection, secure telemetry, and transparent on-chain settlement.',
    problem: 'Carbon credit verification can suffer from inaccurate sensor data, fraud, and lack of transparency in verification records. Traditional centralized systems make it difficult to independently verify emission data and prevent duplicate or fraudulent claims.',
    solution: 'Built a blockchain-based verification system combining IoT telemetry, AI-based anomaly detection, and smart contracts. Validated telemetry before recording verification results on-chain and enabling transparent carbon-credit settlement.',
    stack: ['React', 'Solidity', 'Ethereum', 'ONNX'],
    github: 'https://github.com/Nithishb03/carbon-credit-',
  },
  {
    number: '03',
    title: 'Sentinel — Continuous Authentication',
    tagline: '// Continuous behavioral authentication & anomaly detection',
    accent: '#78e8ff',
    description: 'Continuous authentication system using behavioral anomaly detection to monitor user trust and secure active sessions.',
    problem: 'Traditional authentication verifies users mainly at login and may not detect account misuse after authentication. Behavioral changes and abnormal activity can allow unauthorized users to continue accessing an active session.',
    solution: 'Built a continuous authentication system that analyzes behavioral telemetry using Isolation Forest anomaly detection. Combined trust scoring, EMA smoothing, heartbeat monitoring, and fail-closed access control for continuous session protection.',
    stack: ['Python', 'Flask', 'Isolation Forest', 'Argon2id'],
    github: 'https://github.com/Nithishb03/IEH-AC',
  },
  {
    number: '04',
    title: 'Piezoelectric Energy Harvesting',
    tagline: '// DFT-guided ML for piezoelectric energy harvesting',
    accent: '#d6a8ff',
    description: 'DFT-guided energy harvesting system combining material simulation and ML-based piezoelectric voltage prediction.',
    problem: 'Piezoelectric energy output varies with material properties and environmental conditions such as pressure, temperature, and humidity. Accurately understanding and predicting voltage generation requires both material-level analysis and data-driven modeling.',
    solution: 'Developed a DFT-guided pipeline using Gaussian simulations and material-property analysis to generate meaningful features. Trained a Gradient Boosting model to predict piezoelectric voltage and integrated real-time inference for monitoring.',
    stack: ['Gaussian', 'MATLAB', 'Gradient Boosting', 'FastAPI'],
    github: 'https://github.com/Nithishb03/ZnO-piezoelectric-energy-harvesting',
  },
  {
    number: '05',
    title: 'Beam Crack Detection System',
    accent: '#ff8f70',
    description: 'ML-powered structural health monitoring dashboard that analyzes beam sensor and frequency data to estimate crack location, depth, and severity.',
    problem: 'Manual inspection of structural beams can be time-consuming and may miss small or early-stage cracks. A reliable automated approach is needed to identify visible cracks from structural images efficiently.',
    solution: 'Developed a computer-vision system that processes beam images to identify and analyze visible crack regions. Used image-processing techniques to automate crack detection and provide faster structural inspection support.',
    stack: ['React', 'Flask', 'scikit-learn', 'MATLAB'],
    github: 'https://github.com/Nithishb03/Beam_Crack_Detection_System',
  },
  {
    number: '06',
    title: 'Emergency Blood Donor Finder',
    accent: '#ff6b8a',
    description: 'Flask-based platform connecting blood receivers, donors, and NGOs through blood group/location search, secure authentication, availability tracking, and donation management.',
    problem: 'Emergency blood requests can be delayed when compatible donors are difficult to find quickly. Manual coordination also makes donor availability and contact information difficult to manage.',
    solution: 'A Flask and PostgreSQL platform connects receivers with available donors using blood-group and location-based searches. Donor and NGO portals provide secure authentication, live availability updates, donor directories, and donation-history views.',
    stack: ['Flask', 'Python', 'PostgreSQL', 'SQLAlchemy'],
    github: 'https://github.com/Nithishb03/emergency-blood-donar-finder',
  },
];

const skillsData = [
  { category: 'Programming', skills: ['Python', 'C', 'C++', 'JavaScript', 'SQL'] },
  { category: 'Web & Backend', skills: ['HTML', 'CSS', 'JavaScript', 'React.js', 'Flask', 'FastAPI', 'REST APIs'] },
  { category: 'Database & Data', skills: ['MySQL', 'SQLite', 'Redis', 'Git/GitHub'] },
  { category: 'AI & Machine Learning', skills: ['Python', 'Machine Learning', 'RAG', 'NLP', 'Computer Vision', 'Anomaly Detection', 'Scikit-learn', 'LangChain'] },
];

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
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 30 });
  const springY = useSpring(y, { stiffness: 500, damping: 30 });
  useEffect(() => {
    const move = (event) => { x.set(event.clientX); y.set(event.clientY); };
    const onOver = (event) => setActive(Boolean(event.target.closest('a, button, [data-cursor]')));
    window.addEventListener('pointermove', move);
    window.addEventListener('mouseover', onOver);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('mouseover', onOver); };
  }, [x, y]);
  return <motion.div className={`cursor ${active ? 'cursor--active' : ''}`} style={{ left: springX, top: springY }} aria-hidden="true" />;
}

function Preloader({ onDone }) {
  const reduced = useReducedMotion();
  useEffect(() => {
    const timer = window.setTimeout(onDone, reduced ? 250 : 1750);
    return () => window.clearTimeout(timer);
  }, [onDone, reduced]);
  return (
    <motion.div className="preloader" initial={{ opacity: 1 }} exit={{ y: '-100%' }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}>
      <div className="preloader__meta"><span>RVCE / CSE / 2026</span><span>BOOTING PORTFOLIO</span></div>
      <motion.div className="preloader__name" initial={{ letterSpacing: '0.8em', opacity: 0 }} animate={{ letterSpacing: '0.04em', opacity: 1 }} transition={{ duration: reduced ? 0.2 : 1.2 }}>
        NITHISH<span className="accent">.</span>
      </motion.div>
      <div className="preloader__bar"><motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: reduced ? 0.2 : 1.4, ease: 'easeInOut' }} /></div>
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
    <button className="nav-logo" onClick={() => navigate('home')} aria-label="Go to home">N<span>.</span></button>
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
  const resumeHref = '/Nithish-Resume.txt';
  const command = '$ curl -O nithish_resume.pdf';

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
    link.download = 'Nithish-Resume.txt';
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
  const secondaryText = state === 'progress' ? `[${progressBar}] ${progress}%` : state === 'done' ? (reduced ? '✓ done' : '✓ resume.pdf saved') : '';

  return <button className={`resume-download resume-download--${state}`} type="button" onClick={handleDownload} disabled={state !== 'idle'} aria-label="Download resume" aria-live="polite">
    <span className="resume-download__line">{primaryText}{state === 'idle' && <i className="resume-download__cursor" aria-hidden="true" />}</span>
    <span className="resume-download__line resume-download__result" aria-hidden={!secondaryText}>{secondaryText || '\u00a0'}</span>
  </button>;
}

function Resume() {
  return <section className="resume section-shell" id="resume"><div className="section-tag">/ 005 — HANDOFF</div><div className="resume__layout"><h2>TAKE THE<br /><span className="outline">SOURCE.</span></h2><div><p>One page, no maze. Download the current resume for the fast version of what I build and where I am headed.</p><ResumeDownload /></div></div></section>;
}

function Hero({ onNavigate }) {
  const reduced = useReducedMotion();
  const [identifier, setIdentifier] = useState(0);
  const identifiers = ['AI / ML ENGINEER', 'SECURITY-MINDED BUILDER', 'BACKEND SYSTEMS THINKER'];
  useEffect(() => {
    if (reduced) return undefined;
    const timer = window.setInterval(() => setIdentifier((current) => (current + 1) % identifiers.length), 2500);
    return () => window.clearInterval(timer);
  }, [reduced]);
  return <section className="hero" id="home">
    <div className="hero__grid" />
    <div className="hero__orb hero__orb--one" /><div className="hero__orb hero__orb--two" />
    <div className="eyebrow">AVAILABLE FOR PRODUCT TEAMS / 2026</div>
    <div className="hero__content">
      <div className="hero__sidecopy">ENGINEER / BUILDER<br />BENGALURU, INDIA<br /><span className="accent">12.9716° N</span></div>
      <h1 className="hero__name" aria-label="Nithish B">{'Nithish B'.split('').map((character, index) => <motion.span key={`${character}-${index}`} aria-hidden="true" initial={reduced ? false : { y: 90, opacity: 0, rotate: index % 2 ? 8 : -8 }} animate={{ y: 0, opacity: 1, rotate: 0 }} transition={{ delay: reduced ? 0 : 0.06 * index, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>{character === ' ' ? '\u00a0' : character}</motion.span>)}</h1>
      <div className="hero__role-mask"><motion.div key="role" initial={reduced ? false : { y: '110%' }} animate={{ y: 0 }} transition={{ delay: reduced ? 0 : 0.68, duration: 0.7, ease: [0.76, 0, 0.24, 1] }}>FULL STACK DEVELOPER</motion.div></div>
      <div className="hero__identifier" aria-live="polite"><AnimatePresence mode="wait"><motion.span key={identifiers[identifier]} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: reduced ? 0.15 : 0.35 }}>{identifiers[identifier]}</motion.span></AnimatePresence></div>
      <p className="hero__pitch">I turn hard problems in <em>AI, infrastructure, and security</em> into systems people can actually use.</p>
      <div className="hero__actions"><MagneticButton href="#projects" onNavigate={onNavigate}>VIEW PROJECTS <ArrowUpRight size={17} /></MagneticButton><MagneticButton href="#resume" className="magnetic--quiet" onNavigate={onNavigate}>RESUME <MoveRight size={17} /></MagneticButton></div>
    </div>
    <button className="scroll-cue" onClick={() => onNavigate('about')}><ChevronDown size={16} /> VIEW ABOUT</button>
  </section>;
}

function AboutPortrait() {
  const portraitRef = useRef(null);
  const reduced = useReducedMotion();
  const [revealing, setRevealing] = useState(false);
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const springX = useSpring(tiltX, { stiffness: 180, damping: 20 });
  const springY = useSpring(tiltY, { stiffness: 180, damping: 20 });

  useEffect(() => {
    if (reduced) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setRevealing(true); observer.disconnect(); }
    }, { threshold: 0.2 });
    if (portraitRef.current) observer.observe(portraitRef.current);
    return () => observer.disconnect();
  }, [reduced]);

  const tilt = (event) => {
    if (event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    tiltY.set(((event.clientX - rect.left) / rect.width - .5) * 5);
    tiltX.set(-((event.clientY - rect.top) / rect.height - .5) * 5);
  };

  return <div className="about__portrait-wrap">
    <motion.figure ref={portraitRef} className={`about__portrait ${revealing ? 'about__portrait--revealing' : ''}`} style={{ rotateX: springX, rotateY: springY }} onPointerMove={tilt} onPointerLeave={() => { tiltX.set(0); tiltY.set(0); }}>
      <span className="about__portrait-glow" aria-hidden="true" />
      <img src="/nithish-portrait.png" alt="Nithish B" />
    </motion.figure>
  </div>;
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
    <div className="section-tag">/ 001 — CONTEXT</div>
    <div className="about__layout"><div className="about__title-column"><h2>ABOUT<br /><span className="outline">ME.</span></h2><AboutPortrait /></div><div className="about__copy">
      <p>I'm Nithish B, a Computer Science and Engineering student specializing in Cyber Security at R.V. College of Engineering, Bengaluru. I'm interested in the intersection of cybersecurity, AI/ML, software engineering, and system design, and I enjoy understanding how systems work beyond just the code that makes them run.</p>
      <p>For me, learning technology is less about collecting tools and more about understanding why they work, where they break, and how different pieces come together to solve a problem. I enjoy going beyond the "it works" stage—questioning design decisions, exploring edge cases, and thinking about how a system behaves when things don't go as expected.</p>
      <p>I'm someone who enjoys taking a problem apart, understanding why it exists, and figuring out how to build a practical solution for it. I'm currently focused on strengthening my fundamentals in cybersecurity and software engineering, while continuing to explore how AI can be used to build smarter and more secure systems.</p>
    </div></div>
    <div className="about__education"><div className="about__education-label"><i aria-hidden="true" />// Education</div><div className="education-list">
      {education.map(({ institution, program, details, mapUrl, icon: Icon }, index) => <article className="education-entry" style={{ '--entry-delay': `${index * 120}ms` }} key={institution}>
        <Icon className="education-entry__icon" size={24} strokeWidth={1.8} aria-hidden="true" /><div className="education-entry__content"><strong>{program}</strong><a className="education-entry__institution" href={mapUrl} target="_blank" rel="noopener noreferrer">{institution}<MapPin size={14} strokeWidth={1.7} aria-hidden="true" /></a><small>{details}</small></div>
      </article>)}
    </div></div>
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
    }, { threshold: 0.2 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [reduced]);

  return <section className={`skills section-shell ${entered ? 'skills--entered' : ''}`} id="skills" ref={sectionRef}>
    <div className="section-tag">/ 002 — SKILL INDEX</div>
    <div className="skills__headline"><h2>TOOLS IN<br /><span className="accent">MOTION.</span></h2><p>A running index of the technologies behind the systems I build.</p></div>
    <div className="skills__marquees" aria-label="Skills">
      {skillsData.map(({ category, skills }, index) => <div className={`skills__marquee-row skills__marquee-row--${index % 2 ? 'right' : 'left'}`} style={{ '--marquee-duration': `${26 + index * 3}s`, '--entry-offset': index % 2 ? '42px' : '-42px' }} key={category}>
        <div className="skills__comment">{`/* ${category} */`}</div>
        <div className="skills__viewport">
          <div className="skills__track">
            {[0, 1].map((copy) => <div className="skills__chip-group" aria-hidden={copy === 1} key={copy}>{skills.map((skill) => <span className="skills__chip" key={`${copy}-${skill}`}>{skill}</span>)}</div>)}
          </div>
        </div>
      </div>)}
    </div>
  </section>;
}

function ProjectCard({ project, onOpen }) {
  const ref = useRef(null); const rx = useMotionValue(0); const ry = useMotionValue(0); const sx = useSpring(rx, { stiffness: 220, damping: 22 }); const sy = useSpring(ry, { stiffness: 220, damping: 22 });
  const move = (event) => { const rect = ref.current?.getBoundingClientRect(); if (!rect) return; ry.set((event.clientX - rect.left - rect.width / 2) / 18); rx.set(-(event.clientY - rect.top - rect.height / 2) / 18); };
  return <motion.article ref={ref} className="project-card" style={{ rotateX: sx, rotateY: sy, '--card-accent': project.accent }} onMouseMove={move} onMouseLeave={() => { rx.set(0); ry.set(0); }} onClick={() => onOpen(project)} data-cursor>
    <div className="project-card__noise" /><div className="project-card__top"><span>{project.number}</span></div>
    <h3>{project.title}</h3><div className="project-card__tagline">{project.tagline || '\u00a0'}</div><p>{project.description}</p><div className="project-card__stack">{project.stack.map((technology) => <span key={technology}>{technology}</span>)}</div>
  </motion.article>;
}

function ProjectsHeader() {
  const headerRef = useRef(null);
  const designedRef = useRef(null);
  const debugLineRef = useRef(null);
  const deployLineRef = useRef(null);
  const debugStrokeRef = useRef(null);
  const deployStrokeRef = useRef(null);
  const copyRef = useRef(null);
  const reduced = useReducedMotion();
  const tag = '/ 3D — DESIGNED. DEBUGGED. DEPLOYED.';
  // The final content is the render default; the timeline only overrides it briefly.
  const [typedTag, setTypedTag] = useState(tag);
  const [activeDots, setActiveDots] = useState([]);

  useEffect(() => {
    if (reduced) {
      setTypedTag(tag);
      setActiveDots([]);
      return undefined;
    }

    let timeline;
    let fallbackTimer;
    let isInside = false;
    const animatedNodes = () => [designedRef.current, debugLineRef.current, deployLineRef.current, debugStrokeRef.current, deployStrokeRef.current, copyRef.current].filter(Boolean);
    const restoreFinalState = () => {
      window.clearTimeout(fallbackTimer);
      timeline?.kill();
      gsap.set(animatedNodes(), { clearProps: 'all' });
      setTypedTag(tag);
    };
    const startReveal = () => {
      window.clearTimeout(fallbackTimer);
      timeline?.kill();
      gsap.set(animatedNodes(), { clearProps: 'all' });
      setTypedTag('');
      setActiveDots([]);
      const typeProgress = { value: 0 };
      timeline = gsap.timeline({ defaults: { ease: 'power2.out' }, onComplete: restoreFinalState });
      timeline
        .set(designedRef.current, { clipPath: 'inset(0 100% 0 0)', filter: 'drop-shadow(0 0 0 rgba(218,241,222,0))' })
        .set([debugLineRef.current, deployLineRef.current], { filter: 'drop-shadow(0 0 0 rgba(0,0,0,0))' })
        .set([debugStrokeRef.current, deployStrokeRef.current], { strokeDasharray: 1200, strokeDashoffset: 1200 })
        .set(copyRef.current, { autoAlpha: 0, y: 10 })
        .to(typeProgress, { value: 1, duration: 0.4, ease: 'none', onUpdate: () => setTypedTag(tag.slice(0, Math.round(typeProgress.value * tag.length))) }, 0)
        .to(designedRef.current, { clipPath: 'inset(0 0% 0 0)', duration: 0.22 }, 0.05)
        .to(designedRef.current, { filter: 'drop-shadow(0 0 14px rgba(218,241,222,.28))', duration: 0.15 }, 0.27)
        .call(() => setActiveDots((dots) => [...dots, 'green']), null, 0.27)
        .to(debugStrokeRef.current, { strokeDashoffset: 0, duration: 0.22 }, 0.39)
        .to(debugLineRef.current, { filter: 'drop-shadow(0 0 12px rgba(142,182,155,.22))', duration: 0.12 }, 0.61)
        .call(() => setActiveDots((dots) => [...dots, 'amber']), null, 0.61)
        .to(deployStrokeRef.current, { strokeDashoffset: 0, duration: 0.22 }, 0.72)
        .to(deployLineRef.current, { filter: 'drop-shadow(0 0 18px rgba(35,83,71,.5))', duration: 0.12 }, 0.94)
        .call(() => setActiveDots((dots) => [...dots, 'cyan']), null, 0.94)
        .to(copyRef.current, { autoAlpha: 1, y: 0, duration: 0.24 }, 1.12);
      fallbackTimer = window.setTimeout(() => {
        restoreFinalState();
      }, 1600);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        isInside = false;
        return;
      }
      if (!isInside) {
        isInside = true;
        startReveal();
      }
    }, { threshold: 0.25 });

    if (headerRef.current) observer.observe(headerRef.current);
    return () => { observer.disconnect(); restoreFinalState(); };
  }, [reduced]);

  return <div className="projects__header" ref={headerRef}>
    <div className="projects__eyebrow"><span className="projects__pulse" /><span>{typedTag}</span>{!reduced && typedTag.length < tag.length && <i className="projects__cursor" />}</div>
    <div className="projects__intro"><h2 className="projects__heading" aria-label="Designed. Debugged. Deployed."><span className="projects__line projects__line--designed" ref={designedRef}>DESIGNED<span className={`projects__status-dot projects__status-dot--green ${activeDots.includes('green') ? 'projects__status-dot--active' : ''}`} aria-hidden="true" /></span><span className="projects__line projects__line--debugged" ref={debugLineRef}><svg className="projects__stroke-word projects__stroke-word--debugged" viewBox="0 0 540 100" role="presentation" aria-hidden="true"><text ref={debugStrokeRef} x="0" y="78">DEBUGGED</text><circle className={`projects__status-dot projects__status-dot--amber ${activeDots.includes('amber') ? 'projects__status-dot--active' : ''}`} cx="510" cy="68" r="7" /></svg></span><span className="projects__line projects__line--deployed" ref={deployLineRef}><svg className="projects__stroke-word projects__stroke-word--deployed" viewBox="0 0 590 100" role="presentation" aria-hidden="true"><text ref={deployStrokeRef} x="0" y="78">DEPLOYED</text><circle className={`projects__status-dot projects__status-dot--cyan ${activeDots.includes('cyan') ? 'projects__status-dot--active' : ''}`} cx="565" cy="68" r="7" /></svg></span></h2><p ref={copyRef}>Six full-stack and AI/ML systems, each one taken from concept to a working product. Drag sideways to explore the stack behind each.</p></div>
  </div>;
}

function Projects({ onOpen }) {
  return <section className="projects section-shell" id="projects"><ProjectsHeader /><div className="project-rail">{projects.map(project => <ProjectCard key={project.number} project={project} onOpen={onOpen} />)}</div></section>;
}

function Timeline() {
  return <section className="timeline section-shell" id="highlights"><div className="section-tag">/ 004 — SIGNALS</div><div className="timeline__layout"><h2>THE<br /><span className="accent">RECEIPTS.</span></h2><div className="timeline__list"><div><span>2025 — NOW</span><h3>FINAL YEAR / RVCE</h3><p>Computer Science & Engineering, AI/ML focus. Building a cyber-physical digital twin as the final-year project.</p></div><div><span>ALWAYS ON</span><h3>SECURITY PRACTICE</h3><p>CTF labs on TryHackMe and HackTheBox. Learning to see the attack surface before shipping the surface.</p></div><div><span>NEXT SIGNAL</span><h3>PRODUCT ENGINEERING</h3><p>Looking for a team working on hard, high-leverage problems in software, platforms, or security.</p></div></div></div></section>;
}

function Contact() {
  const [status, setStatus] = useState('idle');
  const [form, setForm] = useState({ firstName: '', email: '', subject: '', message: '' });
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
    if (!form.firstName.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      setStatus('error');
      return;
    }
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (!serviceId || !templateId || !publicKey) {
      setStatus('config-error');
      return;
    }
    setStatus('sending');
    try {
      await emailjs.send(serviceId, templateId, {
        first_name: form.firstName,
        reply_to: form.email,
        subject: form.subject,
        message: form.message,
        to_email: 'nithish7483@gmail.com',
      }, { publicKey });
      setStatus('success');
      setForm({ firstName: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('EmailJS contact submission failed', error);
      setStatus('send-error');
    }
  };
  return <section className="contact section-shell" id="contact">
    <div className="contact__panels">
      <div className="contact__form-panel">
        <span className="section-tag">/ GET IN TOUCH</span>
        <h2>MAKE THE NEXT<br /><span className="accent">SIGNAL.</span></h2>
        <p>Bring the strange, high-leverage problem. I like turning a rough signal into a system with edges you can trust.</p>
        <form className="contact-form" onSubmit={submit} noValidate>
          <label><span>FIRST NAME</span><input name="firstName" value={form.firstName} onChange={updateField} autoComplete="given-name" placeholder="Your name" required /></label>
          <label><span>YOUR EMAIL</span><input type="email" name="email" value={form.email} onChange={updateField} autoComplete="email" placeholder="you@company.com" required /></label>
          <label><span>SUBJECT</span><input name="subject" value={form.subject} onChange={updateField} placeholder="What are we solving?" required /></label>
          <label className="contact-form__message"><span>YOUR MESSAGE</span><textarea name="message" value={form.message} onChange={updateField} placeholder="Give me the useful context." rows="5" required /></label>
          <button className="contact-submit magnetic" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'SENDING…' : status === 'success' ? 'MESSAGE SENT ✓' : 'SEND MESSAGE'} <ArrowUpRight size={17} /></button>
          {status === 'error' && <p className="form-status form-status--error" role="alert">Fill in every field before sending.</p>}
          {status === 'config-error' && <p className="form-status form-status--error" role="alert">Email is not configured yet. Add the three VITE_EMAILJS values to your environment.</p>}
          {status === 'send-error' && <p className="form-status form-status--error" role="alert">The message could not be sent. Please email me directly instead.</p>}
          {status === 'success' && <p className="form-status form-status--success" role="status">Thanks — your note is in my inbox.</p>}
        </form>
      </div>
      <motion.div className="contact__details-panel" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.65, staggerChildren: 0.1 }}>
        <span className="section-tag">/ DIRECT CHANNELS</span>
        <div className="contact-links">{details.map(({ label, value, href, icon: Icon }, index) => <motion.a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined} className="contact-link" data-cursor initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.08, duration: 0.45 }}><span className="contact-link__icon"><Icon size={19} /></span><span><small>{label}</small><strong>{value}</strong></span><ArrowUpRight size={16} className="contact-link__arrow" /></motion.a>)}</div>
        <p className="contact-alternative">Prefer a backend? I can swap this client-side flow for a Flask + SMTP endpoint when the project needs server-side control.</p>
      </motion.div>
    </div>
    <footer><span>© NITHISH / BUILT WITH INTENT</span><div><a href="mailto:nithish7483@gmail.com"><Mail size={16} /> EMAIL</a><a href="https://github.com/Nithishb03" target="_blank" rel="noreferrer"><SiGithub size={16} /> GITHUB</a><a href="https://www.linkedin.com/in/nithishb03/" target="_blank" rel="noreferrer"><FaLinkedinIn size={16} /> LINKEDIN</a></div></footer>
  </section>;
}

function CaseStudy({ project, onClose }) {
  return <motion.div className="case-study" initial={{ clipPath: 'inset(100% 0 0 0)' }} animate={{ clipPath: 'inset(0% 0 0 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}><button className="case-study__close" onClick={onClose}><X size={20} /> CLOSE</button><div className="case-study__inner"><div className="case-study__header"><span className="section-tag" style={{ color: project.accent }}>/ CASE {project.number}</span><a className="case-study__github" href={project.github} target="_blank" rel="noopener noreferrer" style={{ '--project-accent': project.accent }} data-cursor><SiGithub size={24} /><span>GITHUB</span><ArrowUpRight size={18} /></a></div><h2>{project.title}</h2><div className="case-study__grid"><div><span className="muted">THE PROBLEM</span><p>{project.problem || project.description}</p></div><div><span className="muted">THE SOLUTION</span><p>{project.solution || project.tagline || 'A focused build exploring practical software systems.'}</p></div><div><span className="muted">TECH STACK</span><p>{project.stack.join(' · ')}</p></div></div><div className="case-study__stack">{project.stack.map(item => <span key={item}>{item}</span>)}</div></div></motion.div>;
}

function App() {
  const [loaded, setLoaded] = useState(false); const [activeSection, setActiveSection] = useState('home'); const [openProject, setOpenProject] = useState(null); const reduced = useReducedMotion();
  useEffect(() => { document.body.style.overflow = openProject ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [openProject]);
  const navigate = (section) => { setActiveSection(section); window.scrollTo({ top: 0, behavior: 'auto' }); };
  const section = activeSection === 'home' ? <Hero onNavigate={navigate} /> : activeSection === 'about' ? <About /> : activeSection === 'skills' ? <Skills /> : activeSection === 'projects' ? <Projects onOpen={setOpenProject} /> : activeSection === 'contact' ? <Contact /> : <Resume />;
  return <><AnimatePresence>{!loaded && <Preloader onDone={() => setLoaded(true)} />}</AnimatePresence><CustomCursor /><Nav active={activeSection} onNavigate={navigate} /><main><AnimatePresence mode="wait"><motion.div key={activeSection} initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: reduced ? 0 : 0.25 }}>{section}</motion.div></AnimatePresence></main><AnimatePresence>{openProject && <CaseStudy project={openProject} onClose={() => setOpenProject(null)} />}</AnimatePresence></>;
}

createRoot(document.getElementById('root')).render(<App />);
