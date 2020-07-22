const csvtojson = require('csvtojson');
const fs = require('fs');
const csvFilePath = './csv/csvFile.csv';
const txtFilePath = './csv/csvFile.txt';
const readStream = fs.createReadStream(csvFilePath);
const writeStream = fs.createWriteStream(txtFilePath, 'utf8');

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