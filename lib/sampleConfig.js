module.exports = {
  "script": "[location of the nodejs script]", //required
  "instances": "auto", //only supports one at this moment

  "foreverOptions": { //optional
    "command": "location of the custom command",
    "silent": false,
    "spinSleepTime": 2000,
  },

  "instanceOptions": { //options when spawning an instance
    "uid": "user",
    "gid": "group"
  },

  "monitors": { //add monitors
    "ping": {
      "port": 80, //port for 
      "interval": 2000, //internal for ping check
      "threshold": 5, //threshold for consider an unreachable port
      "timeout": 500 //timeout for the http request
    }
  },

  "monitorOptions": { //not implemented yet
    "startOnMessage": "END_MIGRATIONG", //only start monitoring after process send the given message,
    "startOnStdout": "LISTENING", //only start monitoring if the given message printed on the stdout
  },

  "waitForMongo": {
    "url": "mongodb://localhost/tele"
  }
}