// src/find_axios.js
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
      
      const hasAxios = content.includes('axios') && 
                       !fullPath.includes('client.ts') && 
                       !fullPath.includes('authApi.ts') && 
                       !fullPath.includes('temp_client.ts') && 
                       !fullPath.includes('temp_errors.ts') && 
                       !fullPath.includes('test_refresh.js') && 
                       !fullPath.includes('test_scenarios.js') && 
                       !fullPath.includes('find_axios.js');
                       
      const hasFetch = content.includes('fetch(') && 
                       !fullPath.includes('find_axios.js');
                       
      if (hasAxios || hasFetch) {
        console.log(`Found direct network client usage in: ${fullPath}`);
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          if (line.includes('axios') || line.includes('fetch(')) {
            console.log(`  Line ${idx + 1}: ${line.trim()}`);
          }
        });
      }
    }
  }
}

searchDir(srcDir);
