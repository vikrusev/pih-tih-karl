// import all configuration files
import ConfigModuleDev from './configuration/dev'
import ConfigModuleProd from './configuration/prod'

// choose the correct configuration to build
let configFactory: any = null;

switch (process.env.NODE_ENV) {
    case 'dev':
        configFactory = ConfigModuleDev;
        break;
    case 'prod':
        configFactory = ConfigModuleProd;
        break;
    default:
        configFactory = ConfigModuleDev;
        break;
}

// build and export
const configModule: Config = new configFactory();
export default configModule;