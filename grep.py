import os
import sys

n = len(sys.argv)

if n!=3:
    print("Usage: python grep.py <base_path> <search_txt>")
    sys.exit(1)

base_path = sys.argv[1]
search_txt = sys.argv[2]

known_extensions = ['csv', '.py', '.cpp', '.h', '.sh', '.go', '.js', '.cc', '.c', '.java', '.html', '.css', '.scala', '.hpp', '.sql']
known_extensions.sort()

results = []

def grep(base_path):
    for item_name in os.listdir(base_path):
        if item_name == "node_modules":
            continue

        item_path = os.path.join(base_path, item_name)
        if os.path.isfile(item_path):
            try:
                for e in known_extensions:
                    if item_name.endswith(e):
                        with open(item_path, 'r', encoding='utf-8') as f:
                            file_content = f.readlines()
                            for i, line in enumerate(file_content):
                                if search_txt in line:
                                    start_idx = max(line.index(search_txt)-20, 0)
                                    end_idx = min(start_idx+len(search_txt)+40, len(line))

                                    results.append(item_path + " : " + str(i+1) + "\n" + line[start_idx:end_idx] + "\n")
            except:
                continue

        elif os.path.isdir(item_path):
            grep(item_path)
    
result = grep(base_path)

for i in range(len(results)):
    print(results[i])