// src/extract_errors.js
import fs from 'fs';
import readline from 'readline';

const logPath = 'C:\\Users\\AIO\\.gemini\\antigravity\\brain\\7181acc3-9fc4-4868-b1d1-d7e4fda94469\\.system_generated\\logs\\transcript.jsonl';

async function extract() {
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    try {
      const obj = JSON.parse(line);
      // Look for error logs or failed background task logs
      if (obj.content && (obj.content.includes('Error') || obj.content.includes('401') || obj.content.includes('token') || obj.content.includes('refresh'))) {
        if (obj.type === 'USER_INPUT') {
          console.log(`Step ${obj.step_index} (USER):`);
          console.log(obj.content);
          console.log('---');
        }
      }
    } catch (e) {
      // Ignore
    }
  }
}

extract();
