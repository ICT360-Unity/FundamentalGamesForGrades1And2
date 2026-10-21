import React, { useEffect, useMemo, useRef, useState } from 'react';
import Scene, { SPOTS } from './components/Scene.jsx';
import Student from './components/Student.jsx';
import HabitBadge, { HabitGlyph } from './components/HabitBadge.jsx';
import Logo from './components/Logo.jsx';
import { LEVELS, STUDENTS, HABITS } from './data/levels.js';
import { play, setSoundEnabled } from './lib/sound.js';
import { speak, stopSpeaking, canSpeak } from './lib/speech.js';

const HABIT_IDS = Object.keys(HABITS);
const MAX_PER_TICKET = 100;
const POINTS = { keyClue: 20, firstTry: 40, secondTry: 20, later: 10 };

// Deterministic shuffle so the right answer is not always in the same place,
// but each ticket looks the same every time (fair for a whole class).
function seededShuffle(arr, seed) {
  const a = arr.map((x, i) => ({ x, i }));
  let s = seed * 9301 + 49297;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const tryPoints = (wrong) => (wrong === 0 ? POINTS.firstTry : wrong === 1 ? POINTS.secondTry : POINTS.later);

function fixedSceneFor(level) {
  if (level.scene.screen === 'printing') return { screen: 'printed', printer: 'ok' };
  return { screen: 'desktop' };
}

const freshTicket = () => ({ step: 'look', found: {}, keyFound: false, causeWrong: [], actionWrong: [], feedback: null, points: 0, hintShown: false, newBadges: [] });

export default function App() {
  const [view, setView] = useState('title'); // title | play | end
  const [levelIndex, setLevelIndex] = useState(0);
  const [ticket, setTicket] = useState(freshTicket);
  const [results, setResults] = useState([]); // per-ticket summaries
  const [habits, setHabits] = useState(() => Object.fromEntries(HABIT_IDS.map((h) => [h, 0])));
  const [sound, setSound] = useState(true);
  const [flashSpot, setFlashSpot] = useState(null);
  const panelRef = useRef(null);

  const level = LEVELS[levelIndex];
  const student = STUDENTS[level.student];
  const score = results.reduce((t, r) => t + r.points, 0) + ticket.points;

  useEffect(() => setSoundEnabled(sound), [sound]);
  useEffect(() => () => stopSpeaking(), []);

  // Move keyboard focus to the panel heading whenever the step changes.
  useEffect(() => {
    if (view !== 'play') return;
    const h = panelRef.current?.querySelector('h2');
    if (h) h.focus({ preventScroll: true });
  }, [ticket.step, levelIndex, view]);

  const causes = useMemo(() => seededShuffle(level.causes, levelIndex + 3), [levelIndex]);
  const actions = useMemo(() => seededShuffle(level.actions, levelIndex + 11), [levelIndex]);

  /* ---------------- actions ---------------- */

  function startGame(at = 0) {
    stopSpeaking();
    setLevelIndex(at);
    setTicket(freshTicket());
    setResults([]);
    setHabits(Object.fromEntries(HABIT_IDS.map((h) => [h, 0])));
    setView('play');
    play('tap');
  }

  function inspect(spotId) {
    const clue = level.clues.find((c) => c.spot === spotId);
    if (!clue || ticket.step === 'solved') return;
    if (ticket.found[spotId]) { speak(clue.text); return; }
    const isKey = !!clue.key;
    play(isKey ? 'key' : 'clue');
    setTicket((t) => ({
      ...t,
      found: { ...t.found, [spotId]: isKey ? 'key' : 'plain' },
      keyFound: t.keyFound || isKey,
      points: t.points + (isKey ? POINTS.keyClue : 0),
      lastClue: spotId,
    }));
  }

  function showHint() {
    play('tap');
    const key = level.clues.find((c) => c.key);
    setFlashSpot(key.spot);
    setTimeout(() => setFlashSpot(null), 2400);
    setTicket((t) => ({ ...t, hintShown: true }));
  }

  function chooseCause(opt, idx) {
    if (opt.correct) {
      play('right');
      setTicket((t) => ({
        ...t,
        step: 'act',
        points: t.points + tryPoints(t.causeWrong.length),
        feedback: { tone: 'good', text: `Yes! ${opt.text}.` },
      }));
    } else {
      play('oops');
      setTicket((t) => ({ ...t, causeWrong: [...t.causeWrong, idx], feedback: { tone: 'oops', text: opt.why } }));
    }
  }

  function chooseAction(opt, idx) {
    if (opt.correct) {
      play('stamp');
      const earned = opt.habits || [];
      setTimeout(() => earned.length && play('badge'), 650);
      setHabits((h) => { const n = { ...h }; earned.forEach((k) => (n[k] += 1)); return n; });
      setTicket((t) => {
        const points = t.points + tryPoints(t.actionWrong.length);
        return { ...t, step: 'solved', points, newBadges: earned, feedback: { tone: 'good', text: opt.why } };
      });
    } else {
      play('oops');
      setTicket((t) => ({ ...t, actionWrong: [...t.actionWrong, idx], feedback: { tone: 'oops', text: opt.why } }));
    }
  }

  function nextTicket() {
    stopSpeaking();
    play('tap');
    const summary = {
      id: level.id,
      points: ticket.points,
      diagnosedFirstTry: ticket.causeWrong.length === 0,
      safeFirstTry: ticket.actionWrong.length === 0,
      unsafeChoices: ticket.actionWrong.length,
      stars: 3 - Math.min(2, ticket.causeWrong.length + ticket.actionWrong.length),
    };
    const nextResults = [...results, summary];
    setResults(nextResults);
    if (levelIndex + 1 >= LEVELS.length) {
      setView('end');
    } else {
      setLevelIndex(levelIndex + 1);
      setTicket(freshTicket());
    }
  }

  /* ---------------- views ---------------- */

  if (view === 'title') return <TitleScreen onStart={startGame} sound={sound} setSound={setSound} />;
  if (view === 'end') return <EndScreen results={results} habits={habits} onReplay={() => startGame(0)} />;

  const spotStates = Object.fromEntries(level.clues.map((c) => [c.spot, ticket.found[c.spot] || 'unseen']));
  const plainFound = Object.values(ticket.found).filter((v) => v === 'plain').length;
  const sceneState = ticket.step === 'solved' ? fixedSceneFor(level) : level.scene;
  const steps = [
    { id: 'look', label: 'Look' },
    { id: 'think', label: 'Think' },
    { id: 'act', label: 'Act' },
  ];
  const stepOrder = ['look', 'think', 'act', 'solved'];
  const currentStepIdx = stepOrder.indexOf(ticket.step);
  const mood = ticket.step === 'solved' ? 'happy' : ticket.step === 'look' ? 'worried' : 'thinking';

  return (
    <div className="app">
      <header className="hud">
        <div className="hud__brand">
          <Logo size={40} />
          <span className="hud__title">Help Desk Hero</span>
        </div>
        <div className="hud__progress" aria-label={`Ticket ${levelIndex + 1} of ${LEVELS.length}`}>
          {LEVELS.map((l, i) => (
            <span key={l.id} className={`pip ${i < levelIndex ? 'pip--done' : ''} ${i === levelIndex ? 'pip--now' : ''}`} />
          ))}
        </div>
        <div className="hud__score" aria-live="polite"><span className="hud__score-num">{score}</span><span className="hud__score-label"> points</span></div>
        <div className="hud__badges" aria-label="Safety First badges">
          {HABIT_IDS.map((h) => (
            <HabitBadge key={h} habit={h} count={habits[h]} pop={ticket.step === 'solved' && ticket.newBadges.includes(h)} />
          ))}
        </div>
        <button className="icon-btn" onClick={() => setSound((s) => !s)} aria-pressed={sound} aria-label={sound ? 'Turn sound effects off' : 'Turn sound effects on'}>
          {sound ? <SoundOnIcon /> : <SoundOffIcon />}
        </button>
      </header>

      <main className="desk">
        <section className="ticket" aria-label={`Help ticket from ${student.name}`}>
          <div className="ticket__top">
            <span className="ticket__no">Ticket {String(levelIndex + 1).padStart(3, '0')}</span>
            <span className="ticket__from">from {student.name}</span>
          </div>
          <div className="ticket__body">
            <div className="ticket__avatar"><Student student={student} mood={mood} size={96} /></div>
            <blockquote className="bubble">
              <p>{level.problem}</p>
              {canSpeak && (
                <button className="read-btn" onClick={() => speak(`${student.name} says: ${level.problem}`)} aria-label="Read the problem aloud">
                  <SpeakIcon /> Read aloud
                </button>
              )}
            </blockquote>
          </div>
          <ol className="steps" aria-label="Help desk steps">
            {steps.map((s, i) => (
              <li key={s.id} className={`steps__item ${i < currentStepIdx ? 'is-done' : ''} ${i === currentStepIdx ? 'is-now' : ''}`} aria-current={i === currentStepIdx ? 'step' : undefined}>
                <span className="steps__num">{i < currentStepIdx ? '✓' : i + 1}</span>{s.label}
              </li>
            ))}
          </ol>
          {ticket.step === 'solved' && (
            <div className="stamp" aria-hidden="true">
              <span>Solved</span><span className="stamp__small">safely</span>
            </div>
          )}
        </section>

        <section className={`scene-wrap ${ticket.step === 'look' ? 'is-looking' : ''}`} aria-label="Computer desk">
          <Scene
            scene={sceneState}
            spots={spotStates}
            onInspect={ticket.step === 'look' ? inspect : null}
            flashSpot={flashSpot}
            solved={ticket.step === 'solved'}
            title={`${student.name}'s computer desk`}
          />
          {ticket.step !== 'look' && ticket.step !== 'solved' && <p className="scene-note">Clues found. Now decide what to do.</p>}
        </section>

        <section className="panel" ref={panelRef} aria-live="polite">
          {ticket.step === 'look' && (
            <>
              <h2 tabIndex={-1}>Look for clues</h2>
              <p className="panel__lead">Tap the <span className="q-mark">?</span> marks on the desk to inspect each part. Find the clue that explains the problem.</p>
              <ul className="clue-list">
                {level.clues.filter((c) => ticket.found[c.spot]).map((c) => (
                  <li key={c.spot} className={`clue ${c.key ? 'clue--key' : ''} ${ticket.lastClue === c.spot ? 'clue--new' : ''}`}>
                    <span className="clue__where">{cap(SPOTS[c.spot].label)}</span>
                    <span className="clue__text">{c.text}</span>
                    {c.key && <span className="clue__flag">Important clue</span>}
                  </li>
                ))}
                {Object.keys(ticket.found).length === 0 && <li className="clue clue--empty">Your clue notebook is empty. Start inspecting!</li>}
              </ul>
              <div className="panel__actions">
                {ticket.keyFound ? (
                  <button className="btn btn--primary" onClick={() => { play('tap'); setTicket((t) => ({ ...t, step: 'think', feedback: null })); }}>
                    Work out the cause
                  </button>
                ) : (
                  plainFound >= 2 && !ticket.hintShown && (
                    <button className="btn btn--ghost" onClick={showHint}>Show me a hint</button>
                  )
                )}
                {ticket.hintShown && !ticket.keyFound && <p className="hint">Hint: {level.hint}</p>}
              </div>
            </>
          )}

          {ticket.step === 'think' && (
            <>
              <h2 tabIndex={-1}>What is the most likely cause?</h2>
              <p className="panel__lead">Use the clues in your notebook.</p>
              <ChoiceList options={causes} wrong={ticket.causeWrong} onChoose={chooseCause} />
              <Feedback fb={ticket.feedback} />
            </>
          )}

          {ticket.step === 'act' && (
            <>
              <h2 tabIndex={-1}>What should you do?</h2>
              <p className="panel__lead">Choose the <strong>safest</strong> action. Remember the Safety First poster!</p>
              <ChoiceList options={actions} wrong={ticket.actionWrong} onChoose={chooseAction} />
              <Feedback fb={ticket.feedback} />
            </>
          )}

          {ticket.step === 'solved' && (
            <>
              <h2 tabIndex={-1}>Ticket solved!</h2>
              <p className="solved-line">{level.solved}</p>
              <Feedback fb={ticket.feedback} />
              {ticket.newBadges.length > 0 && (
                <div className="earned">
                  <p className="earned__title">Safety habits you used</p>
                  <ul>
                    {ticket.newBadges.map((h) => (
                      <li key={h}><HabitGlyph habit={h} size={36} /><span><strong>{HABITS[h].name}.</strong> {HABITS[h].tip}</span></li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="ticket-points">+{ticket.points} of {MAX_PER_TICKET} points</p>
              <div className="panel__actions">
                <button className="btn btn--primary" onClick={nextTicket}>
                  {levelIndex + 1 < LEVELS.length ? 'Next ticket' : 'See my certificate'}
                </button>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

/* ---------------- small components ---------------- */

function ChoiceList({ options, wrong, onChoose }) {
  return (
    <div className="choices" role="group">
      {options.map(({ x: opt, i }) => {
        const isWrong = wrong.includes(i);
        return (
          <button key={i} className={`choice ${isWrong ? 'choice--wrong' : ''}`} disabled={isWrong} onClick={() => onChoose(opt, i)}>
            <span className="choice__text">{opt.text}</span>
            {isWrong && <span className="sr-only"> (not this one)</span>}
          </button>
        );
      })}
    </div>
  );
}

function Feedback({ fb }) {
  if (!fb) return null;
  return (
    <div className={`feedback feedback--${fb.tone}`} role="status">
      <p>{fb.tone === 'oops' && <strong>Not quite. </strong>}{fb.text}</p>
      {canSpeak && (
        <button className="read-btn read-btn--small" onClick={() => speak(fb.text)} aria-label="Read this aloud"><SpeakIcon /></button>
      )}
    </div>
  );
}

function TitleScreen({ onStart, sound, setSound }) {
  const [showTickets, setShowTickets] = useState(false);
  return (
    <div className="title">
      <div className="title__card">
        <div className="title__head">
          <Logo size={88} />
          <div>
            <h1>Help Desk Hero</h1>
            <p className="title__lesson">ICT360 · Lesson 2 · Basic Troubleshooting</p>
          </div>
        </div>
        <p className="title__intro">
          Students are lining up at the school help desk with computer problems. Inspect their desk for clues,
          work out the cause, then choose the <strong>safest</strong> way to fix it. A real hero knows when to call the teacher!
        </p>
        <ol className="title__how">
          <li><strong>Look.</strong> Tap the <span className="q-mark">?</span> marks to find clues.</li>
          <li><strong>Think.</strong> Pick the most likely cause.</li>
          <li><strong>Act.</strong> Choose the safe action and earn Safety First badges.</li>
        </ol>
        <div className="title__badges">
          {HABIT_IDS.map((h) => (
            <div key={h} className="title__badge"><HabitGlyph habit={h} size={46} /><span>{HABITS[h].name}</span></div>
          ))}
        </div>
        <div className="title__actions">
          <button className="btn btn--primary btn--big" onClick={() => onStart(0)}>Open the help desk</button>
          <button className="btn btn--ghost" onClick={() => setShowTickets((v) => !v)} aria-expanded={showTickets}>
            {showTickets ? 'Hide ticket list' : 'Teachers: jump to a ticket'}
          </button>
          <label className="toggle">
            <input type="checkbox" checked={sound} onChange={(e) => setSound(e.target.checked)} /> Sound effects
          </label>
        </div>
        {showTickets && (
          <ol className="ticket-picker">
            {LEVELS.map((l, i) => (
              <li key={l.id}>
                <button onClick={() => onStart(i)}>
                  <span className="ticket-picker__no">{i + 1}</span>
                  <span>{STUDENTS[l.student].name}: {l.problem}</span>
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>
      <div className="title__scene" aria-hidden="true"><Scene scene={{ screen: 'desktop' }} /></div>
    </div>
  );
}

function EndScreen({ results, habits, onReplay }) {
  const [name, setName] = useState('');
  const total = results.reduce((t, r) => t + r.points, 0);
  const max = LEVELS.length * MAX_PER_TICKET;
  const diag = results.filter((r) => r.diagnosedFirstTry).length;
  const safe = results.filter((r) => r.safeFirstTry).length;
  const stars = results.reduce((t, r) => t + r.stars, 0);
  const rank = total >= 800 ? 'Help Desk Hero' : total >= 600 ? 'Help Desk Helper' : 'Help Desk Trainee';
  useEffect(() => { play('stamp'); }, []);

  return (
    <div className="end">
      <div className="cert">
        <div className="cert__head">
          <Logo size={64} />
          <div>
            <p className="cert__kicker">Certificate of troubleshooting</p>
            <h1>{rank}</h1>
          </div>
        </div>
        <label className="cert__name">
          <span>This certificate belongs to</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Type your name" maxLength={40} />
        </label>
        <div className="cert__stats">
          <div><span className="cert__big">{total}</span><span>points out of {max}</span></div>
          <div><span className="cert__big">{diag}/{LEVELS.length}</span><span>causes found first time</span></div>
          <div><span className="cert__big">{safe}/{LEVELS.length}</span><span>safe choices first time</span></div>
          <div><span className="cert__big">{stars}</span><span>stars of {LEVELS.length * 3}</span></div>
        </div>
        <div className="cert__badges">
          {HABIT_IDS.map((h) => (
            <div key={h} className="cert__badge">
              <HabitGlyph habit={h} size={54} earned={habits[h] > 0} />
              <strong>{HABITS[h].name}</strong>
              <span>used {habits[h]} {habits[h] === 1 ? 'time' : 'times'}</span>
            </div>
          ))}
        </div>
        <p className="cert__remember">
          Remember: most computer problems are fixed by <strong>noticing clearly</strong> and <strong>telling a teacher exactly what you saw</strong>.
        </p>
        <div className="cert__actions">
          <button className="btn btn--primary" onClick={onReplay}>Play again</button>
          <button className="btn btn--ghost" onClick={() => window.print()}>Print certificate</button>
        </div>
      </div>
    </div>
  );
}

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function SpeakIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" /><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
  );
}
function SoundOnIcon() {
  return <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" /><path d="M16 8.5a5 5 0 0 1 0 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
}
function SoundOffIcon() {
  return <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" /><path d="M16 9l5 6M21 9l-5 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
}
