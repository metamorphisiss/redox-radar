'use client';
import { useState } from "react";

export function OnboardingOverlay({ onComplete, onCancel }: { onComplete: () => void, onCancel: () => void }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Basics
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [workType, setWorkType] = useState("");
  const [overtime, setOvertime] = useState("");

  // Step 2: Medical Baseline
  const [hasSmartwatch, setHasSmartwatch] = useState<string | null>(null);
  const [conditions, setConditions] = useState<string[]>([]);
  const [hasGlucometer, setHasGlucometer] = useState<string | null>(null);
  const [hasBpCuff, setHasBpCuff] = useState<string | null>(null);
  const [prescriptions, setPrescriptions] = useState("");

  // Step 3: Labs
  const [hba1c, setHba1c] = useState("");
  const [cholesterol, setCholesterol] = useState("");
  const [triglycerides, setTriglycerides] = useState("");
  const [crp, setCrp] = useState("");

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        onComplete();
      }, 700);
    }
  };

  const handleCancel = () => {
    if (confirm("Cancel onboarding?")) {
      onCancel();
    }
  };

  const isStep1Valid = name !== "" && age !== "" && gender !== "" && height !== "" && weight !== "" && workType !== "" && overtime !== "";
  const isStep2Valid = hasSmartwatch !== null; // Just requiring smartwatch for now, rest are optional or have defaults
  const isStep3Valid = true; // Labs are optional

  const canProceed = 
    (step === 1 && isStep1Valid) ||
    (step === 2 && isStep2Valid) ||
    (step === 3 && isStep3Valid);

  const toggleCondition = (c: string) => {
    if (c === "None of the above") {
      setConditions(["None of the above"]);
      return;
    }
    let newConds = conditions.filter(x => x !== "None of the above");
    if (newConds.includes(c)) {
      newConds = newConds.filter(x => x !== c);
    } else {
      newConds.push(c);
    }
    setConditions(newConds);
  };

  const hasDiabetes = conditions.some(c => c.includes("Diabetes") || c.includes("Pre-diabetes"));
  const hasHypertension = conditions.includes("Hypertension (High Blood Pressure)");

  return (
    <div className="assessment-overlay">
      <div className={`assessment-card ${isSubmitting ? 'submitting-pulse' : ''}`} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="assessment-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
            <span className="eyebrow">ONBOARDING SIMULATION</span>
            <span className="eyebrow">STEP {step} OF 3</span>
          </div>
          <div className="assessment-progress">
            {[1, 2, 3].map(s => (
              <div key={s} className={`progress-block ${s <= step ? 'completed' : ''}`} style={{ width: '32%' }} />
            ))}
          </div>
        </div>
        
        <div className="assessment-body">
          {step === 1 && (
            <>
              <h2 style={{ fontSize: '24px', letterSpacing: '-0.05em', margin: '0' }}>The Basics</h2>
              
              <div className="q-block">
                <span className="q-title">Name</span>
                <input type="text" className="physio-input" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '12px' }} />
              </div>
              
              <div className="q-block">
                <span className="q-title">Age</span>
                <input type="number" className="physio-input" placeholder="Years" value={age} onChange={e => setAge(e.target.value)} style={{ width: '100%', padding: '12px' }} />
              </div>

              <div className="q-block">
                <span className="q-title">Gender</span>
                <div className="q-options">
                  {["Male", "Female", "Prefer not to say"].map((opt) => (
                    <button key={opt} className={`q-btn ${gender === opt ? 'selected' : ''}`} onClick={() => setGender(opt)}>{opt}</button>
                  ))}
                </div>
              </div>

              <div className="q-block">
                <span className="q-title">Height & Weight</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, marginBottom: '4px', textTransform: 'uppercase' }}>Height (cm)</label>
                    <input type="number" className="physio-input" placeholder="e.g. 175" value={height} onChange={e => setHeight(e.target.value)} style={{ width: '100%', padding: '12px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, marginBottom: '4px', textTransform: 'uppercase' }}>Weight (kg)</label>
                    <input type="number" step="0.1" className="physio-input" placeholder="e.g. 70" value={weight} onChange={e => setWeight(e.target.value)} style={{ width: '100%', padding: '12px' }} />
                  </div>
                </div>
              </div>

              <div className="q-block">
                <span className="q-title">What type of work do you primarily do?</span>
                <div className="q-options">
                  {["Desk job", "Manual labor", "Mixed / field-based"].map((opt) => (
                    <button key={opt} className={`q-btn ${workType === opt ? 'selected' : ''}`} onClick={() => setWorkType(opt)}>{opt}</button>
                  ))}
                </div>
              </div>

              <div className="q-block">
                <span className="q-title">Time spent working beyond regular hours (weekly)</span>
                <div className="q-options">
                  {["None", "1-5 hours", "5-10 hours", "10+ hours"].map((opt) => (
                    <button key={opt} className={`q-btn ${overtime === opt ? 'selected' : ''}`} onClick={() => setOvertime(opt)}>{opt}</button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 style={{ fontSize: '24px', letterSpacing: '-0.05em', margin: '0' }}>Medical Baseline</h2>
              
              <div className="q-block">
                <span className="q-title">Do you own a smartwatch?</span>
                <div className="q-options">
                  {["Yes", "No"].map((opt) => (
                    <button key={opt} className={`q-btn ${hasSmartwatch === opt ? 'selected' : ''}`} onClick={() => setHasSmartwatch(opt)}>{opt}</button>
                  ))}
                </div>
              </div>

              <div className="q-block">
                <span className="q-title">Do you currently have any of the following conditions? (Select all that apply)</span>
                <div className="q-options" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    "Type 1 Diabetes", 
                    "Type 2 Diabetes", 
                    "Pre-diabetes", 
                    "Hypertension (High Blood Pressure)", 
                    "High Cholesterol (Dyslipidemia)", 
                    "Cardiovascular/Heart Disease", 
                    "Thyroid Disorder", 
                    "None of the above"
                  ].map((opt) => (
                    <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
                      <input type="checkbox" checked={conditions.includes(opt)} onChange={() => toggleCondition(opt)} />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              {hasDiabetes && (
                <div className="q-block" style={{ padding: '15px', background: '#F8FAFC', border: '2px solid var(--ink)', borderRadius: '0px' }}>
                  <span className="q-title">Do you have a home blood glucose monitor (glucometer)?</span>
                  <div className="q-options">
                    {["Yes", "No"].map((opt) => (
                      <button key={opt} className={`q-btn ${hasGlucometer === opt ? 'selected' : ''}`} onClick={() => setHasGlucometer(opt)}>{opt}</button>
                    ))}
                  </div>
                </div>
              )}

              {hasHypertension && (
                <div className="q-block" style={{ padding: '15px', background: '#F8FAFC', border: '2px solid var(--ink)', borderRadius: '0px' }}>
                  <span className="q-title">Do you have a home blood pressure monitor (cuff)?</span>
                  <div className="q-options">
                    {["Yes", "No"].map((opt) => (
                      <button key={opt} className={`q-btn ${hasBpCuff === opt ? 'selected' : ''}`} onClick={() => setHasBpCuff(opt)}>{opt}</button>
                    ))}
                  </div>
                </div>
              )}

              <div className="q-block">
                <span className="q-title">Any current prescriptions?</span>
                <textarea className="physio-input" placeholder="List medications or type 'None'" value={prescriptions} onChange={e => setPrescriptions(e.target.value)} style={{ width: '100%', padding: '12px', minHeight: '80px', resize: 'vertical' }} />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 style={{ fontSize: '24px', letterSpacing: '-0.05em', margin: '0' }}>Laboratory Data</h2>
              <p style={{ fontSize: '14px', color: '#666', marginTop: '4px', marginBottom: '20px' }}>Leave blank if unknown or unavailable.</p>
              
              <div className="q-block">
                <span className="q-title">HbA1c</span>
                <input type="number" step="0.1" className="physio-input" placeholder="%" value={hba1c} onChange={e => setHba1c(e.target.value)} style={{ width: '100%', padding: '12px' }} />
              </div>
              
              <div className="q-block">
                <span className="q-title">Total Cholesterol</span>
                <input type="number" className="physio-input" placeholder="mg/dL" value={cholesterol} onChange={e => setCholesterol(e.target.value)} style={{ width: '100%', padding: '12px' }} />
              </div>

              <div className="q-block">
                <span className="q-title">Triglycerides</span>
                <input type="number" className="physio-input" placeholder="mg/dL" value={triglycerides} onChange={e => setTriglycerides(e.target.value)} style={{ width: '100%', padding: '12px' }} />
              </div>

              <div className="q-block">
                <span className="q-title">CRP (C-reactive protein)</span>
                <input type="number" step="0.1" className="physio-input" placeholder="mg/L" value={crp} onChange={e => setCrp(e.target.value)} style={{ width: '100%', padding: '12px' }} />
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
            {step === 3 ? "Submit & Go to Dashboard" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

