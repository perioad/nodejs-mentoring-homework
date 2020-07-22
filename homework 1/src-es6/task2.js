import csvtojson from 'csvtojson';
import { createReadStream, createWriteStream } from 'fs';

const csvFilePath = './csv/csvFile.csv';
const txtFilePath = './csv/csvFile.txt';
const readStream = createReadStream(csvFilePath);
const writeStream = createWriteStream(txtFilePath, 'utf8');

csvtojson()
  .fromStream(readStream)
  .subscribe(
    (jsonObj) => {
      const nextString = JSON.stringify(jsonObj)
      writeStream.write(`${nextString}\n`);
    },
    (error) => {
      console.error('Oops, there is an error:');
      console.error(error.message);
    }
  );