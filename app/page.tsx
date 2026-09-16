"use client";

import { useMemo, useState } from "react";

const palette = {
  clay: "#A3E635",
  sand: "#A78BFA",
  teal: "#4F46E5",
  ink: "#111111",
  cream: "#F2F0E8",
};

const participants = Array.from({ length: 12 }, (_, i) => {
  const isCase = i < 6;
  const scores = isCase
    ? [58 + i * 4, 64 - i * 2, 49 + i * 5]
    : [24 + i * 2, 28 + i, 20 + i];
  const status = isCase
    ? i === 0
      ? "Action"
      : i < 3
        ? "Converging"
        : "Watch"
    : "Stable";
  return {
    id: `P-${4821 + i * 37}`,
    age: 27 + i * 2,
    city: ["Mumbai", "Delhi NCR", "Bengaluru", "Chennai", "Hyderabad", "Pune"][
      i % 6
    ],
    work:
      i % 3 === 0
        ? "Desk-based"
        : i % 3 === 1
          ? "Mixed/field-based"
          : "Manual/physical",
    group: isCase ? "Case" : "Control",
    scores,
    status,
    confidence: isCase && i < 2 ? "Moderate" : "High",
    completeness: 84 + ((i * 3) % 15),
    days: 30,
  };
});

function Arrow({ down = false }: { down?: boolean }) {
  return (
    <span aria-hidden="true" className="arrow">
      {down ? "↓" : "↑"}
    </span>
  );
}
function Status({ value }: { value: string }) {
  return (
    <span className={`status status-${value.toLowerCase()}`}>{value}</span>
  );
}
function Sparkline({
  values,
  color = palette.clay,
}: {
  values: number[];
  color?: string;
}) {
  const points = values.map((v, i) => `${i * 18},${46 - v * 0.38}`).join(" ");
  return (
    <svg
      className="spark"
      viewBox="0 0 90 50"
      preserveAspectRatio="none"
      aria-label="Score trend"
    >
      <polyline points={points} fill="none" stroke={color} strokeWidth="3" />
    </svg>
  );
}

function Landing({
  onEnter,
}: {
  onEnter: (role: "participant" | "researcher") => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <main className="landing">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">RR</span>
          <span>REDOXRADAR</span>
        </div>
        <span className="eyebrow">RESEARCH-STAGE PATTERN TRACKING / 01</span>
        <button className="text-button" onClick={() => onEnter("researcher")}>
          Study dashboard <Arrow />
        </button>
      </header>
      <section
        className="hero"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="hero-copy">
          <p className="eyebrow">A clearer signal in the noise</p>
          <h1>
            Track the
            <br />
            <em>pattern.</em>
            <br />
            Not the label.
          </h1>
          <p className="hero-sub">
            RedoxRadar helps people and researchers see how psychological load,
            recovery, and physiological signals move together over time.
          </p>
          <div className="hero-actions">
            <button
              className="button button-dark"
              onClick={() => onEnter("participant")}
            >
              Enter participant portal <Arrow />
            </button>
            <span className="disclaimer">
              Research prototype — not a diagnostic device
            </span>
          </div>
        </div>
        <div className={`hero-diagram ${hover ? "is-hovered" : ""}`}>
          <div className="diagram-label">LIVE PATTERN / 30 DAY WINDOW</div>
          <div className="bars">
            {[62, 39, 78, 51, 88, 45].map((height, i) => (
              <div key={i} className="bar-wrap">
                <div
                  className={`bar ${i === 2 || i === 4 ? "bar-clay" : ""}`}
                  style={{
                    height: `${height}%`,
                    animationDelay: `${i * -0.3}s`,
                  }}
                />
                <span>0{i + 1}</span>
              </div>
            ))}
          </div>
          <div className="diagram-foot">
            <span>PSYCH</span>
            <span>RECOVERY</span>
            <span>PHYSIO</span>
          </div>
        </div>
      </section>
      <div className="marquee">
        <div>
          TRACK YOUR PATTERN — SEE WHAT&apos;S CONVERGING — CATCH IT BEFORE IT
          PERSISTS — KNOW WHAT CHANGED AND WHY — TRACK YOUR PATTERN — SEE
          WHAT&apos;S CONVERGING —
        </div>
      </div>
      <section className="section how">
        <div className="section-kicker">01 / HOW IT WORKS</div>
        <div className="steps">
          {[
            [
              "01",
              "Log your signals",
              "Small daily inputs create a personal reference point.",
            ],
            [
              "02",
              "Track your pattern",
              "Three domains, read in context—not isolation.",
            ],
            [
              "03",
              "See the trajectory",
              "Persistence matters more than any single day.",
            ],
            [
              "04",
              "Get a suggested action",
              "A practical next step, never a diagnosis.",
            ],
          ].map(([n, title, text], i) => (
            <article
              className="step"
              key={n}
              style={{ transform: `translateY(${i % 2 ? 34 : 0}px)` }}
            >
              <span className="step-number">{n}</span>
              <h2>{title}</h2>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="tracks">
        <div className="section-kicker">02 / WHAT IT TRACKS</div>
        <div className="track-row">
          {[
            ["01", "Psychological Load", "PHQ-4 + work-life balance"],
            ["02", "Recovery & Sleep", "Duration, quality, daytime impact"],
            ["03", "Physiological Signals", "Resting HR, BP, optional SpO₂"],
            ["04", "Clinical Context", "Labs and BP, context only"],
          ].map(([n, title, text]) => (
            <div className="track" key={n}>
              <strong>{n}</strong>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="portal-section">
        <div className="section-kicker">03 / CHOOSE YOUR VIEW</div>
        <div className="portals">
          <article className="portal-card clay-card">
            <span className="eyebrow">FOR PARTICIPANTS</span>
            <h2>Your pattern, in plain view.</h2>
            <p>
              Log daily signals, build your personal baseline, and understand
              what is changing across time.
            </p>
            <button
              className="button button-dark"
              onClick={() => onEnter("participant")}
            >
              Continue as participant <Arrow />
            </button>
          </article>
          <article className="portal-card dark-card">
            <span className="eyebrow">FOR RESEARCHERS</span>
            <h2>The cohort, in context.</h2>
            <p>
              Explore synthetic participant data, compare groups, inspect
              diagnostics, and review safety flags.
            </p>
            <button
              className="button button-light"
              onClick={() => onEnter("researcher")}
            >
              Continue as researcher <Arrow />
            </button>
          </article>
        </div>
      </section>
      <footer>
        <span>REDOXRADAR / SYNTHETIC DATA PROTOTYPE</span>
        <span>No real health claims. No diagnosis. Just pattern change.</span>
      </footer>
    </main>
  );
}

function DomainCard({
  title,
  score,
  values,
  persistence,
}: {
  title: string;
  score: number;
  values: number[];
  persistence: number;
}) {
  return (
    <article className="domain-card">
      <div className="card-top">
        <span>{title}</span>
        <Arrow />
      </div>
      <div className="score-line">
        <strong>{score}</strong>
        <span>/ 100</span>
      </div>
      <Sparkline values={values} />
      <div className="persistence">
        <span>Persistence / last 14 days</span>
        <b>{persistence}%</b>
      </div>
    </article>
  );
}


function AssessmentFlow({ onComplete, onCancel }: { onComplete: () => void, onCancel: () => void }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Psych
  const [psychAnswers, setPsychAnswers] = useState<number[]>([]);
  // Step 2: Work-life
  const [workAnswers, setWorkAnswers] = useState<number[]>([]);
  // Step 3: Sleep
  const [sleepDuration, setSleepDuration] = useState(7);
  const [sleepQuality, setSleepQuality] = useState<number | null>(null);
  const [daytimeImpact, setDaytimeImpact] = useState<number | null>(null);
  // Step 4: Physio
  const [hr, setHr] = useState("");
  const [sys, setSys] = useState("");
  const [dia, setDia] = useState("");
  const [spo2, setSpo2] = useState("");

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        onComplete();
      }, 700);
    }
  };

  const handleCancel = () => {
    if (confirm("Discard this assessment?")) {
      onCancel();
    }
  };

  const isStep1Valid = psychAnswers.length === 4 && psychAnswers.every(a => a !== undefined);
  const isStep2Valid = workAnswers.length === 4 && workAnswers.every(a => a !== undefined);
  const isStep3Valid = sleepQuality !== null && daytimeImpact !== null;
  const isStep4Valid = hr !== "" && sys !== "" && dia !== "";

  const canProceed = 
    (step === 1 && isStep1Valid) ||
    (step === 2 && isStep2Valid) ||
    (step === 3 && isStep3Valid) ||
    (step === 4 && isStep4Valid);

  const psychItems = [
    "Feeling nervous, anxious, or on edge",
    "Not being able to stop or control worrying",
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless"
  ];
  const psychOptions = ["Not at all", "Several days", "More than half the days", "Nearly every day"];

  const workItems = [
    "I am able to switch off from work during my personal time",
    "My work schedule leaves me enough time for rest and relationships",
    "I frequently feel that work demands interfere with my personal life",
    "I feel in control of how I balance work and personal responsibilities"
  ];
  const workOptions = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];

  return (
    <div className="assessment-overlay">
      <div className={`assessment-card ${isSubmitting ? 'submitting-pulse' : ''}`}>
        <div className="assessment-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
            <span className="eyebrow">DAILY LOG</span>
            <span className="eyebrow">STEP {step} OF 4</span>
          </div>
          <div className="assessment-progress">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={`progress-block ${s <= step ? 'completed' : ''}`} />
            ))}
          </div>
        </div>
        
        <div className="assessment-body">
          {step === 1 && (
            <>
              <h2 style={{ fontSize: '24px', letterSpacing: '-0.05em', margin: '0' }}>Psychological Load</h2>
              {psychItems.map((item, i) => (
                <div key={i} className="q-block">
                  <span className="q-title">{item}</span>
                  <div className="q-options">
                    {psychOptions.map((opt, v) => (
                      <button 
                        key={v} 
                        className={`q-btn ${psychAnswers[i] === v ? 'selected' : ''}`}
                        onClick={() => {
                          const newA = [...psychAnswers];
                          newA[i] = v;
                          setPsychAnswers(newA);
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}

          {step === 2 && (
            <>
              <h2 style={{ fontSize: '24px', letterSpacing: '-0.05em', margin: '0' }}>Work-Life Balance</h2>
              {workItems.map((item, i) => (
                <div key={i} className="q-block">
                  <span className="q-title">{item}</span>
                  <div className="q-options">
                    {workOptions.map((opt, v) => (
                      <button 
                        key={v} 
                        className={`q-btn ${workAnswers[i] === v + 1 ? 'selected' : ''}`}
                        onClick={() => {
                          const newA = [...workAnswers];
                          newA[i] = v + 1;
                          setWorkAnswers(newA);
                        }}
                      >
                        {v + 1}<br/>{opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}

          {step === 3 && (
            <>
              <h2 style={{ fontSize: '24px', letterSpacing: '-0.05em', margin: '0' }}>Recovery & Sleep</h2>
              <div className="q-block">
                <span className="q-title">Sleep duration</span>
                <div className="slider-container">
                  <span className="slider-value">{sleepDuration} hrs</span>
                  <input type="range" min="3" max="10" step="0.5" value={sleepDuration} onChange={e => setSleepDuration(Number(e.target.value))} className="slider-input" />
                </div>
              </div>
              <div className="q-block">
                <span className="q-title">Sleep quality</span>
                <div className="q-options">
                  {["Very poor", "Poor", "Fair", "Good", "Very good"].map((opt, i) => (
                    <button key={i} className={`q-btn ${sleepQuality === i ? 'selected' : ''}`} onClick={() => setSleepQuality(i)}>{opt}</button>
                  ))}
                </div>
              </div>
              <div className="q-block">
                <span className="q-title">Daytime impact</span>
                <div className="q-options">
                  {["Not at all", "A little", "Somewhat", "A lot"].map((opt, i) => (
                    <button key={i} className={`q-btn ${daytimeImpact === i ? 'selected' : ''}`} onClick={() => setDaytimeImpact(i)}>{opt}</button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h2 style={{ fontSize: '24px', letterSpacing: '-0.05em', margin: '0' }}>Physiological Signals</h2>
              
              <div className="q-block">
                <span className="q-title">Resting Heart Rate</span>
                <div className="physio-row">
                  <input type="number" min="40" max="160" placeholder="bpm" value={hr} onChange={e => setHr(e.target.value)} className="physio-input" />
                  <select className="physio-input"><option>Smartwatch</option><option>Manual</option></select>
                  <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="physio-input" />
                </div>
              </div>

              <div className="q-block">
                <span className="q-title">Blood Pressure (Systolic / Diastolic)</span>
                <div className="physio-row">
                  <input type="number" min="70" max="220" placeholder="Sys" value={sys} onChange={e => setSys(e.target.value)} className="physio-input" />
                  <span>/</span>
                  <input type="number" min="40" max="140" placeholder="Dia" value={dia} onChange={e => setDia(e.target.value)} className="physio-input" />
                  <select className="physio-input"><option>Cuff</option><option>Smartwatch</option></select>
                  <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="physio-input" />
                </div>
              </div>

              <div className="q-block">
                <span className="q-title">SpO2 (Optional)</span>
                <div className="physio-row">
                  <input type="number" min="70" max="100" placeholder="%" value={spo2} onChange={e => setSpo2(e.target.value)} className="physio-input" />
                  <select className="physio-input"><option>Smartwatch</option><option>Pulse Ox</option></select>
                  <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="physio-input" />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="assessment-footer">
          {step > 1 ? (
            <button className="button button-light" onClick={() => setStep(step - 1)}>Back</button>
          ) : (
            <button className="button button-light" onClick={handleCancel}>Cancel</button>
          )}
          <button className="button button-dark" onClick={handleNext} disabled={!canProceed}>
            {step === 4 ? "Submit Assessment" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}


function ParticipantPortal({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState(0);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const p = participants[selected];
  const [days, setDays] = useState(30);
  const trend = useMemo(
    () => Array.from({ length: 14 }, (_, i) => 38 + i * 2 + Math.sin(i) * 8),
    [],
  );
  return (
    <main className="app-shell">
      {isAssessmentOpen && <AssessmentFlow onComplete={() => { setIsAssessmentOpen(false); setDays(days + 1); }} onCancel={() => setIsAssessmentOpen(false)} />}
      
      <header className="app-header">
        <button className="brand plain" onClick={onBack}>
          <span className="brand-mark">RR</span> REDOXRADAR
        </button>
        <div className="profile-select">
          <span className="eyebrow">PARTICIPANT VIEW</span>
          <select
            value={selected}
            onChange={(e) => setSelected(Number(e.target.value))}
          >
            {participants.slice(0, 6).map((x, i) => (
              <option key={x.id} value={i}>
                {x.id} / synthetic profile
              </option>
            ))}
          </select>
        </div>
        <button className="button button-dark" style={{marginLeft: "auto", padding: "10px", fontSize: "10px"}} onClick={() => setIsAssessmentOpen(true)}>Take Assessment <Arrow /></button>
        <button className="text-button" onClick={onBack}>
          Exit view
        </button>
      </header>
      <div className="app-content">
        <div className="page-heading">
          <div>
            <span className="eyebrow">VULNERABILITY PROFILE / {p.id}</span>
            <h1>
              What changed
              <br />
              <em>this month?</em>
            </h1>
          </div>
          <div className="heading-meta">
            <Status value={p.status} />
            <span className="confidence">Confidence: {p.confidence}</span>
          </div>
        </div>
        <div className="baseline">
          <div>
            <strong>
              {days < 7 ? "Building your baseline" : "Baseline established"}
            </strong>
            <span>
              {days < 7
                ? `${days} of 7 days logged to establish your personal baseline.`
                : "Your personal reference point is ready for comparison."}
            </span>
          </div>
          <div className="demo-control">
            <label>
              Demo controls / simulate days passed <b>{days}</b>
            </label>
            <input
              type="range"
              min="0"
              max="30"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="change-grid">
          <article className="change-card">
            <div className="card-top">
              <span>WHAT CHANGED</span>
              <span className="eyebrow">LAST 14 DAYS</span>
            </div>
            {[
              ["Recovery", "declining for 9 of the last 14 days"],
              ["Psychological", "elevated for 8 of the last 14 days"],
              ["Physiological", "stable around personal baseline"],
            ].map(([a, b], i) => (
              <div className="change-row" key={a}>
                <Arrow down={i === 2} />
                <div>
                  <strong>{a}</strong>
                  <p>{b}</p>
                </div>
              </div>
            ))}
          </article>
          <div className="domain-grid">
            <DomainCard
              title="Psychological Load"
              score={p.scores[0]}
              values={[32, 38, 40, 49, 46, 58]}
              persistence={64}
            />
            <DomainCard
              title="Recovery / Sleep"
              score={p.scores[1]}
              values={[58, 54, 52, 45, 42, 35]}
              persistence={71}
            />
            <DomainCard
              title="Physiological Trend"
              score={p.scores[2]}
              values={[30, 32, 36, 41, 45, 49]}
              persistence={57}
            />
          </div>
        </div>
        <div className="content-grid">
          <section className="panel trend-panel">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">TRAJECTORY / 30 DAYS</span>
                <h2>Vulnerability score</h2>
              </div>
              <span className="legend">
                <i /> daily score <i className="legend-line" /> baseline
              </span>
            </div>
            <svg
              className="trend-chart"
              viewBox="0 0 700 230"
              preserveAspectRatio="none"
            >
              <line
                x1="0"
                x2="700"
                y1="124"
                y2="124"
                stroke="#8A8577"
                strokeDasharray="5 6"
                strokeWidth="2"
              />
              <polyline
                points={trend
                  .map((v, i) => `${i * 52},${210 - v * 2.0}`)
                  .join(" ")}
                fill="none"
                stroke={palette.clay}
                strokeWidth="5"
              />
            </svg>
            <div className="chart-axis">
              <span>01 MAR</span>
              <span>15 MAR</span>
              <span>30 MAR</span>
            </div>
          </section>
          <aside className="context-card">
            <span className="eyebrow">CLINICAL CONTEXT</span>
            <span className="context-note">CONTEXT ONLY — NOT SCORED</span>
            <h2>Recent readings</h2>
            <div className="reading">
              <span>Blood pressure</span>
              <strong>
                132 / 84 <small>mmHg</small>
              </strong>
              <small>28 MAR 2026</small>
            </div>
            <div className="reading">
              <span>HbA1c</span>
              <strong>
                5.8 <small>%</small>
              </strong>
              <small>12 MAR 2026</small>
            </div>
            <div className="reading">
              <span>Resting heart rate</span>
              <strong>
                76 <small>bpm</small>
              </strong>
              <small>30 MAR 2026</small>
            </div>
          </aside>
        </div>
        <section className="action-panel">
          <div>
            <span className="eyebrow">SUGGESTED NEXT STEP</span>
            <h2>
              Try keeping a consistent sleep and wake time for the next 7 days.
            </h2>
            <p>
              RedoxRadar suggests actions to support your next check-in. It does
              not diagnose or treat.
            </p>
          </div>
          <div className="review-date">
            <span>REASSESS ON</span>
            <strong>06 APR 2026</strong>
          </div>
        </section>
      </div>
    </main>
  );
}

function ResearcherPortal({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState("Overview");
  const [filter, setFilter] = useState("All");
  const filtered = participants.filter(
    (p) => filter === "All" || p.group === filter,
  );
  return (
    <main className="research-shell">
      <aside className="research-nav">
        <button className="brand plain" onClick={onBack}>
          <span className="brand-mark">RR</span> REDOXRADAR
        </button>
        <div className="nav-label">STUDY / RR-001</div>
        {[
          "Overview",
          "Participants",
          "Case vs Control",
          "Diagnostics",
          "Safety flags",
          "Audit log",
        ].map((x) => (
          <button
            key={x}
            className={`nav-item ${tab === x ? "active" : ""}`}
            onClick={() => setTab(x)}
          >
            {x}
            <span>
              {x === "Participants" ? "12" : x === "Safety flags" ? "02" : ""}
            </span>
          </button>
        ))}
        <div className="nav-bottom">
          <span className="eyebrow">SYNTHETIC DATA</span>
          <button className="text-button" onClick={onBack}>
            Exit study <Arrow />
          </button>
        </div>
      </aside>
      <section className="research-main">
        <header className="research-header">
          <div>
            <span className="eyebrow">
              STUDY DASHBOARD / {tab.toUpperCase()}
            </span>
            <h1>
              {tab === "Overview" ? (
                <>
                  A study in
                  <br />
                  <em>movement.</em>
                </>
              ) : (
                tab
              )}
            </h1>
          </div>
          <div className="researcher-id">
            RESEARCHER
            <br />
            <strong>SME-004</strong>
          </div>
        </header>
        {tab === "Overview" || tab === "Participants" ? (
          <>
            <div className="stats">
              {[
                ["12", "Total enrolled"],
                ["91%", "Data completeness"],
                ["06 / 06", "Case / control"],
                ["00", "Building baseline"],
              ].map(([n, l]) => (
                <div className="stat" key={l}>
                  <strong>{n}</strong>
                  <span>{l}</span>
                </div>
              ))}
            </div>
            <section className="table-panel">
              <div className="panel-heading">
                <div>
                  <span className="eyebrow">PARTICIPANT TABLE</span>
                  <h2>All enrolled profiles</h2>
                </div>
                <div className="filters">
                  {["All", "Case", "Control"].map((x) => (
                    <button
                      key={x}
                      className={filter === x ? "filter-active" : ""}
                      onClick={() => setFilter(x)}
                    >
                      {x}
                    </button>
                  ))}
                </div>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      {[
                        "ID",
                        "AGE",
                        "CITY",
                        "GROUP",
                        "PSYCH",
                        "RECOVERY",
                        "PHYSIO",
                        "STATUS",
                        "CONF.",
                        "COMP.",
                      ].map((x) => (
                        <th key={x}>{x}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <strong>{p.id}</strong>
                        </td>
                        <td>{p.age}</td>
                        <td>{p.city}</td>
                        <td>
                          <span
                            className={`group group-${p.group.toLowerCase()}`}
                          >
                            {p.group}
                          </span>
                        </td>
                        {p.scores.map((s) => (
                          <td key={s}>{s}</td>
                        ))}
                        <td>
                          <Status value={p.status} />
                        </td>
                        <td>{p.confidence}</td>
                        <td>{p.completeness}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        ) : (
          <section className="research-placeholder">
            <div className="comparison-bars">
              <div className="bar-chart-title">
                <span className="eyebrow">DOMAIN SCORE MEANS</span>
                <h2>Case vs control</h2>
              </div>
              {[
                ["Psychological", 71, 32],
                ["Recovery", 64, 28],
                ["Physiological", 59, 24],
              ].map(([name, a, b]) => (
                <div className="compare-row" key={name}>
                  <span>{name}</span>
                  <div className="compare-track">
                    <i style={{ width: `${a}%` }} />
                    <b style={{ width: `${b}%` }} />
                  </div>
                  <small>
                    {a} / {b}
                  </small>
                </div>
              ))}
              <div className="bar-legend">
                <span>
                  <i /> Case
                </span>
                <span>
                  <i /> Control
                </span>
              </div>
            </div>
            <div className="diagnostic-box">
              <span className="eyebrow">MODEL NOTE</span>
              <h2>Pattern separation is visible, not absolute.</h2>
              <p>
                Case profiles show higher domain scores on average, while
                overlap remains. This is a statistical tendency—not a rule.
              </p>
              <div className="matrix">
                <span>1.00</span>
                <span>.62</span>
                <span>.38</span>
                <span>.62</span>
                <span>1.00</span>
                <span>.71</span>
                <span>.38</span>
                <span>.71</span>
                <span>1.00</span>
              </div>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

export default function Page() {
  const [role, setRole] = useState<"landing" | "participant" | "researcher">(
    "landing",
  );
  if (role === "participant")
    return <ParticipantPortal onBack={() => setRole("landing")} />;
  if (role === "researcher")
    return <ResearcherPortal onBack={() => setRole("landing")} />;
  return <Landing onEnter={setRole} />;
}




