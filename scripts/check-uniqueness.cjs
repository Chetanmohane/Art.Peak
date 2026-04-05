const fs = require('fs');
const content = fs.readFileSync('db-check-output.txt', 'utf8');
const lines = content.split('\n');

const images = [];
lines.forEach(line => {
    if (line.startsWith('Image: ')) {
        images.push(line.substring(7).trim());
    }
});

console.log(`Total images found: ${images.length}`);
const unique = new Set(images);
console.log(`Unique images count: ${unique.size}`);

if (images.length > 0) {
    for (let i = 0; i < images.length; i++) {
        for (let j = i + 1; j < images.length; j++) {
            if (images[i] === images[j]) {
                console.log(`MATCH found between product index ${i} and ${j}`);
            }
        }
    }
}
