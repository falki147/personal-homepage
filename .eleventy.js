module.exports = config => {
  config.addPassthroughCopy("assets");
  config.addPassthroughCopy("demo");

  return {
    dir: {
      input: 'src/html',
      output: 'dist'
    }
  };
};
