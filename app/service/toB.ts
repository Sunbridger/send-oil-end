import { Service } from 'egg';
import { BVerifiedHistory } from './../module/toB';
import { CodeVerifiedEnum } from '../model/oil_exchange_code';

interface IUserBData {
    shopCode: string;
    headImg: string;
    iid: string;
    appName: string;
    displayName: string;
    userPhone: string;
    userName: string;
    userId: string;
    expired: string;
    maxAge: string;
}

declare module 'egg' {
    interface Context {
        userDataB: IUserBData;
    }
}

export default class toBService extends Service {
    /**
     * 获取c端用户信息
     * @param {String} token
     * @return {IUserBData}
     */
    public async getUserData(token: string): Promise<IUserBData> {
        const { app } = this;
        try {
            const { body } = await app.BSsoDubbo.send('getAuthZ', { token }, {});
            app.logger.info('token in getUserData:', token);
            app.logger.info('userData in getUserData:', body);

            // token无效
            if (!body) {
                return {} as IUserBData;
            }

            return body as IUserBData;
            // 测试
            // return {
            //     // shopCode: '002166',
            //     shopCode: '002946',
            //     headImg: 'https://img.souche.com/cf8b57b4-2233-4479-bc11-6914463fc4da.jpg',
            //     iid: '1131401',
            //     appName: 'lease',
            //     displayName: '刘梦',
            //     userPhone: '15800003333',
            //     userName: '15800003333',
            //     userId: 'LaM7ZYxocq',
            //     expired: '1570793260',
            //     maxAge: '10000',
            // };
        } catch (e) {
            app.logger.error('b端token dubbo接口调用失败');
            app.logger.error(e);
            return {} as IUserBData;
        }
    }
    /**
     * verifiedCode 核销 核销码接口
     */
    public async verifiedCode(code: string) {
        const { ctx, app } = this;
        const { model, userDataB } = ctx;

        const shopInfo = await model.OilShopBrief.findByShopCode(userDataB.shopCode);
        if (!shopInfo) {
            throw new ctx.HttpError.InternalServerError('抱歉，非本次活动店铺');
        }

        // 先校验是否有这个code存在，（校验5分钟内10次错误输入
        const failInfo = await model.OilExchangeFail.findAndCountAll({
            where: {
                verifierId: userDataB.userId,
                verifyTime: {
                    $lt: new Date(),
                    $gt: new Date(Date.now() - 5 * 60 * 1000)
                }
            }
        });
        if (failInfo.count >= 10) {
            throw new ctx.HttpError.InternalServerError('核销错误次数过多，请5分钟后重试。');
        }

        // 活动结束
        const { endTimestamp } = app.activityInfo;
        if (Date.now() > endTimestamp) {
            throw new ctx.HttpError.BadRequest('抱歉，活动已经结束');
        }

        try {
            // 确认存在后，再更新数据库信息
            const exchangeCodeInfo = await model.OilExchangeCode.findOne({
                where: {
                    code
                }
            });

            const baseFailInfo = {
                code,
                verifierId: userDataB.userId,
                verifierPhone: userDataB.userPhone,
                verifierName: userDataB.displayName,
                verifyShopCode: userDataB.shopCode,
                verifyTime: new Date()
            };

            // 核销码不存在
            if (!exchangeCodeInfo) {
                await model.OilExchangeFail.create({
                    ...baseFailInfo,
                    failureReason: '核销码不存在',
                    failureCode: 404,
                });
                return {
                    msg: '核销码不存在',
                    code: 404,
                    status: false
                };
            }

            // 在租用户只可在指定门店核销
            const { allowShopCode, verified } = exchangeCodeInfo;
            if (allowShopCode !== '1' && allowShopCode !== userDataB.shopCode) {
                await model.OilExchangeFail.create({
                    ...baseFailInfo,
                    failureReason: '不可在此门店核销',
                    failureCode: 403,
                });
                return {
                    msg: '不可在此门店核销',
                    code: 403,
                    status: false
                };
            }

            // 核销码已经核销
            if (verified === CodeVerifiedEnum.yes) {
                await model.OilExchangeFail.create({
                    ...baseFailInfo,
                    failureReason: '核销码已经被核销过了',
                    failureCode: 308,
                });
                return {
                    msg: '核销码已经被核销过了',
                    code: 308,
                    status: false
                };
            }

            // 成功核销
            await model.OilExchangeCode.update({
                verified: CodeVerifiedEnum.yes,
                verifierId: userDataB.userId,
                verifyShopCode: userDataB.shopCode,
                verifyTime: new Date()
            }, {
                where: {
                    code
                }
            });

            return {
                msg: '核销成功',
                code: 200,
                status: true
            };
        } catch (error) {
            this.logger.error(error);
            this.logger.error('用户核销校验失败。');
            throw new ctx.HttpError.InternalServerError('用户核销校验失败。');
        }
    }

    /**
     * getVerifiedHistory 店铺获取核销记录
     */
    public async getVerifiedHistory(query: BVerifiedHistory) {
        // 直接根据用户信息获取到shopcode（verify_shop_code），再进行页码查询
        const { ctx } = this;
        const { model, userDataB } = this.ctx;
        const { pageNo, pageSize } = query;
        const { shopCode } = userDataB;
        try {
            const result = await model.OilExchangeCode.findAndCountAll({
                where: {
                    verifyShopCode: this.ctx.userDataB.shopCode
                },
                attributes: ['code', 'verifyTime'],
                order: [
                    ['verifyTime', 'DESC'],
                    ['id', 'DESC']
                ],
                offset: (pageNo - 1) * pageSize,
                limit: pageSize,
            });

            // 一期数据
            const exchangeV1Count: number = await model.OilExchangeCodeV1.count({
                where: {
                    verifyShopCode: shopCode
                },
            });

            const { count, rows } = result;
            const totalNum = count + exchangeV1Count;

            let list = rows.map(item => ({
                code: item.code,
                verifyTime: item.verifyTime.getTime()
            }));

            // 新数据加载完，则获取一期数据
            if (list.length !== pageSize && exchangeV1Count) {
                const remainNum = pageSize - list.length;
                // 新数据总共的页数
                const lastCount = (pageNo - 1) * pageSize - count;
                const resultV1 = await model.OilExchangeCodeV1.findAndCountAll({
                    where: {
                        verifyShopCode: shopCode
                    },
                    attributes: ['code', 'verifyTime'],
                    order: [
                        ['verifyTime', 'DESC'],
                        ['id', 'DESC']
                    ],
                    offset: lastCount > 0 ? lastCount : 0,
                    limit: remainNum,
                });
                list = list.concat(resultV1.rows.map(item => ({
                    code: item.code,
                    verifyTime: item.verifyTime && item.verifyTime.getTime()
                })));
            }

            return {
                totalNum,
                currentPage: pageNo,
                list
            };
        } catch (error) {
            this.logger.error(error);
            this.logger.error('获取店铺核销记录失败');
            throw new ctx.HttpError.InternalServerError('获取店铺核销记录失败');
        }
    }
}
