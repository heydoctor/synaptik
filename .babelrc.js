const { BABEL_ENV, NODE_ENV } = process.env;
const cjs = BABEL_ENV === 'cjs' || NODE_ENV === 'test';

module.exports = {
  comments: false,
  presets: [
    [
      'env',
      {
        modules: false,
        loose: true,
        targets: {
          browsers: ['last 1 version'],
        },
      },
    ],
    'react',
  ],
  plugins: [
    'transform-object-rest-spread',
    'transform-class-properties',
    cjs && 'transform-es2015-modules-commonjs',
  ].filter(Boolean),
};
