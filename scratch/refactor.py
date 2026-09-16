import re
import os

with open("app/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Create lib/shared.ts
shared_ts = """export const palette = {
  clay: "#4F46E5",
  sand: "#A78BFA",
  teal: "#BCEE1B",
  ink: "#111111",
  cream: "#F2F0E8",
};

export const participants = Array.from({ length: 12 }, (_, i) => {
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
"""
os.makedirs("lib", exist_ok=True)
with open("lib/shared.ts", "w", encoding="utf-8") as f:
    f.write(shared_ts)


# Create components/SharedComponents.tsx
arrow_match = re.search(r'function Arrow.*?\n}', content, re.DOTALL)
status_match = re.search(r'function Status.*?\n}', content, re.DOTALL)
sparkline_match = re.search(r'function Sparkline.*?return \(\s*<svg.*?</svg>\s*\);\s*}', content, re.DOTALL)
domaincard_match = re.search(r'function DomainCard.*?return \(\s*<article className="domain-card">.*?</article>\s*\);\s*}', content, re.DOTALL)
assessment_match = re.search(r'function AssessmentFlow.*?return \(\s*<div className="assessment-overlay">.*?</div>\s*\);\s*}', content, re.DOTALL)

shared_components = f"""'use client';
import {{ useState }} from "react";
import {{ palette }} from "../lib/shared";

export {arrow_match.group(0)}

export {status_match.group(0)}

export {sparkline_match.group(0)}

export {domaincard_match.group(0)}

export {assessment_match.group(0)}
"""
os.makedirs("components", exist_ok=True)
with open("components/SharedComponents.tsx", "w", encoding="utf-8") as f:
    f.write(shared_components)


# Create app/page.tsx
landing_match = re.search(r'function Landing.*?return \(\s*<main className="landing">.*?</main>\s*\);\s*}', content, re.DOTALL)
landing_code = landing_match.group(0)
landing_code = landing_code.replace('function Landing({', 'export default function Page({')
landing_code = landing_code.replace('onEnter: (role: "participant" | "researcher") => void;', '')
landing_code = landing_code.replace('}: {', '')
landing_code = landing_code.replace('onEnter,', '')
landing_code = landing_code.replace('}) {', '() {\\n  const router = useRouter();')

page_tsx = f"""'use client';
import {{ useState }} from "react";
import {{ useRouter }} from "next/navigation";
import {{ Arrow }} from "../components/SharedComponents";

{landing_code}
"""
# Replace onEnter calls
page_tsx = page_tsx.replace('onClick={() => onEnter("researcher")}', 'onClick={() => router.push("/office-dashboard")}')
page_tsx = page_tsx.replace('onClick={() => onEnter("participant")}', 'onClick={() => router.push("/patient-dashboard")}')

with open("app/page.tsx", "w", encoding="utf-8") as f:
    f.write(page_tsx)


# Create app/patient-dashboard/page.tsx
patient_match = re.search(r'function ParticipantPortal.*?return \(\s*<main className="app-shell">.*?</main>\s*\);\s*}', content, re.DOTALL)
patient_code = patient_match.group(0)
patient_code = patient_code.replace('function ParticipantPortal({ onBack }: { onBack: () => void })', 'export default function ParticipantPortal()')
patient_code = patient_code.replace('const [selected, setSelected] = useState(0);', 'const router = useRouter();\\n  const [selected, setSelected] = useState(0);')

patient_tsx = f"""'use client';
import {{ useState, useMemo }} from "react";
import {{ useRouter }} from "next/navigation";
import {{ Arrow, Status, Sparkline, AssessmentFlow, DomainCard }} from "../../components/SharedComponents";
import {{ participants, palette }} from "../../lib/shared";

{patient_code}
"""
patient_tsx = patient_tsx.replace('onClick={onBack}', 'onClick={() => router.push("/")}')

os.makedirs("app/patient-dashboard", exist_ok=True)
with open("app/patient-dashboard/page.tsx", "w", encoding="utf-8") as f:
    f.write(patient_tsx)


# Create app/office-dashboard/page.tsx
office_match = re.search(r'function ResearcherPortal.*?return \(\s*<main className="research-shell">.*?</main>\s*\);\s*}', content, re.DOTALL)
office_code = office_match.group(0)
office_code = office_code.replace('function ResearcherPortal({ onBack }: { onBack: () => void })', 'export default function ResearcherPortal()')
office_code = office_code.replace('const [tab, setTab] = useState("Overview");', 'const router = useRouter();\\n  const [tab, setTab] = useState("Overview");')

office_tsx = f"""'use client';
import {{ useState }} from "react";
import {{ useRouter }} from "next/navigation";
import {{ Arrow, Status, Sparkline }} from "../../components/SharedComponents";
import {{ participants, palette }} from "../../lib/shared";

{office_code}
"""
office_tsx = office_tsx.replace('onClick={onBack}', 'onClick={() => router.push("/")}')

os.makedirs("app/office-dashboard", exist_ok=True)
with open("app/office-dashboard/page.tsx", "w", encoding="utf-8") as f:
    f.write(office_tsx)

print("Done Refactoring!")

