const fs = require('fs');

const content = fs.readFileSync('db-check-output.txt', 'utf8');
const lines = content.split('\n');

let currentName = '';
lines.forEach(line => {
    if (line.startsWith('Name: ')) {
        currentName = line.substring(6).trim();
    } else if (line.startsWith('Image: ')) {
        const img = line.substring(7).trim();
        console.log(`FOUND: "${currentName}" | Image Start: ${img.substring(0, 30)}`);
    }
});
