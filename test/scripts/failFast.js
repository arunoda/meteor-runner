if(!process.env.ALLOW) {
  return;
}
throw new Error('failing fast');