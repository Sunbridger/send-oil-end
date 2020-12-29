import { Controller } from 'egg';
import { TokenEnum } from '../../config/const';

export default class ToCController extends Controller {
    /**
     * 获取活动及用户状态
     * @api {get} /api/toC/getActivityTimeAndShops
     */
    public async getActivityTimeAndShops() {
        const { ctx, service } = this;
        ctx.body = await service.toC.getActivityTimeAndShops();
    }

    /**
     * 获取活动及用户状态
     * @api {get} /api/toC/getActivityAndUserStatus
     */
    public async getActivityAndUserStatus() {
        const { ctx, service } = this;
        ctx.body = await service.toC.getActivityAndUserStatus();
    }

    /**
     * 生成核销码
     * @api {post} /api/toC/generateCode
     */
    public async generateCode() {
        const { ctx, service } = this;
        const body = ctx.request.body;
        const rules = {
            inApp: 'boolean',
        };
        ctx.validate(rules, body);
        ctx.body = await service.toC.generateCode(body.inApp);
    }

    /**
     * 获取核销码
     * @api {get} /api/toC/getCode
     */
    public async getCode() {
        const { ctx, service } = this;
        ctx.body = await service.toC.getCode();
    }

    /**
     * 获取用户信息
     * @api {get} /api/toC/getUserData
     */
    public async getUserData() {
        const { ctx, service } = this;
        const token = ctx.get(TokenEnum.c);
        const { iid, userId, userPhone } = await service.toC.getUserData(token);
        ctx.body = {
            iid,
            userId,
            userPhone,
        };
    }
}
