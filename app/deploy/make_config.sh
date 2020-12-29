#!/usr/bin/env node
'use strict';
/**
 * plusman created at 2017-12-12 18:39:58
 *
 * Copyright (c) 2017 Souche.com, all rights
 * reserved
 */

const ENV = process.env.CONFIG_ENV;
const FILE_SUFFIX = process.env.FILE_SUFFIX || ENV;
const APP = process.env.APP;
const CLUSTER = process.env.CLUSTER;
const NAMESPACE = process.env.NAMESPACE;
const fs = require('fs');

const ConfigPorter = require('@souche/config-porter');
const nodeConfigSdk = new ConfigPorter({
  app: APP,
  env: ENV,
  version: 'v2'
});

// 写入环境变量
fs.writeFileSync('config/env', FILE_SUFFIX, {
  encoding: 'utf8',
});

async function __main() {
  const config = await nodeConfigSdk.fetch();
  fs.writeFileSync(
    `config/config.${FILE_SUFFIX}.ts`,
    await creatMain(config));
  console.log(`ENV#${ENV} config file has been generated successfully!`);
}

function creatMain (config){
    console.log(typeof config);
    let str = `
import { EggAppConfig, PowerPartial } from 'egg';

export default () => {

    const config = {} as PowerPartial<EggAppConfig>;
    `;

    for(var i in config) {

        str += `
    config.${i} = ${JSON.stringify(config[i], null, 4)};
    `;
    }

    str += `
    return config;
};`;

    return str;
}

__main();