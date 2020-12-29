import { Controller } from 'egg';
import randomString from 'random-string';
import { getCodes } from '../../bin/init/utils';
import { CodeVerifiedEnum } from '../model/oil_exchange_code';

export default class TestController extends Controller {
    /**
     * 生成用户
     * @api {post} /api/test/genUser
     * @param body.users [{ userId, iid, orderStatus, shopCode }]
     */
    public async genUser() {
        const { ctx } = this;
        const { model } = ctx;

        const body = ctx.request.body;
        ctx.validate({
            users: {
                type: 'array',
                rule: {
                    userId: 'string',
                    iid: 'string',
                    orderStatus: {
                        type: 'enum',
                        values: [ 0, 1 ],
                    },
                    shopCode: 'string',
                },
            },
        }, body);

        const list = body.users.map(item => {
            const { userId, iid, orderStatus, shopCode, city = '杭州' } = item;
            return {
                userId,
                iid,
                city,
                orderStatus,
                orderNum: randomString({ length: 12 }),
                allowShopCode: orderStatus === 0 ? shopCode : '1',
                originalShopCode: shopCode,
                companyCode: 'company_code',
            };
        });

        async function tryCreate(user) {
            try {
                const userInfo = await model.OilUser.findByUserId(user.userId);
                if (userInfo) {
                    return false;
                }
                user.code = randomString({ length: 8 });
                await model.OilUser.create(user);
            } catch (e) {
                await tryCreate(user);
            }
        }

        for (const user of list) {
            await tryCreate(user);
        }

        ctx.body = '添加成功';
    }

    /**
     * 重置用户领取及核销信息
     * @api {post} /api/test/resetUser
     * @param body.userId
     */
    public async resetUser() {
        const { ctx } = this;
        const { model } = ctx;

        const body = ctx.request.body;
        ctx.validate({
            userId: 'string',
        }, body);

        const userId = body.userId;

        // 删除领取记录/核销记录
        await model.OilExchangeCode.destroy({
            where: {
                userId,
            },
        });

        ctx.body = '重置成功';
    }

    /**
     * 删除用户信息
     * @api {post} /api/test/delUser
     * @param body.userIds
     */
    public async delUser() {
        const { ctx, app } = this;
        const { model } = ctx;

        const body = ctx.request.body;
        ctx.validate({
            userIds: {
                type: 'array',
                itemType: 'string',
            },
        }, body);

        const userIds = body.userIds;

        const transaction = await model.transaction();

        try {
            const Op = app.Sequelize.Op;
            await model.OilExchangeCode.destroy({
                where: {
                    userId: {
                        [Op.in]: userIds,
                    },
                },
                transaction,
            });
            await model.OilUser.destroy({
                where: {
                    userId: {
                        [Op.in]: userIds,
                    },
                },
                transaction,
            });
            await transaction.commit();
            ctx.body = 'success';
        } catch (e) {
            await transaction.rollback();
            ctx.body = 'fail';
        }
    }

    /**
     * 生成门店信息
     * @api {post} /api/test/genShop
     * @param body.shopName
     * @param body.shopCode
     */
    public async genShop() {
        const { ctx } = this;
        const { model } = ctx;

        const body = ctx.request.body;

        ctx.validate({
            shopName: 'string',
            shopCode: 'string',
        }, body);

        const { shopName, shopCode } = body;

        await model.OilShopBrief.create({
            shopName,
            city: '杭州',
            address: `浙江省杭州市余杭区五常大道${Math.ceil(Math.random() * 10)}`,
            tel: '13750897532',
            shopCode,
            companyCode: 'company_code',
        });

        ctx.body = 'success';
    }

    /**
     * 删除门店信息
     * @api {post} /api/test/delShop
     * @param body.shopCode
     */
    public async delShop() {
        const { ctx } = this;
        const { model } = ctx;

        const body = ctx.request.body;

        ctx.validate({
            shopCode: 'string',
        }, body);

        const shopCode = body.shopCode;

        await model.OilShopBrief.destroy({
            where: {
                shopCode,
            },
        });

        ctx.body = 'success';
    }

    /**
     * 生成批量指定门店的用户，领取且核销
     * @api {post} /api/test/bulkData
     * @param body.num
     * @param body.shopCode
     */
    public async bulkData() {
        const { ctx } = this;
        const { model } = ctx;

        const body = ctx.request.body;

        ctx.validate({
            num: 'number',
            shopCode: 'string'
        }, body);

        const { num, shopCode } = body;

        const currentUsers = await model.OilUser.findAll();
        const currentCodes = await currentUsers.map(user => user.code);

        const users = getCodes(num, currentCodes).map(code => {
            return {
                userId: `test:${code}`,
                iid: code,
                city: '杭州',
                orderStatus: 0,
                orderNum: code,
                allowShopCode: shopCode,
                originalShopCode: shopCode,
                companyCode: 'company_code',
                code,
            };
        });

        const exchangeds = users.map(user => {
            const { userId, code, allowShopCode } = user;
            return {
                userId,
                code,
                allowShopCode,
                platform: 'h5',
                verified: 1,
                verifierId: 'verifier_id',
                verifyShopCode: shopCode,
                verifyTime: new Date(),
            };
        });

        const transaction = await model.transaction();

        try {
            await model.OilUser.bulkCreate(users, {
                transaction,
            });
            await model.OilExchangeCode.bulkCreate(exchangeds, {
                transaction,
            });
            await transaction.commit();
            ctx.body = 'success';
        } catch (e) {
            await transaction.rollback();
            ctx.body = 'fail';
        }
    }

    /**
     * 批量删除指定门店的测试数据
     * @api {post} /api/test/delBulkData
     */
    public async delBulkData() {
        const { ctx, app } = this;
        const { model } = ctx;

        const transaction = await model.transaction();

        try {
            const Op = app.Sequelize.Op;
            await model.OilUser.destroy({
                where: {
                    userId: {
                        [Op.like]: 'test:%',
                    },
                },
                transaction
            });
            await model.OilExchangeCode.destroy({
                where: {
                    userId: {
                        [Op.like]: 'test:%',
                    },
                },
                transaction
            });
            await transaction.commit();
            ctx.body = 'success';
        } catch (e) {
            await transaction.rollback();
            ctx.body = 'fail';
        }
    }

    /**
     * 取消用户的核销状态
     * @api {post} /api/test/cancelVerified
     * @param body.userId
     */
    public async cancelVerified() {
        const { ctx } = this;
        const { model } = ctx;

        const body = ctx.request.body;

        ctx.validate({
            userId: 'string',
        }, body);

        const userId = body.userId;

        const exchangeInfo = await model.OilExchangeCode.findOne({
            where: {
                userId
            }
        });

        if (!exchangeInfo) {
            throw new ctx.HttpError.BadRequest('不存在领取记录');
        }

        await exchangeInfo.update({
            verified: CodeVerifiedEnum.no,
            verifierId: null,
            verifyShopCode: null,
            verifyTime: null,
        });


        ctx.body = 'success';
    }

    /**
     * 修改活动时间
     * @api {post} /api/test/modifyTime
     * @param body.startTime YYYY/MM/DD hh:mm:ss
     * @param body.endTime YYYY/MM/DD hh:mm:ss
     */
    public async modifyTime() {
        const { ctx } = this;
        const { model } = ctx;

        const body = ctx.request.body;

        ctx.validate({
            startTime: 'string',
            endTime: 'string',
        }, body);

        let { startTime, endTime } = body;

        startTime = new Date(startTime);
        endTime = new Date(endTime);

        await model.OilActivity.update({
            startTime,
            endTime,
        }, {
            where: {
                name: 'send_oil',
            },
        });

        ctx.body = 'success';
    }
}
