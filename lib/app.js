var Instance = require('./instance');
var Monitors = require('./monitors');

function App(config) {
  this._config = config;
  this._instances = [];

  this._instances.push(new Instance(config.script, config.foreverOptions));
  this._monitors = {};
}

App.prototype.start = function() {
  var self = this;
  this._instances.forEach(function(instance) {
    instance.start();

    //support for monitors
    for(var type in self._config.monitors) {
      var monitor = new Monitors[type](instance, self._config.monitors[type]);
      if(!self._monitors[type]) {
        self._monitors[type] = [];
      }
      self._monitors[type].push(monitor);
      monitor.start();
    }
  });  
};

module.exports = App;