import os

known_extensions = ['.py', '.cpp', '.h', '.sh', '.go', '.js', '.cc', '.c', '.java', '.html', '.css', '.scala', '.hpp', '.sql']
known_extensions.sort()

file_count = {}
line_count = {}
for e in known_extensions:
    line_count[e] = 0

def countlines(start, lines=0, header=True, begin_start=None):
    for thing in os.listdir(start):
        thing = os.path.join(start, thing)
        if os.path.isfile(thing):
            try:
                if thing == ".\\total_lines.py":
                    continue
                temp = thing.split(".")
                if len(temp) >= 2 and len(temp[-1]) <= 5:
                    if temp[-1] in file_count:
                        file_count[temp[-1]] += 1
                    else:
                        file_count[temp[-1]] = 1
                for e in known_extensions:
                    if thing.endswith(e):
                        with open(thing, 'r', encoding='utf-8') as f:
                            newlines = f.readlines()
                            newlines = len(newlines)
                            lines += newlines

                            if begin_start is not None:
                                reldir_of_thing = '.' + thing.replace(begin_start, '')
                            else:
                                reldir_of_thing = '.' + thing.replace(start, '')

                            line_count[e] += newlines
                            break
            except:
                continue

    for thing in os.listdir(start):
        if thing == "node_modules":
            continue
        thing = os.path.join(start, thing)
        if os.path.isdir(thing):
            countlines(thing, lines, header=False, begin_start=start)
    
result = countlines(".")

total_files = 0
for key, value in file_count.items():
    print(key, value)
    total_files += value
print("\nTotal Files:",total_files)

print("\n")

total_lines = 0
for key, value in line_count.items():
    if value > 0:
        print(key, value)
        total_lines += value
    
print("\nTotal Lines:",total_lines)