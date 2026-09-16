import re

with open("components/OnboardingOverlay.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace escaped single quotes with actual single quotes
content = content.replace("\\'", "'")

with open("components/OnboardingOverlay.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed escaped quotes in OnboardingOverlay.tsx")
