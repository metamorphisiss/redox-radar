import re

with open("app/globals.css", "r", encoding="utf-8") as f:
    css = f.read()

# Update assessment-overlay
overlay_search = r'\.assessment-overlay \{.*?\}'
overlay_replace = r""".assessment-overlay {
  position: fixed;
  top: 74px;
  left: 0;
  width: 100%;
  height: calc(100vh - 74px);
  background: rgba(17, 17, 17, 0.6);
  backdrop-filter: blur(3px);
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}"""
css = re.sub(overlay_search, overlay_replace, css, flags=re.DOTALL)

# Update assessment-card
card_search = r'\.assessment-card \{.*?\}'
card_replace = r""".assessment-card {
  width: 100%;
  max-width: 650px;
  max-height: 85vh;
  border: var(--line) solid var(--ink);
  background: #ffffff;
  box-shadow: 10px 10px 0 rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
}"""
css = re.sub(card_search, card_replace, css, flags=re.DOTALL)

# Update assessment-footer
footer_search = r'\.assessment-footer \{.*?\}'
footer_replace = r""".assessment-footer {
  padding: 20px;
  border-top: 2px solid var(--ink);
  display: flex;
  justify-content: space-between;
  background: #ffffff;
}"""
css = re.sub(footer_search, footer_replace, css, flags=re.DOTALL)

# Update q-block
qblock_search = r'\.q-block \{.*?\}'
qblock_replace = r""".q-block {
  border: none;
  border-bottom: 1px dashed var(--gray);
  padding: 10px 0 25px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.q-block:last-child {
  border-bottom: none;
}"""
css = re.sub(qblock_search, qblock_replace, css, flags=re.DOTALL)

# Update q-btn
qbtn_search = r'\.q-btn \{.*?\}'
qbtn_replace = r""".q-btn {
  flex: 1;
  border: 2px solid var(--ink);
  background: #ffffff;
  color: var(--ink);
  font-weight: 800;
  font-size: 12px;
  padding: 12px 8px;
  text-align: center;
  transition: 0.15s;
}"""
css = re.sub(qbtn_search, qbtn_replace, css, flags=re.DOTALL)

# Update physio-input
physio_search = r'\.physio-input \{.*?\}'
physio_replace = r""".physio-input {
  border: 2px solid var(--ink);
  padding: 12px;
  font-weight: 700;
  font-size: 14px;
  background: #f8fafc;
  outline: none;
  transition: 0.15s;
}
.physio-input:focus {
  background: #EEF2FF;
  border-color: var(--clay);
}"""
css = re.sub(physio_search, physio_replace, css, flags=re.DOTALL)

# Remove the inline styles from OnboardingOverlay that force grey backgrounds on conditional blocks
# I'll do that using a separate pass or just let them stay but change their color. Let's fix those inline styles later.

with open("app/globals.css", "w", encoding="utf-8") as f:
    f.write(css)

print("Modal CSS updated!")

