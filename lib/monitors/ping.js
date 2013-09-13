var request = require('request');

function Ping(instance, options) {
  options = options || {};
  if(!options.port) {
    throw new Error('ping monitor requires a port');
  }

  this.instance = instance;

  this.port = options.port;
  this.interval = options.interval || 2000;
  this.threshold = options.threshold || 5;
  this.timeout = options.timeout || 500; 
  this.statusCode = options.statusCode || 200;

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
    if(err || res.statusCode != self.statusCode) {
      self.failedPings++;
      if(self.failedPings == self.threshold) {
        self.failedPings = 0;
        if(self.instance.isRunning()) {
          self.instance.restart();
        }
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