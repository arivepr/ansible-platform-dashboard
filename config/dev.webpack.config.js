const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  debug: true,
  useFileHash: false,
  sassPrefix: '.ansible-dashboard, .ansibleDashboard',
  deployment: process.env.BETA ? 'beta/apps' : 'apps',
  useProxy: true,
  localChrome: '/Users/hq/SoftwareDev/arivepr/insights-chrome/build/',
  appUrl: process.env.BETA ? '/beta/ansible/ansible-dashboard' : '/ansible/ansible-dashboard',
  env: process.env.BETA ? 'stage-beta' : 'stage-stable',
});

plugins.push(
  require('@redhat-cloud-services/frontend-components-config/federated-modules')({
    root: resolve(__dirname, '../'),
    useFileHash: false
  })
);

module.exports = {
  ...webpackConfig,
  plugins
};
