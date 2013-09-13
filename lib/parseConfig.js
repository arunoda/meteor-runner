/*
  Parse config and fill it with the proper values from the ENV Variables
*/

function parseConfig(config) {
  for(var field in config) {
    var value = config[field];
    
    if(value === null || value === undefined || ['boolean', 'number'].indexOf(typeof(value)) >= 0) {
      continue;
    }

    if(typeof(value) == 'object') {
      parseConfig(value);
    }

    if(value[0] == '$') {
      config[field] = process.env[value.substring(1)];
    }
  }

  return config;
}

module.exports = parseConfig;

