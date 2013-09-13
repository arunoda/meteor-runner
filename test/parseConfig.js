var assert = require('assert');
var parseConfig = require('../lib/parseConfig');

suite('ParseConfig', function() {
  test('numbers and booleans', function() {
    var config = {a: 10, b: true};
    parseConfig(config);
    assert.deepEqual(config, {a: 10, b: true});
  });

  test('null and undefined', function() {
    var config = {a: null, b: undefined};
    parseConfig(config);
    assert.deepEqual(config, {a: null, b: undefined});
  });

  test('string without varibles', function() {
    var config = {a: "hello", b: "by"};
    parseConfig(config);
    assert.deepEqual(config, {a: "hello", b: "by"});
  });

  test('strings with varibles', function() {
    process.env.ABC="hi";
    process.env.BBC="by";

    var config = {a: "$ABC", b: "$BBC"};
    parseConfig(config);
    assert.deepEqual(config, {a: "hi", b: "by"});
  });

  test('nested objects', function() {
    process.env.ABC="hi";
    process.env.BBC="by";

    var config = {a: "$ABC", k: {b: "$BBC"}};
    parseConfig(config);
    assert.deepEqual(config, {a: "hi", k: {b: "by"}});
  });

  test('nested array', function() {
    process.env.ABC="hi";
    process.env.BBC="by";

    var config = {k: {b: "$BBC", c: ['$ABC', '$BBC']}};
    parseConfig(config);
    assert.deepEqual(config, {k: {b: "by", c: ['hi', 'by']}});
  });
});