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
        database: 'oil-test',
    };

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

    return config;
};
