import re

# Update lib/shared.ts
with open('lib/shared.ts', 'r', encoding='utf-8') as f:
    shared_content = f.read()

# Replace clay and teal hex codes
shared_content = re.sub(r'clay:\s*"#4F46E5"', 'clay: "#6366F1"', shared_content) # Lighter indigo
shared_content = re.sub(r'teal:\s*"#BCEE1B"', 'teal: "#60A5FA"', shared_content) # Blue shade

with open('lib/shared.ts', 'w', encoding='utf-8') as f:
    f.write(shared_content)


# Update app/globals.css
with open('app/globals.css', 'r', encoding='utf-8') as f:
    css_content = f.read()

# Replace root variables
css_content = re.sub(r'--clay:#4F46E5;', '--clay:#6366F1;', css_content)
css_content = re.sub(r'--teal:#BCEE1B;', '--teal:#60A5FA;', css_content)

# Replace the grayish backgrounds with #EEF2FF
css_content = re.sub(r'#e8e4d9', '#EEF2FF', css_content)
css_content = re.sub(r'#e2ded2', '#EEF2FF', css_content)
css_content = re.sub(r'#f0ede4', '#EEF2FF', css_content)

# Update hardcoded lime text colors if any (track strong color was #A3E635)
css_content = re.sub(r'color:#A3E635;', 'color:#60A5FA;', css_content)

with open('app/globals.css', 'w', encoding='utf-8') as f:
    f.write(css_content)

print("Color palette updated!")
