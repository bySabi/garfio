const webpack = require('webpack');

const PREFIX = '/garfio';

module.exports = {
  exportPathMap: () => ({
    '/': { page: '/' },
    '/counter': { page: '/counter' },
    '/counterNested': { page: '/counterNested' },
    '/counters10x40': { page: '/counters10x40' },
  }),
  assetPrefix: PREFIX,
};
