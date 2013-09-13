if(!process.env.ALLOW) {
  return;
}

setTimeout(function() {
  console.log('hello');
}, 1000 * 3600 * 24); 