var request = require('request');

function Ping(instance, options) {
  this.options = options || {};
  if(!options.port) {
    throw new Error('ping monitor requires a port');
  }

  this.instance = instance;

  this.port = this.options.port;
  this.interval = this.options.interval || 2000;
  this.threshold = this.options.threshold || 5;
  this.timeout = this.options.timeout || 500; 
  this.statusCode = this.options.statusCode || 200;

  this.started = false;
  this._handler = null; //stores handler for the pinging

  this.failedPings = 0;
}

Ping.prototype.start = function() {
  if(this.started) {
    throw new Error('cannot start again once started!');
  }

  var self = this;
  var url = "http://localhost:" + this.port;
  var options = {timeout: this.timeout};

  this._handler = setInterval(function() {
    request.get(url, options, afterProcessed);
  }, this.interval);

  function afterProcessed(err, res, body) {
    // console.log(err, res);
    if(self.instance.isRunning() && (err || res.statusCode != self.statusCode)) {
      self.failedPings++;
      if(self.failedPings == self.threshold) {
        self.failedPings = 0;
        if(!self.options.silence) {
          console.info(' >> restarting due to ping error');
        }
        self.instance.restart();
      }
    } else {
      self.failedPings = 0;
    }
  }
};

Ping.prototype.stop = function() {
  clearTimeout(this._handler);
  this.failedPings = 0;
  this.started = false;
};

module.exports = Ping;