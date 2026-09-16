'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Arrow } from "../components/SharedComponents";
import { OnboardingOverlay } from "../components/OnboardingOverlay";

export default function Page() {
  const router = useRouter();
  const [hover, setHover] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);

  return (
    <main className="landing">
      {isOnboarding && (
        <OnboardingOverlay 
          onComplete={() => router.push("/patient-dashboard")} 
          onCancel={() => setIsOnboarding(false)} 
        />
      )}
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">RR</span>
          <span>REDOXRADAR</span>
        </div>
        <span className="eyebrow">RESEARCH-STAGE PATTERN TRACKING / 01</span>
        <button className="text-button" onClick={() => router.push("/office-dashboard")}>
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
          <div className="hero-actions" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="button button-dark"
                onClick={() => router.push("/patient-dashboard")}
              >
                Enter participant portal <Arrow />
              </button>
              <button
                className="button button-light"
                onClick={() => setIsOnboarding(true)}
              >
                Start Onboarding Simulation <Arrow />
              </button>
            </div>
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
              onClick={() => router.push("/patient-dashboard")}
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
              onClick={() => router.push("/office-dashboard")}
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
