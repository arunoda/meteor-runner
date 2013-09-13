var Instance = require('./instance');
var Monitors = require('./monitors');
var parseConfig = require('./parseConfig');

function App(config) {
  this._config = parseConfig(config);
  this._instances = [];

  this.script = this._config.script;
  this.foreverOptions = this._config.foreverOptions;
  this.monitorConfig = this._config.monitors;

  this._instances.push(new Instance(this.script, this.foreverOptions));
  this._monitors = {};
}

App.prototype.start = function() {
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