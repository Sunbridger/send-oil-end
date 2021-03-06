import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
    const config = {} as PowerPartial<EggAppConfig>;
    config.zk = [
        {
            authInfo: [
                {
                    schema: 'digest',
                    auth: 'read:souche-read',
                },
            ],
            host: 'stable.zk.scsite.net:2181',
        },
    ];
    config.sequelize = {
        dialect: 'mysql',
        host: '172.17.40.212',
        port: 3306,
        username: 'root',
        password: 'root',
        define: {
            timestamps: false,
            freezeTableName: true,
            underscored: true,
        },
        timezone: '+08:00',
        database: 'oil',
    };

    config.middleware = [
        'soucheStdResp',
        'apiResponse',
        'getActivityInfo',
        'cLogin',
        'bLogin',
    ];

    config.zkCSso = [
        {
            host: 'stable.zk.scsite.net:2181',
            authInfo: [
                {
                    schema: 'digest',
                    auth: 'read:souche-read',
                },
            ],
        },
    ];

    config.activityUrls = {
        index: 'http://172.18.14.172:8111/activity',
    };

    // 消息推送
    config.pushInfo = {
        url: 'http://msgcenter.dasouche.net/v1/channel/jpush',
        account: 'givingOil:lKVvE0caihVB5EBITZQyctPzpG0tOOPi',
    };

    // 发送短信
    config.sendSmsInfo = {
        url: 'http://msgcenter-sms.prepub.souche-inc.com/v2/channel/sms',
        account: 'shekai01:5vhuzpa8if65cfzeg4nfidpf14b8ragl',
    };

    return config;
};
