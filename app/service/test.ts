/**
 * 用于测试和模拟数据的接口
 */
import { Service } from 'egg';
import { OilUserModel } from '../model/oil_user';
import { CodePlatformEnum } from '../model/oil_exchange_code';

/**
 * createGenerateCode 生成多跳领取记录
 */
export default class TestService extends Service {
    /**
     * 模拟用户获取核销码操作
     */
    async mockGetCode(pageNo: number) {
        const userIdList = await this.getUserIdList(pageNo);
        console.log(userIdList, 'user id list');
        userIdList.forEach(element => {
            this.createGenerateCode(element);
        });
        console.log(this.createGenerateCode);
    }

    /**
     * 模拟批量核销核销码
     * @param pageNo number
     */
    async mockVerifiedCodeList(pageNo: number) {
        const codeList = await this.getCodeList(pageNo);
        codeList.map(item => this.mockVerifiedCode(item));
    }

    /**
     * 取消核销状态： 单测使用
     * @param code 核销码
     */
    async cancelVirifiedCode(code?: string) {
        const { model, logger } = this.ctx;
        if (!code) { return; }
        // 确认存在后，再更新数据库信息
        const { count, rows } = await model.OilExchangeCode.findAndCountAll({
            where: {
                code
            }
        });
        const row = count ? rows[0].dataValues : {
            allowShopCode: '',
            verified: 0
        };
        if (count && row.verified) {
            await model.OilExchangeCode.update({
                verified: 0,
                verifierId: null,
                verifyShopCode: null,
                verifyTime: null
            }, {
                where: {
                    code
                }
            });
        } else {
            logger.info('没有核销code');
        }
    }

    private async getCodeList(pageNo: number) {
        const { model } = this.ctx;
        const codeList = await model.OilExchangeCode.findAll({
            limit: 20,
            offset: 20 * pageNo + 4
        });
        const resultList = codeList.map(item => item.dataValues.code);
        return resultList;
    }

    /**
     * 核销一条信息
     * @param code number
     */
    private async mockVerifiedCode(code) {
        const { model } = this.ctx;
        const userDataB = {
            userPhone: '15800003333',
            userId: 'LaM7ZYxocq',
            shopCode: '002166'
        };
        await model.OilExchangeCode.update({
            verified: 1,
            verifierId: userDataB.userId,
            verifyShopCode: userDataB.shopCode,
            verifyTime: new Date()
        }, {
            where: {
                code
            }
        });
    }

    /**
     * 获取用户id list
     */
    private async getUserIdList(pageNo: number) {
        const { model } = this.ctx;
        const rows = await model.OilUser.findAll({
            where: {
                orderStatus: 1
            },
            offset: pageNo,
            limit: 20 * pageNo
        });
        const result = rows.map(item => item.dataValues.userId);
        return result;
    }

    /**
     * 获取核销码
     * @param userId Number
     */
    private async createGenerateCode(userId) {
        const { model } = this.ctx;
        const userInfo = await model.OilUser.findByUserId(userId) as OilUserModel;
        console.log(userInfo, 'user info');
        await model.OilExchangeCode.create({
            userId,
            code: userInfo.code,
            allowShopCode: userInfo.allowShopCode,
            platform: CodePlatformEnum.app,
        });
    }
}
