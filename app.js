const Server = require('./modules/server');
const FileUtils = require('./modules/fileUtils');
const path = require('path');
const directoryPath = path.join(__dirname, 'logs');

// We use this to bypass certificate check
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
var jenkins = require('jenkins')({ baseUrl: 'https://user:pass@jenkinsurl', crumbIssuer: true });

jenkins.build.get('Execute_Accounts_Tests', 131, function(err, data) {
  if (err) throw err;
 
  console.log('build', data);
});

FileUtils.readFiles(directoryPath).then(ParsedDataModel => {
  new Server(ParsedDataModel);
}).catch(data => {
  console.log(data);
});
