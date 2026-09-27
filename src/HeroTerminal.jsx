import React, { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { projects, skillsData, contactDetails } from './portfolioData';

const BOOT_LINES = [
  'nithish@portfolio:~$ initializing...',
  'connection established.',
  "type 'help' to see available commands.",
];

export default function HeroTerminal({ onNavigate, isLoaded = true, startDelay = 0.15 }) {
  const reduced = useReducedMotion();
  const inputRef = useRef(null);
  const bodyRef = useRef(null);

  const [completedLines, setCompletedLines] = useState([]);
  const [activeLineText, setActiveLineText] = useState('');
  const [activeLineIndex, setActiveLineIndex] = useState(-1);
  const [bootFinished, setBootFinished] = useState(false);
  const [history, setHistory] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Character-by-character typewriter boot sequence
  useEffect(() => {
    if (!isLoaded) {
      return undefined;
    }

    let isCancelled = false;
    const timers = [];

    // Safety failsafe guardrail: Ensure terminal is fully booted within 4.5s
    const failsafeTimer = setTimeout(() => {
      if (!isCancelled) {
        setCompletedLines(BOOT_LINES);
        setActiveLineText('');
        setActiveLineIndex(-1);
        setBootFinished(true);
      }
    }, 4500);
    timers.push(failsafeTimer);

    // Initial delay before starting the boot sequence
    const initTimer = setTimeout(() => {
      if (isCancelled) return;

      let lineIdx = 0;
      let charIdx = 0;
      setActiveLineIndex(0);

      const typeChar = () => {
        if (isCancelled) return;
        const currentTarget = BOOT_LINES[lineIdx];

        if (charIdx <= currentTarget.length) {
          setActiveLineText(currentTarget.slice(0, charIdx));
          charIdx++;
          // 20-28ms per character for an organic, responsive stream
          const charSpeed = 22 + Math.floor(Math.random() * 8);
          const t = setTimeout(typeChar, charSpeed);
          timers.push(t);
        } else {
          // Finished typing this line
          const finishedLine = currentTarget;
          setCompletedLines((prev) => [...prev, finishedLine]);
          setActiveLineText('');
          lineIdx++;
          charIdx = 0;

          if (lineIdx < BOOT_LINES.length) {
            setActiveLineIndex(lineIdx);
            // 220ms pause between boot lines
            const pauseTimer = setTimeout(typeChar, 220);
            timers.push(pauseTimer);
          } else {
            // All boot lines complete
            setActiveLineIndex(-1);
            setBootFinished(true);
          }
        }
      };

      typeChar();
    }, (startDelay || 0.6) * 1000);

    timers.push(initTimer);

    return () => {
      isCancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [reduced, isLoaded, startDelay]);

  // Auto-scroll when output or input changes
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [completedLines, activeLineText, history, currentInput]);

  // Command parser
  const processCommand = (rawInput) => {
    const trimmed = rawInput.trim();
    if (!trimmed) {
      return [];
    }

    const cmd = trimmed.toLowerCase();

    switch (cmd) {
      case 'help':
        return [
          { text: 'AVAILABLE COMMANDS:', type: 'header' },
          { text: '  whoami    - identity & background summary', type: 'info' },
          { text: '  skills    - technical stack by category', type: 'info' },
          { text: '  projects  - 6 featured production systems', type: 'info' },
          { text: '  contact   - direct communication channels', type: 'info' },
          { text: '  resume    - jump to resume download section', type: 'info' },
          { text: '  clear     - clear terminal screen', type: 'info' },
          { text: '  help      - display this command reference', type: 'info' },
        ];

      case 'whoami':
        return [
          { text: 'Nithish B — Full Stack Developer, AI/ML Engineer', type: 'accent' },
          { text: 'BE Computer Science & Engineering (Cyber Security) @ RV College of Engineering, Bengaluru', type: 'info' },
        ];

      case 'skills':
        return [
          { text: 'CATEGORIZED SKILLS:', type: 'header' },
          ...skillsData.map((item) => ({
            text: `  [${item.category.padEnd(20, ' ')}] ${item.skills.join(', ')}`,
            type: 'info',
          })),
        ];

      case 'projects':
        return [
          { text: 'FEATURED PROJECTS (6):', type: 'header' },
          ...projects.map((p) => ({
            text: `  ${p.number}. ${p.title} — ${p.tagline || p.description.slice(0, 60) + '...'}`,
            type: 'info',
          })),
        ];

      case 'contact':
        return [
          { text: 'DIRECT CHANNELS:', type: 'header' },
          ...contactDetails.map((c) => ({
            text: `  ${c.label.padEnd(10, ' ')}: ${c.value}`,
            type: 'info',
          })),
        ];

      case 'resume': {
        const el = document.getElementById('resume');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
        onNavigate?.('resume');
        return [
          { text: 'Opening resume section...', type: 'accent' },
        ];
      }

      case 'clear':
        setBootLines([]);
        setHistory([]);
        return null;

      default:
        return [
          {
            text: `command not found: "${trimmed}" — type 'help' for a list of commands`,
            type: 'error',
          },
        ];
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = currentInput;
      if (input.trim() === 'clear') {
        processCommand('clear');
        setCurrentInput('');
        setHistoryIndex(-1);
        return;
      }

      const responseLines = processCommand(input);

      setHistory((prev) => {
        const next = [
          ...prev,
          { text: input, type: 'command' },
          ...(responseLines || []),
        ];
        // Cap scrollback to last 45 items to prevent unbounded memory
        return next.slice(-45);
      });

      if (input.trim()) {
        setCommandHistory((prev) => [...prev, input.trim()]);
      }

      setCurrentInput('');
      setHistoryIndex(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex < commandHistory.length) {
        setHistoryIndex(nextIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    }
  };

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="hero-term" onClick={focusInput} role="region" aria-label="Interactive portfolio terminal">
      <div className="hero-term__header">
        <span className="hero-term__tag">// SYSTEM ACCESS</span>
        <div className="hero-term__dots" aria-hidden="true">
          <span className="hero-term__dot hero-term__dot--active" />
          <span className="hero-term__dot" />
          <span className="hero-term__dot" />
        </div>
      </div>

      <div ref={bodyRef} className="hero-term__body" aria-live="polite" aria-atomic="false">
        {completedLines.map((text, i) => (
          <div key={`boot-done-${i}`} className="hero-term__line hero-term__line--boot">
            {text.startsWith('nithish@portfolio:~$') ? (
              <>
                <span className="hero-term__prompt-sym hero-term__prompt-sym--boot">nithish@portfolio:~$ </span>
                <span>{text.replace('nithish@portfolio:~$', '').trimStart()}</span>
              </>
            ) : (
              text
            )}
          </div>
        ))}

        {activeLineIndex >= 0 && (
          <div className="hero-term__line hero-term__line--boot">
            {BOOT_LINES[activeLineIndex].startsWith('nithish@portfolio:~$') ? (
              <>
                <span className="hero-term__prompt-sym hero-term__prompt-sym--boot">
                  {'nithish@portfolio:~$ '.slice(0, activeLineText.length)}
                </span>
                <span>{activeLineText.length > 21 ? activeLineText.slice(21) : ''}</span>
              </>
            ) : (
              activeLineText
            )}
            <span className="hero-term__cursor hero-term__cursor--boot" aria-hidden="true" />
          </div>
        )}

        {history.map((item, i) => (
          <div key={`hist-${i}`} className={`hero-term__line hero-term__line--${item.type}`}>
            {item.type === 'command' ? (
              <>
                <span className="hero-term__prompt-sym">nithish@portfolio:~$</span> {item.text}
              </>
            ) : (
              item.text
            )}
          </div>
        ))}

        {bootFinished && (
          <div className="hero-term__prompt-row" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span className="hero-term__prompt-sym" aria-hidden="true">nithish@portfolio:~$</span>
            <span className="hero-term__input-display" style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '6px' }}>
              <span style={{ color: '#8eb69b', fontFamily: 'var(--mono)', fontSize: '11.5px', whiteSpace: 'pre' }}>{currentInput}</span>
              <span className="hero-term__cursor" aria-hidden="true" />
            </span>
            <input
              ref={inputRef}
              type="text"
              className="hero-term__input"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              aria-label="Terminal command input"
              style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'text' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
