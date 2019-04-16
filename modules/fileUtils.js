const fs = require('fs');
const readline = require('readline');
const ParsedDataModel = require('../models/parsed-data');

const TAGS = {
  ERROR: 'ERROR:'
};

class FileUtils {

  static readFiles(directoryPath) {
    return new Promise((resolve, reject) => {

      fs.readdir(directoryPath, function (err, files) {

        if (err) {
          //return console.log('Unable to scan directory: ' + err);
          reject('Unable to scan directory: ' + err);
        }

        //listing all files using forEach
        //we should read only 1 file... or place them in tabs?? :/
        files.forEach(function (file) {

          const filePath = `${directoryPath}\\${file}`;

          countFileLines(filePath).then(lines => {
            console.log(`Parsing ${file} with ${lines} lines`);

            const rd = readline.createInterface({
              input: fs.createReadStream(filePath)
            });

            rd.on('line', (line) => {

              if (line.startsWith(TAGS.ERROR)) {
                ParsedDataModel.errors.push(line);
              }

            });

            rd.on('close', function () {
              resolve(ParsedDataModel);
            });

          }).catch('error');

        });
      });

    });
  }
}

/**
 * Counts the total number of lines in a file
 * @param {string} filePath - path to the file
 * @returns {Promise} - Promise
 */
function countFileLines(filePath) {
  return new Promise((resolve, reject) => {
    let lineCount = 0;
    fs.createReadStream(filePath)
      .on("data", (buffer) => {
        let idx = -1;
        lineCount--; // Because the loop will run once for idx=-1
        do {
          idx = buffer.indexOf(10, idx + 1);
          lineCount++;
        } while (idx !== -1);
      }).on("end", () => {
        resolve(lineCount);
      }).on("error", reject);
  });
};

module.exports = FileUtils;