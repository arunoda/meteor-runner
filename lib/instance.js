var path = require('path');
var Monitor = require('forever-monitor').Monitor;

function Instance(script, foreverOptions, options) {
 this._script = script;
 this._foreverOptions = foreverOptions || {};
 this._foreverOptions.spinSleepTime = this._foreverOptions.spinSleepTime || 2000;
 this._options = options || {};

 this._monitor = null; //placeholder for the forever monitor
 this._lastExitAt = null; //last time when child exited (on error)
 this._onChildExit = this._onChildExit.bind(this);

 this._setupStepdownProcess(); 
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

Instance.prototype._setupStepdownProcess = function() {
  if(this._options.gid || this._options.uid) {
    var stepDownScript = path.resolve(__dirname, '../scripts/stepdown.js');
    var sourceScript = path.resolve(this._foreverOptions.sourceDir, this._script)
    
    this._script = stepDownScript;
    delete this._foreverOptions.sourceDir;
    this._foreverOptions.env = this._foreverOptions.env || {};
    this._foreverOptions.env['_METEOR_RUNNER_SCRIPT'] = sourceScript;
    
    if(this._options.gid) {
      this._foreverOptions.env['_METEOR_RUNNER_GID'] = this._options.gid;
    }
    if(this._options.uid) {
      this._foreverOptions.env['_METEOR_RUNNER_UID'] = this._options.uid;
    }
  }
};

module.exports = Instance;