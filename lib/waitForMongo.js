var MongoClient = require('mongodb').MongoClient;

function waitForMongo(mongoUrl, options, callback) {
  if(typeof(options) == 'function') {
    callback = options;
    options = {};
  }

  options = options || {};
  options.timeout = options.timeout || 1000 * 60 * 2; //2 minutes
  var startedTime = Date.now();

  connectAgain();

  function connectAgain() {
    if(Date.now() > startedTime + options.timeout) {
      return callback(new Error('TIMEOUT_WAIT_FOR_MONGO'));
    }

    MongoClient.connect(mongoUrl, function(err, db) {
      if(err) {
        setTimeout(connectAgain, 500);
      } else {
        db.close();
        callback();
      }
    });
  }
}

module.exports = waitForMongo;