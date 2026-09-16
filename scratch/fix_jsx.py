import re

with open("components/OnboardingOverlay.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix the duplicated divs
content = re.sub(
    r'<div className="q-block" style=\{\{ padding: \'15px\', background: \'var\(--cream\)\', borderRadius: \'8px\' \}\}>\s*<div className="q-block" style=\{\{ padding: \'15px\', background: \'#F8FAFC\', border: \'2px solid var\(--ink\)\', borderRadius: \'0px\' \}\}>',
    r'<div className="q-block" style={{ padding: \'15px\', background: \'#F8FAFC\', border: \'2px solid var(--ink)\', borderRadius: \'0px\' }}>',
    content
)

with open("components/OnboardingOverlay.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed JSX errors in OnboardingOverlay.tsx")
