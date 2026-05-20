// src/find_localstorage.js
import fs from 'fs';
import path from 'path';

const srcDir = 'c:/Users/AIO/Downloads/career-rebuilt-production (3)/src';

function searchDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        searchDir(fullPath);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('localStorage') && !fullPath.includes('authService.ts') && !fullPath.includes('find_localstorage.js')) {
        console.log(`Found direct localStorage usage in: ${fullPath}`);
        // Find specific lines
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          if (line.includes('localStorage')) {
            console.log(`  Line ${idx + 1}: ${line.trim()}`);
          }
        });
      }
    }
  }
}

searchDir(srcDir);
