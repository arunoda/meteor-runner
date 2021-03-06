var commander = require('commander');
var path = require('path');
var App = require('../lib/app');

var optionsParser = commander
  .usage('[options]')
  .option('-c, --config [config file]', 'specify config file to start the runner')
  .option('-p --print', 'print sample config file')
  .parse(process.argv);

if(optionsParser.config) {
  var config;
  try{
    config = require(path.resolve(optionsParser.config));
  } catch(ex) {
    console.error('Error when parsing config file');
    throw ex;
  }

  new App(config).start();

  if(typeof(gc) == 'function') {
    console.log(' >> .gc() every 5 min to keep low memory profile');
    setInterval(function() {
      gc();
    }, 1000 * 60 * 5);
  }
} else if(optionsParser.print) {
  var sampleConfig = require('../lib/sampleConfig');
  console.log(JSON.stringify(sampleConfig, null, 4));
} else {
  console.error('config file is required!\nuse -p to print a sample config file');
}