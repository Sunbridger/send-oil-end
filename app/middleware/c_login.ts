/**
 * c端登录校验
 */
import { Context } from 'egg';
import { TokenEnum } from '../../config/const';

export default () => {
    return async (ctx: Context, next) => {
        const token = ctx.get(TokenEnum.c);
        if (!token) {
            throw new ctx.HttpError.BadRequest('没有登录', {
                code: '10000',
            });
        }
        const userData = await ctx.service.toC.getUserData(token);
        if (!userData.userId) {
            throw new ctx.HttpError.BadRequest('登录无效', {
                code: '10000',
            });
        }
        const userInfo = await ctx.model.OilUser.findByUserId(userData.userId);
        // ctx.logger.error('用户进入了:', token);
        // ctx.logger.error(userData);
        // ctx.logger.error(userInfo);
        if (!userInfo) {
            throw new ctx.HttpError.BadRequest('抱歉，不符合领取条件');
        }
        ctx.userData = userData;

        await next();
    };
};
