const process = require('process');

process.stdin.on('data', (input) => {
  const reversedInput = input.reverse();
  process.stdout.write(`${reversedInput}\n`);
})