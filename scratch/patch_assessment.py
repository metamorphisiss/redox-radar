import re

with open("components/SharedComponents.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update workItems
new_work_items = """  const workItems = [
    "My job demands regularly interfere with my personal, family, or home life",
    "Personal or family responsibilities distract me or take away energy from my work",
    "The skills, energy, or positive mood I gain from work help me be more effective in my personal life",
    "Overall, I am satisfied with the balance between my work time and personal time"
  ];"""
content = re.sub(r'const workItems = \[[^\]]+\];', new_work_items, content)

# 2. Add state to Step 3 and Step 4
state_search = r'(const \[daytimeImpact, setDaytimeImpact\] = useState<number \| null>\(null\);)'
state_replace = r'\1\n  const [energy, setEnergy] = useState(5);'
content = re.sub(state_search, state_replace, content)

state4_search = r'(const \[spo2, setSpo2\] = useState\(""\);)'
state4_replace = r'\1\n  const [steps, setSteps] = useState("");\n  const [meds, setMeds] = useState<string | null>(null);\n  const [diet, setDiet] = useState<string | null>(null);'
content = re.sub(state4_search, state4_replace, content)

# 3. Update Validation
val4_search = r'(const isStep4Valid = hr !== "" && sys !== "" && dia !== "";)'
val4_replace = r'const isStep4Valid = hr !== "" && sys !== "" && dia !== "" && meds !== null && diet !== null;'
content = re.sub(val4_search, val4_replace, content)

# 4. Update UI Step 3
ui3_search = r'(<div className="q-block">\s*<span className="q-title">Daytime impact.*?</div>\s*</div>)'
ui3_replace = r"""\1
              <div className="q-block">
                <span className="q-title">Subjective Energy Level</span>
                <div className="slider-container">
                  <span className="slider-value">{energy}/10</span>
                  <input type="range" min="1" max="10" step="1" value={energy} onChange={e => setEnergy(Number(e.target.value))} className="slider-input" />
                </div>
              </div>"""
content = re.sub(ui3_search, ui3_replace, content, flags=re.DOTALL)

# 5. Update UI Step 4
ui4_search = r'(<h2[^>]*>Physiological Signals</h2>)'
ui4_replace = r"""\1
              
              <div className="q-block">
                <span className="q-title">Average Daily Step Count</span>
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
              </div>"""
content = re.sub(ui4_search, ui4_replace, content)

with open("components/SharedComponents.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated SharedComponents.tsx successfully!")

