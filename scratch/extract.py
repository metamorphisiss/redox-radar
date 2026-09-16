import urllib.request
import re
import json

url = 'https://docs.google.com/forms/d/e/1FAIpQLSd7TTkyeixsH3cb8n0s3llddWRpgQMEv1UsYSSb7r0BjFkqqg/viewform'
html = urllib.request.urlopen(url).read().decode('utf-8')

match = re.search(r'FB_PUBLIC_LOAD_DATA_\s*=\s*(.*?);', html)
if match:
    data = json.loads(match.group(1))
    questions = data[1][1]
    with open('scratch/form_questions.txt', 'w', encoding='utf-8') as f:
        for q in questions:
            title = q[1]
            f.write(f"- {title}\n")
else:
    print("Not found")

