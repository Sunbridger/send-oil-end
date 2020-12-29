import { EggAppInfo, EggAppConfig, PowerPartial, Context } from 'egg';

export default (appInfo: EggAppInfo) => {
    const config = {} as PowerPartial<EggAppConfig>;

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1564971317076_4995';

    // dubbo接口调度
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
                '172.16.45.66:2181',
            ],
        },
    ];
    // add your config here
    config.middleware = [
        'soucheStdResp',
        // 'basicAuth',
        'apiResponse',
        'cLogin',
        'bLogin',
    ];

    // SoucheStdResp 搜车标准返回
    config.soucheStdResp = {};

    // BasicAuth 认证中间件
    // config.basicAuth = {
    //   accout: [
    //     'test:pass',
    //   ],
    // };

    config.cLogin = {
        match(ctx: Context) {
            const url = ctx.request.url;
            const matchArr: string[] = [
                '/api/toC',
            ];
            const ignoreArr: string[] = [
                '/api/toC/getActivityAndUserStatus',
                '/api/toC/getActivityTimeAndShops',
                '/api/toC/getUserData',
            ];
            return matchArr.find(reg => RegExp(reg).test(url)) &&
                !ignoreArr.find(reg => RegExp(reg).test(url));
        },
    };

    config.bLogin = {
        match: '/api/toB',
    };

    config.blueWindyValidator = {
        validateOptions: {
        },
    };

    config.cors = {
        credentials: true,
        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    };

    config.security = {
    // ！！！这是不正确的示范，调试用！！！
        csrf: {
            enable: false,
        },
        domainWhiteList: [
            '*.souche-inc.com',
            '*.dasouche-inc.net:*',
            '*.souche-inc.com:*',
            '*.tangeche.com',
            'http://172.18.*',
            'http://192.168.*',
        ],
    };

    return config;
};
