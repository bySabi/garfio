const webpack = require('webpack');

const isProd = (process.env.NODE_ENV || 'production') === 'production';

const assetPrefix = isProd ? '/garfio' : '';

module.exports = {
  exportPathMap: () => ({
    '/': { page: '/' },
    '/counter': { page: '/counter' },
    '/counterNested': { page: '/counterNested' },
    '/counters10x40': { page: '/counters10x40' },
  }),
  assetPrefix: assetPrefix,
};
