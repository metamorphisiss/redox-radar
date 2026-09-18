'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Arrow, Status, Sparkline } from "../../components/SharedComponents";
import { participants, palette } from "../../lib/shared";

const CORRELATION_DATA = {
  "REC-PHY": {
    r: 0.71,
    label: "Recovery / Sleep  ↔  Physiological Signals",
    strength: "Very Strong Positive Coupling",
    explanation: "For every 10-point drop in recovery scores, resting heart rate increased by an average of 4.2 bpm across the cohort. Poor sleep is the primary driver of physiological stress signals.",
    points: [[10,12],[18,20],[25,28],[30,35],[40,42],[45,50],[52,55],[60,62],[65,70],[70,73],[75,78],[80,82],[85,88],[90,91],[95,96]],
  },
  "PSY-REC": {
    r: 0.62,
    label: "Psychological Load  ↔  Recovery / Sleep",
    strength: "Strong Positive Coupling",
    explanation: "Elevated psychological load scores predicted poor recovery quality in the following 2 nights, with sleep duration shortening by 37 minutes on average. Mental stress is consistently followed by disrupted sleep.",
    points: [[12,8],[20,18],[28,22],[35,30],[42,38],[50,44],[55,52],[62,58],[68,65],[74,70],[80,76],[85,82],[90,87],[95,92],[98,95]],
  },
  "PSY-PHY": {
    r: 0.38,
    label: "Psychological Load  ↔  Physiological Signals",
    strength: "Moderate Lagged Correlation",
    explanation: "Acute mental stress does not immediately spike vitals. Instead, psychological pressure builds over days, disrupting sleep, which then drives physiological degradation within 3–5 days. This lagged indirect effect explains the weaker direct correlation.",
    points: [[10,8],[20,12],[30,18],[40,20],[50,28],[60,30],[65,38],[70,35],[75,42],[80,44],[85,50],[88,48],[90,55],[95,52],[98,60]],
  },
};

const PAGE_SIZE = 10;

export default function ResearcherPortal() {
  const router = useRouter();
  const [tab, setTab] = useState("Overview");
  const [groupFilter, setGroupFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedCell, setSelectedCell] = useState<string | null>(null);

  const [flags, setFlags] = useState([
    { id: 1, participant: "P-4824", reason: "ELEVATED BP / SYSTOLIC 182", metric: [140, 160, 182], reviewed: false },
    { id: 2, participant: "P-4972", reason: "REPEATED POOR RECOVERY", metric: [28, 22, 19], reviewed: false },
    { id: 3, participant: "P-5046", reason: "PSY SCORE ABOVE 90 / 3 DAYS", metric: [78, 85, 92], reviewed: false },
    { id: 4, participant: "P-5120", reason: "CONVERGING ACROSS ALL DOMAINS", metric: [62, 71, 80], reviewed: false },
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

  const filtered = participants.filter(p => {
    const matchGroup = groupFilter === "All" || p.group === groupFilter;
    const matchStatus = statusFilter === "All" || p.status === statusFilter;
    const matchSearch = search === "" || p.id.toLowerCase().includes(search.toLowerCase());
    return matchGroup && matchStatus && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const statusCounts = {
    Action: participants.filter(p => p.status === "Action").length,
    Converging: participants.filter(p => p.status === "Converging").length,
    Watch: participants.filter(p => p.status === "Watch").length,
    Stable: participants.filter(p => p.status === "Stable").length,
  };

  const activeFlags = flags.filter(f => !f.reviewed).length;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  const toggleCell = (key: string) => {
    setSelectedCell(selectedCell === key ? null : key);
  };

  const corrCell = (r: number, key: string) => (
    <span
      key={key}
      onClick={() => toggleCell(key)}
      style={{
        cursor: 'pointer',
        background: selectedCell === key ? 'var(--clay)' : `rgba(99,102,241,${r * 0.5})`,
        color: selectedCell === key ? 'white' : 'inherit',
        transition: '0.15s',
      }}
    >
      {r.toFixed(2)}
    </span>
  );

  return (
    <main className="research-shell">
      <aside className="research-nav">
        <button className="brand plain" onClick={() => router.push("/")}>
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
              {x === "Participants" ? "60" : x === "Safety flags" ? activeFlags.toString().padStart(2, '0') : ""}
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
            <span className="eyebrow">STUDY DASHBOARD / {tab.toUpperCase()}</span>
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
                ["60", "Total enrolled"],
                ["93%", "Data completeness"],
                ["30 / 30", "Case / control"],
                [activeFlags.toString().padStart(2,'0'), "Active safety flags"],
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
                <input
                  type="text"
                  placeholder="Search participant ID..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  style={{ border: '2px solid var(--ink)', padding: '7px 10px', fontSize: '12px', fontWeight: 700, background: 'var(--cream)', outline: 'none' }}
                />
              </div>

              {/* Group filter */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', flexWrap: 'wrap', gap: '8px' }}>
                <div className="filters">
                  {["All", "Case", "Control"].map((x) => (
                    <button
                      key={x}
                      className={groupFilter === x ? "filter-active" : ""}
                      onClick={() => { setGroupFilter(x); setPage(1); }}
                    >
                      {x}
                    </button>
                  ))}
                </div>
                {/* Status filter pills */}
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {[["All", ""], ["Action", statusCounts.Action], ["Converging", statusCounts.Converging], ["Watch", statusCounts.Watch], ["Stable", statusCounts.Stable]].map(([label, count]) => (
                    <button
                      key={label}
                      onClick={() => { setStatusFilter(label as string); setPage(1); }}
                      style={{
                        border: '2px solid var(--ink)',
                        padding: '5px 9px',
                        fontSize: '10px',
                        fontWeight: 900,
                        background: statusFilter === label ? 'var(--ink)' : 'var(--cream)',
                        color: statusFilter === label ? 'var(--cream)' : 'var(--ink)',
                        cursor: 'pointer',
                      }}
                    >
                      {label}{count !== "" ? ` (${count})` : ""}
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
                    {paginated.map((p) => (
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

              {/* Pagination */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '11px', fontWeight: 900 }}>
                <span>Showing {Math.min((page-1)*PAGE_SIZE + 1, filtered.length)}–{Math.min(page*PAGE_SIZE, filtered.length)} of {filtered.length} participants</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} style={{ border: '2px solid var(--ink)', padding: '5px 10px', fontSize: '11px', fontWeight: 900, background: 'var(--cream)', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1 }}>← Prev</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
                    <button key={pg} onClick={() => handlePageChange(pg)} style={{ border: '2px solid var(--ink)', padding: '5px 10px', fontSize: '11px', fontWeight: 900, background: page === pg ? 'var(--ink)' : 'var(--cream)', color: page === pg ? 'var(--cream)' : 'var(--ink)', cursor: 'pointer' }}>{pg}</button>
                  ))}
                  <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} style={{ border: '2px solid var(--ink)', padding: '5px 10px', fontSize: '11px', fontWeight: 900, background: 'var(--cream)', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.4 : 1 }}>Next →</button>
                </div>
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
                <div className="version-row" style={{ border: 0 }}><span>LAST UPDATED</span><span>18-SEP-2026</span></div>
              </div>
              
              <div className="diagnostic-box" style={{ padding: '20px' }}>
                <span className="eyebrow">CORRELATION MATRIX</span>
                <p style={{ fontSize: '12px', marginTop: '6px', color: '#555' }}>Click any cell to inspect the relationship.</p>

                {/* Matrix with labels */}
                <div style={{ display: 'grid', gridTemplateColumns: '55px 1fr 1fr 1fr', marginTop: '14px', gap: '2px' }}>
                  {/* Header row */}
                  <div />
                  {["PSY", "REC", "PHY"].map(h => (
                    <div key={h} style={{ textAlign: 'center', fontSize: '10px', fontWeight: 900, letterSpacing: '0.08em', padding: '6px 0', background: 'rgba(99,102,241,0.1)', border: '1px solid var(--ink)' }}>{h}</div>
                  ))}
                  {/* Row 1: PSY */}
                  <div className="matrix-label">PSY</div>
                  <span className="matrix" style={{ textAlign: 'center', padding: '14px 6px', border: '1px solid var(--ink)', fontWeight: 900, fontSize: '12px' }}>1.00</span>
                  {corrCell(0.62, "PSY-REC")}
                  {corrCell(0.38, "PSY-PHY")}
                  {/* Row 2: REC */}
                  <div className="matrix-label">REC</div>
                  {corrCell(0.62, "PSY-REC")}
                  <span className="matrix" style={{ textAlign: 'center', padding: '14px 6px', border: '1px solid var(--ink)', fontWeight: 900, fontSize: '12px' }}>1.00</span>
                  {corrCell(0.71, "REC-PHY")}
                  {/* Row 3: PHY */}
                  <div className="matrix-label">PHY</div>
                  {corrCell(0.38, "PSY-PHY")}
                  {corrCell(0.71, "REC-PHY")}
                  <span className="matrix" style={{ textAlign: 'center', padding: '14px 6px', border: '1px solid var(--ink)', fontWeight: 900, fontSize: '12px' }}>1.00</span>
                </div>

                {/* Color legend */}
                <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', fontWeight: 900 }}>
                  <span>No Link</span>
                  <div style={{ flex: 1, height: '8px', background: 'linear-gradient(to right, rgba(99,102,241,0), rgba(99,102,241,0.8))', border: '1px solid rgba(99,102,241,0.3)' }} />
                  <span>Strong</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontWeight: 700, color: '#888', marginTop: '2px' }}>
                  <span>0.0</span><span>0.25</span><span>0.50</span><span>0.75</span><span>1.0</span>
                </div>

                {/* Explanation card */}
                {selectedCell && CORRELATION_DATA[selectedCell as keyof typeof CORRELATION_DATA] && (() => {
                  const d = CORRELATION_DATA[selectedCell as keyof typeof CORRELATION_DATA];
                  const pts = d.points;
                  return (
                    <div style={{ marginTop: '16px', border: '2px solid var(--clay)', padding: '14px', background: '#fff' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '10px' }}>
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '0.06em', color: 'var(--clay)' }}>{d.label}</div>
                          <div style={{ fontSize: '20px', fontWeight: 900, marginTop: '4px' }}>r = {d.r.toFixed(2)}</div>
                          <div style={{ fontSize: '11px', fontWeight: 900, marginTop: '2px' }}>{d.strength}</div>
                        </div>
                        {/* Mini scatter plot */}
                        <svg width="100" height="72" viewBox="0 0 100 72" style={{ flexShrink: 0 }}>
                          <line x1="8" y1="64" x2="96" y2="64" stroke="#ccc" strokeWidth="1" />
                          <line x1="8" y1="0" x2="8" y2="64" stroke="#ccc" strokeWidth="1" />
                          {pts.map(([x, y], i) => (
                            <circle key={i} cx={8 + x * 0.88} cy={64 - y * 0.64} r="2.5" fill="var(--clay)" opacity="0.7" />
                          ))}
                          <line x1="8" y1={64 - 5 * d.r} x2="96" y2={64 - 60 * d.r} stroke="var(--clay)" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.5" />
                        </svg>
                      </div>
                      <p style={{ fontSize: '12px', lineHeight: '1.6', marginTop: '10px', color: '#333' }}>{d.explanation}</p>
                    </div>
                  );
                })()}
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
