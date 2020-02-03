let configFactory = null;

switch (process.env.NODE_ENV) {
    case 'dev':
        configFactory = require('./configuration/dev');
        break;
    case 'prod':
        configFactory = require('./configuration/prod');
        break;
    default:
        configFactory = require('./configuration/dev');
        break;
}

const confModule = configFactory();
module.exports = confModule;