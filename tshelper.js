'use strict';

const tshelper = require('@souche/blue-windy/tshelper');

module.exports = {
  watchDirs: {
    package: tshelper.package({ cwd: __dirname }),
    // errors: tshelper.errors({ cwd: __dirname }),

    // blue-windy-validator 配置
    // validator: require('@souche/blue-windy-validator/tshelper'),
    // blue-windy-sequelize 配置
    // model: require('@souche/blue-windy-sequelize/tshelper'),
  },
};
