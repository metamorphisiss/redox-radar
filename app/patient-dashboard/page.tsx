'use client';
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Arrow, Status, Sparkline, AssessmentFlow, DomainCard } from "../../components/SharedComponents";
import { participants, palette } from "../../lib/shared";

export default function ParticipantPortal() {
  const router = useRouter();
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
        <button className="brand plain" onClick={() => router.push("/")}>
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
        <button className="text-button" onClick={() => router.push("/")}>
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

        <section className="panel" style={{ marginTop: '20px', padding: '24px' }}>
          <div className="panel-heading" style={{ marginBottom: '16px' }}>
            <div>
              <span className="eyebrow">DOCUMENTS</span>
              <h2>Lab Reports & Documents</h2>
            </div>
          </div>
          
          <div 
            style={{ 
              border: '2px dashed #8A8577', 
              borderRadius: '8px', 
              padding: '40px 20px', 
              textAlign: 'center',
              cursor: 'pointer',
              marginBottom: '20px',
              backgroundColor: 'rgba(242, 240, 232, 0.3)'
            }}
          >
            <p style={{ margin: 0, fontWeight: 500 }}>Drag & drop your lab results (PDF, JPG) or click to browse.</p>
            <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#666' }}>Secure upload for manual review by researchers.</p>
          </div>

          <div>
            <span className="eyebrow" style={{ display: 'block', marginBottom: '12px' }}>RECENTLY UPLOADED</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#fff', border: '1px solid #ddd', borderRadius: '6px' }}>
                <span style={{ fontSize: '20px' }}>📄</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>Lipid_Panel_Aug.pdf</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Uploaded Aug 12, 2026 • 2.4 MB</div>
                </div>
                <Status value="Processed" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#fff', border: '1px solid #ddd', borderRadius: '6px' }}>
                <span style={{ fontSize: '20px' }}>📄</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>HbA1c_Results.jpg</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Uploaded Mar 10, 2026 • 1.1 MB</div>
                </div>
                <Status value="Processed" />
              </div>
            </div>
          </div>
        </section>
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
