const isProd = (process.env.NODE_ENV || 'production') === 'production';

module.exports = { 'process.env.BACKEND_URL': isProd ? '/garfio' : '' };
