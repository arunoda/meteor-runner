var Instance = require('./instance');

function App(config) {
  this._config = config;
  this._instances = [];

  this._instances.push(new Instance(config.script, config.foreverOptions));
}

App.prototype.start = function() {
  this._instances.forEach(function(instance) {
    instance.start(function() {});
  });  
};

module.exports = App;