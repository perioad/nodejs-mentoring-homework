import { stdin, stdout } from 'process';

stdin.on('data', (input) => {
  const reversedInput = input.reverse();
  stdout.write(`${reversedInput}\n`);
})