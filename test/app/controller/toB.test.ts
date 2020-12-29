
// import assert from 'assert';
import mock, { MockApplication } from 'egg-mock';
// import { Context } from 'egg';
// import assert from 'power-assert';
import { TokenEnum } from '../../../config/const';

describe('test/app/controller/toB.test.ts', () => {
    let app: MockApplication;
    beforeEach(async () => {
        app = mock.app();
        await app.ready();
    });

    it('should status 200 and get the body', () => {
        return app.httpRequest()
            .post('/api/toB/verifiedCode')
            .send({
                code: 'mFqk54lh'
            })
            .set('Cookie', [`${TokenEnum.b}=04_G5Nx_LaM7ZYxocq`])
            .expect(201)
            .expect({
                "success": true,
                "code": 201,
                "msg": "success",
                "data": {
                    "msg": '核销成功',
                    "code": 200,
                    "status": false
                }
            });
    });
    it('should status 400, 没有登录', () => {
        return app.httpRequest()
            .post('/api/toB/verifiedCode')
            .send({
                code: 'mFqk54lh'
            })
            .expect(400)
            .expect({
                "success": false,
                "code": 400,
                "status": 400,
                "msg": "没有登录token",
                "data": {
                    "msg": '没有登录'
                }
            });
    });

    it('should status 400, 登录验证失败', () => {
        return app.httpRequest()
            .post('/api/toB/verifiedCode')
            .send({
                code: 'mFqk54lh'
            })
            .set('Cookie', [`${TokenEnum.b}=7ZYxocq`])
            .expect(400)
            .expect({
                "success": false,
                "code": 400,
                "status": 400,
                "msg": "登录验证失败",
                "data": {
                    "msg": '登录验证失败'
                }
            });
    });

    // TODO: error
    // it('should status 404 and 核销码不存在', () => {
    //     return app.httpRequest()
    //         .post('/api/toB/verifiedCode')
    //         .send({
    //             code: 'm23k54lp'
    //         })
    //         .set('Cookie', [`${TokenEnum.b}=04_G5Nx_LaM7ZYxocq`])
    //         .expect(201)
    //         .expect({
    //             "success": true,
    //             "code": 201,
    //             "msg": "success",
    //             "data": {
    //                 "msg": '核销成功',
    //                 "code": 200,
    //                 "status": false
    //             }
    //         });
    // });
    it('/api/toB/getVerifiedHistory', () => {
        return app.httpRequest()
            .get('/api/toB/getVerifiedHistory')
            .query({
                pageSize: '10',
                pageNo: '1'
            })
            .set('Cookie', [`${TokenEnum.b}=04_G5Nx_LaM7ZYxocq`])
            .expect(200)
            .expect({
                "success": true,
                "code": 200,
                "msg": "success",
                "data": {
                    "totalNum": 1,
                    "currentPage": 1,
                    "list": [
                        {
                            "code": "eavpzYif",
                            "verify_time": "2019-08-08T03:26:47.000Z"
                        }
                    ]
                }
            });
    })
    // describe('test /api/toB/verifiedCod', () => {
    // })
});