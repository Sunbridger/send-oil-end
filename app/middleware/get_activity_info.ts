/**
 * 测试环境修改活动信息用
 */
import { Context } from 'egg';
import { OilActivityModel } from '../model/oil_activity';

export default () => {
    return async (ctx: Context, next) => {
        const activityInfo = await ctx.model.OilActivity.findOne({
            where: {
                name: 'send_oil'
            }
        }) as OilActivityModel;
        const {
            name,
            status,
            startTime,
            endTime,
            maxNum,
        } = activityInfo;

        const startTimestamp = startTime.getTime();
        const endTimestamp = endTime.getTime();

        ctx.app.activityInfo = {
            name,
            status,
            startTime,
            startTimestamp,
            endTime,
            endTimestamp,
            maxNum
        };
        // if (activityInfo) {
        //     const {
        //         name,
        //         status,
        //         startTime,
        //         endTime,
        //         maxNum,
        //     } = activityInfo;

        //     const startTimestamp = startTime.getTime();
        //     const endTimestamp = endTime.getTime();

        //     ctx.app.activityInfo = {
        //         name,
        //         status,
        //         startTime,
        //         startTimestamp,
        //         endTime,
        //         endTimestamp,
        //         maxNum
        //     };
        // } else {
        //     ctx.app.activityInfo = {
        //         name: 'send_oil',
        //         status: 1,
        //         startTime: new Date('2019/10/16 00:00:00'),
        //         startTimestamp: 1571155200000,
        //         endTime: new Date('2019/11/30 23:59:59'),
        //         endTimestamp: 1575129599000,
        //         maxNum: 12000
        //     };
        // }
        await next();
    };
};
