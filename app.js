const Server = require('./modules/server');
const FileUtils = require('./modules/fileUtils');
const path = require('path');
const directoryPath = path.join(__dirname, 'logs');

FileUtils.readFiles(directoryPath).then(ParsedDataModel => {
  new Server(ParsedDataModel);
}).catch(data => {
  console.log(data);
});
