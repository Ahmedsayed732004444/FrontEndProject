// src/find_log_files.js
import fs from 'fs';
import path from 'path';

const rootDir = 'c:/Users/AIO/Downloads/career-rebuilt-production (3)';

function findLogFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        findLogFiles(fullPath);
      }
    } else {
      const lower = file.toLowerCase();
      if (lower.endsWith('.log') || lower.endsWith('.txt') || lower.includes('log')) {
        console.log(`Found: ${fullPath} (${stat.size} bytes)`);
      }
    }
  }
}

findLogFiles(rootDir);
