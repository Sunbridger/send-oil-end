// import mock, { MockApplication } from 'egg-mock';
// import assert from 'power-assert';
// import { OilExchangeCodeModel } from '../../../app/model/oil_exchange_code';

describe('getVerifiedHistory()', () => {
//     let app: MockApplication;
//     before(() => {
//         app = mock.app();
//         return app.ready();
//     });
//     afterEach(mock.restore);

    //     it('user have not history ', async () => {
    //         let ctx = app.mockContext();
    //         ctx = app.mockContext({
    //             userDataB: {
    //                 shopCode: '01261719'
    //             }
    //         });
    //         const result = await ctx.service.toB.getVerifiedHistory({
    //             pageNo: 1,
    //             pageSize: 10
    //         }) as {
    //             totalNum: number;
    //             currentPage: number;
    //             list: OilExchangeCodeModel[];
    //         };
    //         assert(result);
    //         assert(result.totalNum === 0);
    //     });
    // });

    // describe('verifiedCode()', () => {
    //     let app: MockApplication;
    //     beforeEach(() => {
    //         app = mock.app();
    //         return app.ready();
    //     });
    //     /**
    //      * 获取 end - 2 个随机字符
    //      * @param {number} end 字符结束位置
    //      */
    //     const randomLetter = end =>
    //         Math.random()
    //             .toString(36)
    //             .substring(2, end);

    //     afterEach(mock.restore);
    //     it('核销码不存在', async () => {
    //         let ctx = app.mockContext();
    //         ctx = app.mockContext({
    //             userDataB: {
    //                 userPhone: '15800003333',
    //                 userId: 'LaM7ZYxocq',
    //                 shopCode: '002166'
    //             }
    //         });
    //         const result = await ctx.service.toB.verifiedCode({
    //             code: '1234wexc'
    //         });
    //         console.log(result);
    //         assert(result.code === 404);
    //     });
    //     it('不可在此门店核销', async () => {
    //         let ctx = app.mockContext();
    //         ctx = app.mockContext({
    //             userDataB: {
    //                 userPhone: '15800003333',
    //                 userId: 'LaM7ZYxocq',
    //                 shopCode: '002166'
    //             }
    //         });
    //         const result = await ctx.service.toB.verifiedCode({
    //             code: 'j1JvwmKl'
    //         });
    //         assert(result.code === 403);
    //     });
    //     it('核销成功', async () => {
    //         let ctx = app.mockContext();
    //         ctx = app.mockContext({
    //             userDataB: {
    //                 userPhone: '15800003333',
    //                 userId: 'LaM7ZYxocq',
    //                 shopCode: '002166'
    //             }
    //         });
    //         await ctx.service.test.cancelVirifiedCode('mFqk54lh');
    //         const result = await ctx.service.toB.verifiedCode({
    //             code: 'mFqk54lh'
    //         });
    //         assert(result.code === 200);
    //     });

    //     it('user have history ', async () => {
    //         let ctx = app.mockContext();
    //         ctx = app.mockContext({
    //             userDataB: {
    //                 userPhone: '15800003333',
    //                 userId: 'LaM7ZYxocq',
    //                 shopCode: '002166'
    //             }
    //         });
    //         const result = await ctx.service.toB.getVerifiedHistory({
    //             pageNo: 1,
    //             pageSize: 10
    //         }) as {
    //             totalNum: number;
    //             currentPage: number;
    //             list: OilExchangeCodeModel[];
    //         };
    //         console.log('user have history', result);
    //         assert(result);
    //         assert(result.totalNum === 1);
    //     });

    //     it('核销码已经被核销过了', async () => {
    //         let ctx = app.mockContext();
    //         ctx = app.mockContext({
    //             userDataB: {
    //                 userPhone: '15800003333',
    //                 userId: 'LaM7ZYxocq',
    //                 shopCode: '002166'
    //             }
    //         });
    //         const result = await ctx.service.toB.verifiedCode({
    //             code: 'eavpzYif'
    //         });
    //         assert(result.code === 308);
    //     });

    //     it('5分钟校验失败', async () => {
    //         let ctx = app.mockContext();
    //         ctx = app.mockContext({
    //             userDataB: {
    //                 userPhone: '15800003333',
    //                 userId: 'LaM7ZYxocq',
    //                 shopCode: '002166'
    //             }
    //         });
    //         const asyncLoop = async () => {
    //             const promiseList = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ].map(item => {
    //                 console.log(item);
    //                 return ctx.service.toB.verifiedCode({
    //                     code: randomLetter(10)
    //                 });
    //             });
    //             await Promise.all(promiseList);
    //         };
    //         await asyncLoop();
    //         console.log('888888888888888');
    //         const result = await ctx.service.toB.verifiedCode({
    //             code: randomLetter(10)
    //         });
    //         console.log(result, '4022222222222222');
    //         assert(result.code === 402);
    //     });

});
