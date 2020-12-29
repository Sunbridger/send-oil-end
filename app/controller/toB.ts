import { Controller } from 'egg';

export default class ToBController extends Controller {
    /**
     * verifiedCode 核销 核销码接口
     * @api {post} /api/toB/verifiedCode
     * @param body.code
     */
    public async verifiedCode() {
        const { ctx, service } = this;
        const { body } = ctx.request;
        ctx.validate({
            code: { type: 'string', required: true, max: 8 }
        }, body);
        ctx.body = await service.toB.verifiedCode(body.code);
    }

    /**
     * getVerifiedHistory 店铺获取核销记录
     * @api {get} /api/toB/getVerifiedHistory
     * @param query.pageNo
     * @param query.pageSize
     */
    public async getVerifiedHistory() {
        const { ctx, service } = this;
        const { query } = ctx;
        ctx.validate({
            pageSize: { type: 'string', required: true, max: 2 },
            pageNo: { type: 'string', required: true, max: 2 }
        }, query);
        ctx.body = await service.toB.getVerifiedHistory({
            pageNo: +query.pageNo,
            pageSize: +query.pageSize
        });
    }

    // /**
    //  * getExcel定时任务获取Excel Data
    //  */
    // public async getExcelData() {
    //     const { ctx } = this;
    //     const { query } = ctx;
    //     // ctx.validate({
    //     //     startTime: { type: 'string', required: true },
    //     //     endTime: { type: 'string', required: false }
    //     // }, query);
    //     ctx.body = await this.service.schedule.getExcelData(query);
    // }

    // /**
    //  * getExcel定时任务获取Excel Data
    //  */
    // public async getExcel() {
    //     const { ctx } = this;
    //     // ctx.validate({
    //     //     startTime: { type: 'string', required: true },
    //     //     endTime: { type: 'string', required: false }
    //     // }, query);
    //     ctx.response.set('content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    //     ctx.status = 200;
    //     const result = await this.service.schedule.getExcel(ctx.query);
    //     ctx.res.end(result);
    // }
}
