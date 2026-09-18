'use client';
import { useState } from "react";
import { palette } from "../lib/shared";

export function Arrow({ down = false }: { down?: boolean }) {
  return (
    <span aria-hidden="true" className="arrow">
      {down ? "↓" : "↑"}
    </span>
  );
}

export function Status({ value }: { value: string }) {
  return (
    <span className={`status status-${value.toLowerCase()}`}>{value}</span>
  );
}

export function Sparkline({
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

export function DomainCard({
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

export function AssessmentFlow({ onComplete, onCancel }: { onComplete: () => void, onCancel: () => void }) {
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
  const [energy, setEnergy] = useState(5);
  // Step 4: Physio
  const [weight, setWeight] = useState("");
  const [hr, setHr] = useState("");
  const [sys, setSys] = useState("");
  const [dia, setDia] = useState("");
  const [spo2, setSpo2] = useState("");
  const [steps, setSteps] = useState("");
  const [meds, setMeds] = useState<string | null>(null);
  const [diet, setDiet] = useState<string | null>(null);

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
  const isStep4Valid = meds !== null && diet !== null;

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
    "My job demands regularly interfere with my personal, family, or home life",
    "Personal or family responsibilities distract me or take away energy from my work",
    "The skills, energy, or positive mood I gain from work help me be more effective in my personal life",
    "Overall, I am satisfied with the balance between my work time and personal time"
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
              <div className="q-block">
                <span className="q-title">Subjective Energy Level</span>
                <div className="slider-container">
                  <span className="slider-value">{energy}/10</span>
                  <input type="range" min="1" max="10" step="1" value={energy} onChange={e => setEnergy(Number(e.target.value))} className="slider-input" />
                </div>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h2 style={{ fontSize: '24px', letterSpacing: '-0.05em', margin: '0' }}>Physiological Signals</h2>
              
              <div className="q-block">
                <span className="q-title">Today&apos;s Weight (Optional)</span>
                <div className="physio-row">
                  <input type="number" step="0.1" min="20" max="300" placeholder="Weight in kg (e.g. 70.5)" value={weight} onChange={e => setWeight(e.target.value)} className="physio-input" style={{ width: '100%' }} />
                </div>
              </div>

              <div className="q-block">
                <span className="q-title">Average Daily Step Count (Optional)</span>
                <div className="physio-row">
                  <input type="number" min="0" placeholder="Steps" value={steps} onChange={e => setSteps(e.target.value)} className="physio-input" style={{ width: '100%' }} />
                </div>
              </div>

              <div className="q-block">
                <span className="q-title">Did you take your prescribed medications today?</span>
                <div className="q-options">
                  {["Yes", "No", "N/A"].map((opt) => (
                    <button key={opt} className={`q-btn ${meds === opt ? 'selected' : ''}`} onClick={() => setMeds(opt)}>{opt}</button>
                  ))}
                </div>
              </div>

              <div className="q-block">
                <span className="q-title">How would you rate your diet today?</span>
                <div className="q-options">
                  {["Poor", "Fair", "Good", "Excellent"].map((opt) => (
                    <button key={opt} className={`q-btn ${diet === opt ? 'selected' : ''}`} onClick={() => setDiet(opt)}>{opt}</button>
                  ))}
                </div>
              </div>
              
              <div className="q-block">
                <span className="q-title">Resting Heart Rate (Optional)</span>
                <div className="physio-row">
                  <input type="number" min="40" max="160" placeholder="bpm" value={hr} onChange={e => setHr(e.target.value)} className="physio-input" />
                  <select className="physio-input"><option>Smartwatch</option><option>Manual</option></select>
                  <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="physio-input" />
                </div>
              </div>

              <div className="q-block">
                <span className="q-title">Blood Pressure (Systolic / Diastolic) (Optional)</span>
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
