const fs = require('fs');

const content = fs.readFileSync('resources/2365 l2.md', 'utf-8');
const lines = content.split('\n');

console.log(`Total lines: ${lines.length}`);

// Look for lines starting with "# Unit"
console.log('\n=== Lines starting with "# Unit" ===');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.startsWith('# Unit')) {
    console.log(`Line ${i}: ${line}`);
    console.log(`  Char codes:`, [...line].slice(0, 20).map(c => `${c}(${c.charCodeAt(0)})`).join(' '));
  }
}

// Test with actual line
console.log('\n=== Direct test with line 325 ===');
const testLine = lines[325];
console.log('Line:', testLine);
console.log('Line length:', testLine.length);
console.log('Last char code:', testLine.charCodeAt(testLine.length - 1));

// Try different regex patterns
const patterns = [
  /^# Unit (\d+) \u2014 (.+)$/,
  /^# Unit (\d+) — (.+)$/,
  /^# Unit (\d+).+$/,
  /^# Unit \d+/,
];

patterns.forEach((pattern, i) => {
  const match = testLine.match(pattern);
  console.log(`Pattern ${i}: ${pattern} => ${match ? 'MATCH' : 'NO MATCH'}`);
  if (match) console.log('  Groups:', match);
});

// Test Unit regex - with Unicode escape
console.log('\n=== Testing all lines ===');
const unitRegex1 = /^# Unit (\d+) \u2014 (.+)$/;
let unitCount1 = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const match = line.match(unitRegex1);
  if (match) {
    unitCount1++;
    console.log(`Line ${i}: Found Unit ${match[1]}: ${match[2]}`);
  }
}

console.log(`\nTotal units found: ${unitCount1}`);

// Test LO regex
const loRegex = /^## (LO\d+)\s+[—–-]\s+(.+)$/;
let loCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const match = line.match(loRegex);
  if (match) {
    loCount++;
    console.log(`Line ${i}: Found ${match[1]}: ${match[2]}`);
  }
}

console.log(`\nTotal LOs found: ${loCount}`);
