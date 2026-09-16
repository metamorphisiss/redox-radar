'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Arrow, Status, Sparkline } from "../../components/SharedComponents";
import { participants, palette } from "../../lib/shared";

export default function ResearcherPortal() {
  const router = useRouter();
  const [tab, setTab] = useState("Overview");
  const [filter, setFilter] = useState("All");
  const filtered = participants.filter(
    (p) => filter === "All" || p.group === filter,
  );

  const [flags, setFlags] = useState([
    { id: 1, participant: "P-4824", reason: "ELEVATED BP / SYSTOLIC 182", metric: [140, 160, 182], reviewed: false },
    { id: 2, participant: "P-4830", reason: "REPEATED POOR RECOVERY", metric: [28, 22, 19], reviewed: false }
  ]);
  const [audit, setAudit] = useState([
    { id: 1, time: new Date().toISOString().replace('T', ' ').substring(0, 19), user: "SME-004", action: "LOGGED IN TO STUDY DASHBOARD" }
  ]);

  const handleReviewFlag = (flagId: number, pId: string) => {
    setFlags(flags.map(f => f.id === flagId ? { ...f, reviewed: true } : f));
    setAudit([{ 
      id: Date.now(), 
      time: new Date().toISOString().replace('T', ' ').substring(0, 19), 
      user: "SME-004", 
      action: `MARKED SAFETY FLAG REVIEWED FOR ${pId}` 
    }, ...audit]);
  };

  return (
    <main className="research-shell">
      <aside className="research-nav">
        <button className="brand plain" onClick={() => router.push("/")}>
          <span className="brand-mark">RR</span> REDOXRADAR
        </button>
        <div className="nav-label">OFFICE / RR-001</div>
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
              {x === "Participants" ? "12" : x === "Safety flags" ? flags.filter(f => !f.reviewed).length.toString().padStart(2, '0') : ""}
            </span>
          </button>
        ))}
        <div className="nav-bottom">
          <span className="eyebrow">SYNTHETIC DATA</span>
          <button className="text-button" onClick={() => router.push("/")}>
            Exit study <Arrow />
          </button>
        </div>
      </aside>
      <section className="research-main">
        <header className="research-header">
          <div>
            <span className="eyebrow">OFFICE DASHBOARD / {tab.toUpperCase()}</span>
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
        
        {(tab === "Overview" || tab === "Participants") && (
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
                        {p.scores.map((s, idx) => (
                          <td key={idx}>{s}</td>
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
        )}

        {tab === "Case vs Control" && (
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
          </section>
        )}

        {tab === "Diagnostics" && (
          <div className="diag-grid">
            <div>
              <div className="bar-chart-title" style={{ marginBottom: "20px" }}>
                <span className="eyebrow">DATA QUALITY</span>
                <h2>Missingness Summary</h2>
              </div>
              {[
                ["SpO₂ (Optional)", 42],
                ["Blood Pressure", 18],
                ["Resting HR", 5],
                ["Psychological", 2],
              ].map(([name, val]) => (
                <div key={name} style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 900 }}>
                    <span>{name}</span>
                    <span>{val}% MISSING</span>
                  </div>
                  <div className="missing-bar">
                    <div className="missing-fill" style={{ width: `${val}%` }} />
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div className="version-panel">
                <h3>Version Info</h3>
                <div className="version-row"><span>QUESTIONNAIRE</span><span>v1.0</span></div>
                <div className="version-row"><span>MODEL</span><span>v0.3</span></div>
                <div className="version-row"><span>RULESET</span><span>v1.1</span></div>
                <div className="version-row" style={{ border: 0 }}><span>LAST UPDATED</span><span>16-SEP-2026</span></div>
              </div>
              
              <div className="diagnostic-box" style={{ padding: '20px' }}>
                <span className="eyebrow">CORRELATION MATRIX</span>
                <div className="matrix" style={{ marginTop: '15px' }}>
                  <span>1.00</span><span style={{background: '#c4bdeb'}}>0.62</span><span style={{background: '#e0dcf4'}}>0.38</span>
                  <span style={{background: '#c4bdeb'}}>0.62</span><span>1.00</span><span style={{background: '#b0a6e4'}}>0.71</span>
                  <span style={{background: '#e0dcf4'}}>0.38</span><span style={{background: '#b0a6e4'}}>0.71</span><span>1.00</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "Safety flags" && (
          <div className="flag-feed">
            {flags.map(f => (
              <div key={f.id} className={`flag-card ${f.reviewed ? 'reviewed' : ''}`}>
                <div className="flag-info">
                  <strong>{f.participant} / {f.reason}</strong>
                  <span>{f.reviewed ? 'VERIFIED BY SME-004' : 'NEEDS VERIFICATION'}</span>
                </div>
                <div className="flag-action">
                  {!f.reviewed && (
                    <>
                      <Sparkline values={f.metric} color={palette.clay} />
                      <button className="button button-dark" onClick={() => handleReviewFlag(f.id, f.participant)}>MARK REVIEWED ↑</button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {flags.filter(f => !f.reviewed).length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', border: 'var(--line) dashed var(--ink)' }}>
                <strong>No active safety flags.</strong>
              </div>
            )}
          </div>
        )}

        {tab === "Audit log" && (
          <div className="audit-ledger">
            <div className="audit-header">SYSTEM AUDIT LEDGER // RR-001</div>
            {audit.map(a => (
              <div key={a.id} className="audit-row">
                <span>[{a.time}]</span>
                <span>{a.user}</span>
                <span style={{ color: a.action.includes('SAFETY FLAG') ? 'var(--clay)' : 'inherit' }}>{a.action}</span>
              </div>
            ))}
          </div>
        )}

      </section>
    </main>
  );
}
