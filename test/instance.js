var assert = require('assert');
var Instance = require('../lib/instance');
var path = require('path');
var fs = require('fs');

suite('Instance', function() {
  suite('.inRunning', function() {
    test('no monitor', function() {
      var i = new Instance();
      assert.equal(i.isRunning(), false);
    });

    test('running okay', function(done) {
      var script = path.resolve(__dirname, 'scripts/longRunning.js');
      var i = new Instance(script);
      i.start();
      setTimeout(function() {
        assert.equal(i.isRunning(), true);
        i.stop();
        done();
      }, 300);
    });

    test('failing', function(done) {
      var script = path.resolve(__dirname, 'scripts/failFast.js');
      var i = new Instance(script, {spinSleepTime: 100, silent: true});
      i.start();
      setTimeout(function() {
        assert.equal(i.isRunning(), false);
        i.stop();
        done();
      }, 350);
    });

    test('failed and restarted', function(done) {
      var fileName = '/tmp/sssd.lock';
      var script = path.resolve(__dirname, 'scripts/failOnFileNotExists.js');
      var i = new Instance(script, {spinSleepTime: 100, silent: true, env: {FILE_NAME: fileName}});
      i.start();
      setTimeout(function() {
        assert.equal(i.isRunning(), true);
        i.stop();
        done();
      }, 300);
    });
  });
}); 