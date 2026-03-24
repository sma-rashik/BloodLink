import os
import re
import glob

# Find all jsx files in src directory
jsx_files = glob.glob('d:/Practice Antigravity/Bloodlink/src/**/*.jsx', recursive=True)

for file_path in jsx_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # regex to remove dark:[classes]
    # matches 'dark:something', 'dark:hover:something'
    new_content = re.sub(r'\bdark:([a-zA-Z0-9\-\/]+)\b\s*', '', content)
    
    # remove any extra spaces inside className strings due to above replacement
    new_content = re.sub(r'\s+className="', ' className="', new_content)
    new_content = re.sub(r'className="\s+', 'className="', new_content)
    new_content = re.sub(r'\s+"', '"', new_content)
    
    if content != new_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Cleaned dark classes from {file_path}")
