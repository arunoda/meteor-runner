var http = require('http');

//hijack http.createServer
var createServer = http.createServer;
http.createServer = function() {
  var server = createServer.apply(http, arguments);

  //hijack server.listen
  var listen = server.listen;
  server.listen = function() {
    hijackCallback(arguments, afterBound);
    listen.apply(server, arguments);
  };
  return server;
};

function afterBound() {
  var gid = process.env._METEOR_RUNNER_GID;
  var uid = process.env._METEOR_RUNNER_UID;

  if(gid) {
    process.setgid(gid);
    console.info(' >> stepping down to gid: ' + gid);
  }

  if(uid) {
    process.setuid(uid);
    console.info(' >> stepping down to uid: ' + uid);
  }

  delete process.env._METEOR_RUNNER_GID
  delete process.env._METEOR_RUNNER_UID;
}

function hijackCallback(args, callback) {
  var lastArg = args[args.length - 1];
  if(typeof(lastArg) == 'function') {
    args[args.length -1] = function() {
      lastArg.apply(null, arguments);
      callback();
    };
  } else {
    args.push(callback);
  }
}

require(process.env._METEOR_RUNNER_SCRIPT);
delete process.env._METEOR_RUNNER_SCRIPT;