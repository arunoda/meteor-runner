var Monitor = require('forever-monitor').Monitor;

function Instance(script, foreverOptions) {
 this._script = script;
 this._foreverOptions = foreverOptions || {};
 this._foreverOptions.spinSleepTime = this._foreverOptions.spinSleepTime || 2000;

 this._monitor = null; //placeholder for the forever monitor
 this._lastExitAt = null; //last time when child exited (on error)
 this._onChildExit = this._onChildExit.bind(this);
};

Instance.prototype.start = function(endCallback) {
  if(this._monitor) {
    throw new Error("You can't start again");
  }
  this._monitor = new Monitor(this._script, this._foreverOptions);
  this._monitor.once('exit', endCallback || function() {});
  this._monitor.on('exit:code', this._onChildExit);
  this._monitor.start();
  return this._monitor;
};

Instance.prototype.stop = function() {
  this._monitor.stop();
  this._monitor.removeListener('exit:code', this._onChildExit);
};

Instance.prototype.isRunning = function() {
  if(!this._monitor) {
    return false;
  } else if(!this._lastExitAt) {
    return true;
  } else {
    var timeSinceLastExit = Date.now() - this._lastExitAt.getTime();
    return timeSinceLastExit > this._foreverOptions.spinSleepTime;
  }
};

Instance.prototype.restart = function() {
  this._monitor.restart();
};

Instance.prototype._onChildExit = function() {
  this._lastExitAt = new Date();
};

module.exports = Instance;