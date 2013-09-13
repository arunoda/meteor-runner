var Ping = require('../../lib/monitors/ping');
var assert = require('assert');
var http = require('http');

suite('Ping', function() {
  suite('options check', function() {
    test('no such port', function(done) {
      var p;
      var instance = {
        isRunning: function() {return true;},
        restart: function() {
          p.stop();
          done();
        }
      };

      p = new Ping(instance, {port: 3434, interval: 100, timeout: 50, threshold: 3, silence: true});
      p.start();
    });

    test('timeout execeded', function(done) {
      var p;
      var server;
      var instance = {
        isRunning: function() {return true;},
        restart: function() {
          p.stop();
          server.close();
          done();
        }
      };

      server = http.createServer(function(req, res) {
        // res.writeHead(200, {'Content-Type': 'text/plain'});
        // res.end('Hello');
      });

      server.listen(5000, function() {
        p = new Ping(instance, {port: 5000, interval: 100, timeout: 50, threshold: 3, silence: true});
        p.start();
      });
    });
    
    test('statusCode is different', function(done) {
      var p;
      var server;
      var instance = {
        isRunning: function() {return true;},
        restart: function() {
          p.stop();
          server.close();
          done();
        }
      };

      server = http.createServer(function(req, res) {
        res.writeHead(201, {'Content-Type': 'text/plain'});
        res.end('Hello');
      });

      server.listen(5000, function() {
        p = new Ping(instance, {port: 5000, interval: 100, timeout: 50, threshold: 3, silence: true});
        p.start();
      });
    });
  });

  suite('scenarios', function() {
    test('pingFailed and instance running', function(done) {
      var p;
      var instance = {
        isRunning: function() {return true;},
        restart: function() {
          p.stop();
          done();
        }
      };

      p = new Ping(instance, {port: 3434, interval: 100, timeout: 50, threshold: 3, silence: true});
      p.start();
    });

    test('pingFailed and instance not running', function(done) {
      var p;
      var instance = {
        isRunning: function() {
          return false;
        },
        restart: function() {
          assert.failed('should not call restart')
        }
      };

      p = new Ping(instance, {port: 3434, interval: 100, timeout: 50, threshold: 3, silence: true});
      p.start();

      setTimeout(function() {
        done();
      }, 400);
    });

    test('pingFailed twice', function(done) {
      var restartCount = 0;
      var p;
      var instance = {
        isRunning: function() {
          return true;
        },
        restart: function() {
          restartCount++;
        }
      };

      p = new Ping(instance, {port: 3434, interval: 100, timeout: 50, threshold: 3, silence: true});
      p.start();

      setTimeout(function() {
        assert.equal(restartCount, 2);
        done();
      }, 700);
    });

    test('some pings failed at random', function(done) {
      var p;
      var server;
      var instance = {
        isRunning: function() { return true },
        restart: function() { assert.fail('should not check restart'); }
      };

      var pingCounts = 0;
      server = http.createServer(function(req, res) {
        if(pingCounts++ % 3 == 0) {
          res.writeHead(201, {'Content-Type': 'text/plain'});
        } else {
          res.writeHead(200, {'Content-Type': 'text/plain'});
        }
        res.end('Hello');
      });

      server.listen(5000, function() {
        p = new Ping(instance, {port: 5000, interval: 100, timeout: 50, threshold: 3});
        p.start();
      });

      setTimeout(function() {
        p.stop();
        server.close();
        done();
      }, 800);
    });

    test('works perfectly', function(done) {
      var p;
      var server;
      var instance = {
        isRunning: function() { return true },
        restart: function() { assert.fail('should not check restart'); }
      };

      var pingCounts = 0;
      server = http.createServer(function(req, res) {
        if(pingCounts++ % 3 == 0) {
          res.writeHead(201, {'Content-Type': 'text/plain'});
        } else {
          res.writeHead(200, {'Content-Type': 'text/plain'});
        }
        res.end('Hello');
      });

      server.listen(5002, function() {
        p = new Ping(instance, {port: 5002, interval: 100, timeout: 50, threshold: 3, silence: true});
        p.start();
      });

      setTimeout(function() {
        p.stop();
        server.close();
        done();
      }, 800);
    });
  });
});