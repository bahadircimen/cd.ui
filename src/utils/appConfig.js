/** Environment Files */
const development = require('../../configs/development.config.js');
const qa = require('../../configs/qa.config.js');
const prod = require('../../configs/production.config.js');
const preprod = require('../../configs/preprod.config.js');

const env = (window.HBConfig || {}).NODE_ENV || 'development';
const configType = {
    development,
    qa,
    prod,
    preprod
};

module.exports = configType[env];