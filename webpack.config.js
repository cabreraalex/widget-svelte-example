const path = require('path');
const version = require('./package.json').version;

// Custom webpack rules
const rules = [
  {
    test: /\.svelte$/,
    loader: 'svelte-loader',
  },
  { test: /\.ts$/, loader: 'ts-loader' },
  { test: /\.js$/, loader: 'source-map-loader' },
  { test: /\.css$/, use: ['style-loader', 'css-loader'] },
];

// Packages that shouldn't be bundled but loaded at runtime
const externals = ['@jupyter-widgets/base'];

const resolve = {
  alias: {
    svelte: path.resolve('node_modules', 'svelte'),
  },
  // Add '.ts' and '.tsx' as resolvable extensions.
  extensions: ['.webpack.js', '.web.js', '.mjs', '.ts', '.js', '.svelte'],
  mainFields: ['svelte', 'browser', 'module', 'main'],
};

module.exports = [
  /** Lib - compile Typescript and Svelte files. */
  {
    entry: {
      plugin: './src/plugin.ts',
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'lib'),
      libraryTarget: 'amd',
    },
    module: {
      rules: rules,
    },
    devtool: 'source-map',
    externals,
    resolve,
  },
  /** Mock - server to test changes w/o building Jupyter */
  {
    entry: {
      bundle: ['./src/mock.ts'],
    },
    output: {
      path: path.resolve(__dirname, 'mock'),
      filename: 'bundle.js',
      publicPath: path.resolve(__dirname, 'mock'),
    },
    module: {
      rules: rules,
    },
    resolve,
    optimization: {
      minimize: false,
    },
  },
  /**
   * Notebook extension
   *
   * This bundle only contains the part of the JavaScript that is run on load of
   * the notebook.
   */
  {
    entry: './src/extension.ts',
    output: {
      filename: 'index.js',
      path: path.resolve(
        __dirname,
        'widget_svelte_example',
        'nbextension',
        'static'
      ),
      libraryTarget: 'amd',
    },
    module: {
      rules: rules,
    },
    devtool: 'source-map',
    externals,
    resolve,
  },

  /**
   * Embeddable widget-svelte-example bundle
   *
   * This bundle is almost identical to the notebook extension bundle. The only
   * difference is in the configuration of the webpack public path for the
   * static assets.
   *
   * The target bundle is always `dist/index.js`, which is the path required by
   * the custom widget embedder.
   */
  {
    entry: './src/index.ts',
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist'),
      libraryTarget: 'amd',
      library: 'widget-svelte-example',
      publicPath:
        'https://unpkg.com/widget-svelte-example@' +
        version +
        '/dist/',
    },
    devtool: 'source-map',
    module: {
      rules: rules,
    },
    externals,
    resolve,
  },

  /**
   * Documentation widget bundle
   *
   * This bundle is used to embed widgets in the package documentation.
   */
  {
    entry: './src/index.ts',
    output: {
      filename: 'embed-bundle.js',
      path: path.resolve(__dirname, 'docs', 'source', '_static'),
      library: 'widget-svelte-example',
      libraryTarget: 'amd',
    },
    module: {
      rules: rules,
    },
    devtool: 'source-map',
    externals,
    resolve,
  },
];
