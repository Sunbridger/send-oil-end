
import { Controller } from 'egg';

export default class HomeController extends Controller {
    /**
     * 生成用户
     * @api {post} /api/report/excel
     * @param body.users [{ userId, iid, orderStatus, shopCode }]
     */
    public async excel() {
        const { app, ctx, service } = this;
        const { startTimestamp: activityStartTimestamp, endTimestamp: activityEndTimestamp } = app.activityInfo;

        const body = ctx.request.body;
        ctx.validate({
            password: { type: 'string' },
        }, body);

        const { password, startTimestamp = activityStartTimestamp, endTimestamp = activityEndTimestamp } = body;

        if (password !== 'IVlcrasdfeMYsuaB0') {
            throw new ctx.HttpError.BadRequest('秘钥错误');
        }

        const url = await service.schedule.uploadExcel({
            startTimestamp: +startTimestamp,
            endTimestamp: +endTimestamp
        });

        ctx.body = url;
    }

    // public async sendEmail() {
    //     this.ctx.body = await this.app.runSchedule('uploadExcel');
    // }
}
