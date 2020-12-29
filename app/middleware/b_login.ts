/**
 * b端登录校验
 */
// import Dusbo from '@souche/node-dubbo-client';
// import { compareAsc, compareDesc } from 'date-fns';
import { Context } from 'egg';
import { TokenEnum } from '../../config/const';

export default () => {
    return async (ctx: Context, next) => {
        const token = ctx.get(TokenEnum.b);
        if (!token) {
            throw new ctx.HttpError.BadRequest('没有登录');
        }
        const userData = await ctx.service.toB.getUserData(token);
        if (!userData.userId) {
            throw new ctx.HttpError.BadRequest('登录无效');
        }
        // const userInfo = await ctx.model.OilShopBrief.findByShopCode(userData.shopCode);
        // if (!userInfo) {
        //     throw new ctx.HttpError.BadRequest('抱歉，非本次活动店铺');
        // }
        ctx.userDataB = userData;

        await next();
        // const token = ctx.get(TokenEnum.b);
        // const dusbo = new Dusbo({
        //     zk: ctx.app.config.zk,
        //     service: 'com.souche.sso.service.TokenService', // 填写你需要的服务名
        // });
        // // 验证活动是否过期
        // const { startTime, endTime } = ctx.app.activityInfo;
        // console.log(token, 'token');
        // // TODO: 判断活动日期
        // // const now = new Date(2019, 7, 16, 0, 0, 0);
        // const now = new Date();
        // const copmpare1 = compareDesc(
        //     now,
        //     new Date(startTime)
        // );
        // const copmpare2 = compareAsc(
        //     now,
        //     new Date(endTime)
        // );
        // console.log(now, 'now', copmpare1, 'copmpare1', copmpare2, 'copmpare2', new Date(startTime), now, new Date(endTime));
        // if (copmpare1 === 1 || copmpare2 === 1) {
        //     ctx.logger.error('不在活动时间');
        //     throw new ctx.HttpError.BadRequest('不在活动时间', {
        //         msg: '不在活动时间内',
        //     });
        // }
        // // 验证是否有token
        // if (!token) {
        //     ctx.logger.error('没有登录,无法获取到token');
        //     throw new ctx.HttpError.BadRequest('没有登录token', {
        //         msg: '没有登录',
        //     });
        // }
        // // 发送请求校验token是否有效
        // let result;
        // try {
        //     result = await dusbo.send('getAuthZ', { token }, {});
        // } catch (error) {
        //     ctx.logger.error(error);
        //     ctx.logger.error('dusbo接口失败');
        //     throw new ctx.HttpError.BadRequest('dusbo接口失败', {
        //         msg: '登录校验失败',
        //     });
        // }
        // if (!result || !result.body) {
        //     ctx.logger.error('登录验证失败');
        //     throw new ctx.HttpError.BadRequest('登录验证失败', {
        //         msg: '登录验证失败, 请重新登录',
        //     });
        // }
        // ctx.userDataB = {
        //     userPhone: result.body.userPhone,
        //     shopCode: result.body.shopCode,
        //     userName: result.body.userName,
        //     userId: result.body.userId,
        // };
        // ctx.logger.error('用户进入了B端:', token);
        // ctx.logger.error(ctx.userDataB);
        // await next();
    };
};
