var Instance = require('./instance');
var Monitors = require('./monitors');
var parseConfig = require('./parseConfig');
var waitForMongo = require('./waitForMongo');

function App(config) {
  this._config = parseConfig(config);
  this._instances = [];

  this.script = this._config.script;
  this.foreverOptions = this._config.foreverOptions;
  this.instanceOptions = this._config.instanceOptions;
  this.monitorConfig = this._config.monitors;

  this._instances.push(new Instance(this.script, this.foreverOptions, this.instanceOptions));
  this._monitors = {};
}

App.prototype.start = function() {
  var self = this;

  if(this._config.waitForMongo) {
    var mongoUrl = this._config.waitForMongo.url;
    var options = this._config.waitForMongo.options;

    console.log(' >> Wait for Mongo: ' + mongoUrl);
    waitForMongo(mongoUrl, options, afterConnected);
  } else {
    this._start();
  }

  function afterConnected(err) {
    if(err) {
      throw err;
    } else {
      self._start();
    }
  }
};

App.prototype._start = function() {
  console.log(' >> Staring instances');
  var self = this;
  this._instances.forEach(function(instance) {
    instance.start();

    //support for monitors
    for(var type in self.monitorConfig) {
      var monitor = new Monitors[type](instance, self.monitorConfig[type]);
      if(!self._monitors[type]) {
        self._monitors[type] = [];
      }
      self._monitors[type].push(monitor);
      monitor.start();
    }
  });  
};

module.exports = App;