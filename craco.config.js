const webpack = require("webpack");
const path = require("path");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Configure resolve fallbacks for Node.js modules
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        buffer: require.resolve("buffer"),
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        util: require.resolve("util"),
        path: require.resolve("path-browserify"),
        url: require.resolve("url"),
        os: require.resolve("os-browserify/browser"),
        assert: require.resolve("assert"),
        events: require.resolve("events"),
        // Set Node.js built-in modules to false to ignore them
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        worker_threads: false,
        module: false,
        inspector: false,
        perf_hooks: false,
        async_hooks: false,
        cluster: false,
        dgram: false,
        dns: false,
        http2: false,
        repl: false,
        readline: false,
      };

      // Add plugin to ignore Node.js modules with node: prefix
      webpackConfig.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^node:/,
        })
      );

      // Add DefinePlugin for process.env if not already present
      const hasDefinePlugin = webpackConfig.plugins.some(
        (plugin) => plugin.constructor.name === "DefinePlugin"
      );

      if (!hasDefinePlugin) {
        webpackConfig.plugins.push(
          new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(
              process.env.NODE_ENV || "development"
            ),
            "process.version": JSON.stringify(process.version),
            "process.browser": "true",
          })
        );
      }

      return webpackConfig;
    },
  },
};
