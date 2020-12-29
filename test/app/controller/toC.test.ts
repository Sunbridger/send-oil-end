import { app } from 'egg-mock/bootstrap';
import assert from 'power-assert';
import { TokenEnum } from '../../../config/const';

describe('/api/toC/getActivityTimeAndShops', () => {
    it('GET', async () => {
        const result = await app.httpRequest()
            .get('/api/toC/getActivityTimeAndShops');
        const resultData = result.body.data;

        const shops = await app.model.OilShopBrief
            .findAll()
            .then(res => res.map(shop => {
                const {
                    shopName,
                    address,
                    city,
                    tel,
                } = shop;
                return {
                    shopName,
                    address,
                    city,
                    tel,
                };
            }));

        // TODO: 从app.activityInfo中获取
        const { startTime, endTime } = app.config.activityInfo;

        assert.deepEqual(resultData, {
            maxNum: app.config.activityInfo.maxNum,
            activityStartTime: new Date(startTime).getTime(),
            activityEndTime: new Date(endTime).getTime(),
            allShopList: shops,
        });
    });
});


describe('/api/toC/getActivityAndUserStatus', () => {
    let remainStatus;
    let activityStartTime;
    let activityEndTime;

    before(async () => {
        // TODO: 从app.activityInfo中获取
        const { maxNum, startTime, endTime } = app.config.activityInfo;
        activityStartTime = new Date(startTime).getTime();
        activityEndTime = new Date(endTime).getTime();
        const exchangeNum = await app.model.OilExchangeCode.count();
        remainStatus = exchangeNum < maxNum ? 1 : 0;
    });

    it('没有登录', async () => {
        const result = await app.httpRequest()
            .get('/api/toC/getActivityAndUserStatus');
        const resultData = result.body.data;

        assert.deepEqual(resultData, {
            activityStartTime,
            activityEndTime,
            remainStatus,
        });
    });

    it('登录, 非目标用户', async () => {
        app.mockService('toC', 'getUserData', token => {
            assert(token);
            return {
                userId: '1',
            };
        });

        const result = await app.httpRequest()
            .get('/api/toC/getActivityAndUserStatus')
            .set('Cookie', [ `${TokenEnum.c}=token` ]);
        const resultData = result.body.data;

        assert.deepEqual(resultData, {
            activityStartTime,
            activityEndTime,
            remainStatus,
            isTargetUser: false,
        });
    });

    it('登录, 目标用户 - 没有余量', async () => {
        app.mockService('toC', 'getUserData', token => {
            assert(token);
            return {
                userId: 'r040CaRORp',
            };
        });

        const result = await app.httpRequest()
            .get('/api/toC/getActivityAndUserStatus')
            .set('Cookie', [ `${TokenEnum.c}=r040CaRORp` ]);
        const resultData = result.body.data;

        console.log(resultData);
    });
});
