module.exports = config => {
  config.addPassthroughCopy("assets");

  return {
    dir: {
      input: 'src',
      output: 'dist'
    }
  };
};
