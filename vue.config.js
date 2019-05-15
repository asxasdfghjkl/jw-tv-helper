module.exports = {
  productionSourceMap: false,
  css: {
    extract: false
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.output.filename = 'js/[name].js';
      delete config.optimization.splitChunks;
    }
  }
}