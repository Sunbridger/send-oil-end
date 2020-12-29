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
            host: [
                '10.172.201.230:2181',
                '10.252.102.191:2181',
                '10.161.209.49:2181',
                '172.16.45.65:2181',
                '172.16.45.66:2181'
            ],
        },
    ];
    config.sequelize = {
        dialect: 'mysql',
        host: 'rm-bp1sc6y9ivrcnq2co.mysql.rds.aliyuncs.com',
        port: 3306,
        username: 'oil_rw',
        password: 'r4nVfCkxjlkey6Wo',
        define: {
            timestamps: false,
            freezeTableName: true,
            underscored: true,
        },
        timezone: '+08:00',
        database: 'oil',
    };

    config.zkCSso = [
        {
            host: [
                '10.172.201.230:2181',
                '10.252.102.191:2181',
                '10.161.209.49:2181',
                '172.16.45.65:2181',
                '172.16.45.66:2181'
            ],
            authInfo: [
                {
                    schema: 'digest',
                    auth: 'read:souche-read',
                },
            ],
        },
    ];

    config.activityUrls = {
        index: 'https://send-oil-front-marketing.tangeche.com/activity',
    };

    // 消息推送
    config.pushInfo = {
        url: 'http://172.16.87.95:81/v1/channel/jpush',
        account: 'givingOil:xujwh9JkSCCsWXIKxAmPwKlb5D6gc5KJ',
    };

    // 发送短信
    config.sendSmsInfo = {
        url: 'http://172.16.81.77:82/v2/channel/sms',
        account: 'shekai01:5vhuzpa8if65cfzeg4nfidpf14b8ragl',
    };

    return config;
};
