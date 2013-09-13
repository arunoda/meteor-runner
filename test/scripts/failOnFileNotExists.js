if(!process.env.ALLOW) {
  return;
}

var fileName = process.env.FILE_NAME;
var fs = require('fs');

if(!fs.existsSync(fileName)) {
  fs.writeFileSync(fileName, 'ssds');
  throw new Error('file not exits');
} else {
  fs.unlinkSync(fileName);
  setTimeout(function() {

  }, 10000);
}