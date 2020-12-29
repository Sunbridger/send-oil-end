import { Service } from 'egg';
import { CodeVerifiedEnum, CodeVerifiedType, CodePlatformEnum } from '../model/oil_exchange_code';
import { TokenEnum } from '../../config/const';
import { OilUserModel, OrderStatusType, OrderStatusEnum } from '../model/oil_user';
import { OilShopBriefModel } from '../model/oil_shop_brief';
import AsyncLock from 'async-lock';

const lock = new AsyncLock();

interface IUserData {
    expired: string;
    maxAge: string;
    appName: string;
    iid: string;
    userId: string;
    userPhone: string;
    loginPhone: string;
    alipayId: string;
}


declare module 'egg' {
    interface Context {
        userData: IUserData;
    }
}

export default class ToCService extends Service {
    /**
     * 获取c端用户信息
     * @param {String} token
     * @return {IUserData}
     */
    public async getUserData(token: string): Promise<IUserData> {
        const { app } = this;
        try {
            const { body } = await app.CSsoDubbo.send('get', {
                sid: token,
            });
            app.logger.info('token in getUserData:', token);
            app.logger.info('userData in getUserData:', body);

            // token无效
            if (!body) {
                return {} as IUserData;
            }

            return body as IUserData;
            // 测试
            // return {
            //     expired: '1570711608',
            //     iid: '13056375',
            //     maxAge: '10000',
            //     appName: 'buyer',
            //     userPhone: '13750897532',
            //     loginPhone: '13750897532',
            //     userId: 'ARuAkerdlv',
            //     alipayId: '2088902093899128'
            // };
        } catch (e) {
            app.logger.error('c端token dubbo接口调用失败');
            app.logger.error(e);
            return {} as IUserData;
        }
    }

    public async getActivityTimeAndShops() {
        const { ctx, app } = this;
        const allShopInfos = await ctx.model.OilShopBrief.findAll();
        const allShopList = allShopInfos.map(shopInfo => {
            const { shopName, address, city, tel } = shopInfo;
            return {
                shopName,
                address,
                city,
                tel,
            };
        });

        const { startTimestamp, endTimestamp } = app.activityInfo;
        return {
            activityStartTime: startTimestamp,
            activityEndTime: endTimestamp,
            allShopList,
        };
    }

    /**
     * 获取活动及用户状态
     */
    public async getActivityAndUserStatus() {
        type CodeStatusType = 0 | 1 | 2;
        enum CodeStatusEnum {
            no, // 没有领取
            yes, // 领取但没有兑换
            has, // 领取且兑换
        }
        type RemainStatusType = 0 | 1;
        enum RemainStatusEnum {
            no, // 没有库存
            yes, // 有客村
        }
        interface IActivityAndUserStatus {
            isTargetUser?: boolean;
            codeStatus?: CodeStatusType;
            activityStartTime: number;
            activityEndTime: number;
            remainStatus: RemainStatusType;
        }

        const { ctx, app } = this;
        const { model } = ctx;
        // 返回结果
        const { startTimestamp, endTimestamp, maxNum } = app.activityInfo;
        const result = ({
            activityStartTime: startTimestamp,
            activityEndTime: endTimestamp
        } as IActivityAndUserStatus);

        try {
            // 判断是否登录
            const token = ctx.get(TokenEnum.c);
            const userData = token ? await this.getUserData(token) : {} as IUserData;
            const userId = userData.userId;
            if (userId) {
                // 判断是否目标用户
                const userInfo = await model.OilUser.findByUserId(userId);
                if (userInfo) {
                    result.isTargetUser = true;

                    // 判断领取情况
                    const exchangeInfo = await model.OilExchangeCode.findByUserId(userId);
                    if (exchangeInfo) {
                        const verified = exchangeInfo.verified;
                        result.codeStatus = verified === CodeVerifiedEnum.no ? CodeStatusEnum.yes : CodeStatusEnum.has;
                    } else {
                        result.codeStatus = CodeStatusEnum.no;
                    }
                } else {
                    result.isTargetUser = false;
                }
            }

            // 判断库存
            const currentCount = await model.OilExchangeCode.count();
            result.remainStatus = currentCount >= maxNum ?
                RemainStatusEnum.no :
                RemainStatusEnum.yes;
        } catch (e) {
            app.logger.error('获取活动和用户状态 数据查询失败');
            app.logger.error(e);
        }

        return result;
    }

    /**
     * 生成核销码
     */
    public async generateCode(inApp: boolean) {
        interface IGenerateCode {
            result: boolean;
            errCode?: string;
            errMsg?: string;
            code?: string;
        }
        enum IErrorCodeEnum {
            innerErr = '00', // 内部错误
            over = '10', // 活动结束
            hasGain = '20', // 已经领取
            noRemain = '30', // 没有余量
            noStart = '40', // 没有开始
        }

        const result = {} as IGenerateCode;
        const { ctx, app, service } = this;
        const { startTimestamp, endTimestamp, maxNum } = app.activityInfo;

        // 并发加锁
        await lock.acquire('generate_code_key', async () => {
            // 判断活动日期
            const now = Date.now();
            // 活动没有开始
            if (now < startTimestamp) {
                result.result = false;
                result.errCode = IErrorCodeEnum.noStart;
                result.errMsg = '活动没开始';
                return result;
            }
            // 活动已经结束
            if (now > endTimestamp) {
                result.result = false;
                result.errCode = IErrorCodeEnum.over;
                result.errMsg = '活动已结束';
                return result;
            }

            // 判断是否领取
            const { model } = ctx;
            const { userId, iid, userPhone } = ctx.userData;
            const exchangeInfo = await model.OilExchangeCode.findByUserId(userId);
            if (exchangeInfo) {
                result.result = false;
                result.errCode = IErrorCodeEnum.hasGain;
                result.errMsg = '已领取过了~';
                return result;
            }

            // 判断是否有余量
            const exchangeCount = await model.OilExchangeCode.count();
            if (exchangeCount >= maxNum) {
                result.result = false;
                result.errCode = IErrorCodeEnum.noRemain;
                result.errMsg = '抱歉，兑换码已抢完~';
                return result;
            }

            try {
                const userInfo = await model.OilUser.findByUserId(userId) as OilUserModel;

                await model.OilExchangeCode.create({
                    userId,
                    code: userInfo.code,
                    allowShopCode: userInfo.allowShopCode,
                    platform: inApp ? CodePlatformEnum.app : CodePlatformEnum.h5,
                });

                result.result = true;
                result.code = userInfo.code;

                // 短信、push
                service.activity.sendSms(userPhone, userInfo.code);
                service.activity.pushToC(iid, userInfo.code);

                return result;
            } catch (e) {
                app.logger.error('领取核销码失败');
                app.logger.error(e);

                result.result = false;
                result.errCode = IErrorCodeEnum.innerErr;
                result.errMsg = '领取核销码失败';
                return result;
            }
        });

        return result;
    }

    /**
     * 获取核销码
     */
    public async getCode() {
        interface IGetCode {
            haveCode: boolean;
            codeInfo: ICodeInfo | {};
            activityStartTime: number;
            activityEndTime: number;
        }
        interface ICodeInfo {
            code: string;
            verified: CodeVerifiedType;
            orderStatus: OrderStatusType;
            // allShoList?: IShopInfo[];
            shopList: IShopInfo[];
        }
        interface IShopInfo {
            shopName: string;
            shopCode: string;
            city: string;
            address: string;
            tel: string;
        }

        const { ctx, app } = this;
        const { model } = ctx;
        const { startTimestamp, endTimestamp } = app.activityInfo;
        const result = ({
            activityStartTime: startTimestamp,
            activityEndTime: endTimestamp
        } as IGetCode);

        // 判断是否有领取记录
        const { userId } = ctx.userData;
        const exchangeInfo = await model.OilExchangeCode.findOne({
            include: [
                {
                    model: OilUserModel,
                },
            ],
            where: {
                userId,
            },
        });
        if (!exchangeInfo) {
            result.haveCode = false;
            result.codeInfo = {};
            return result;
        }

        const { code, verified, userInfo } = exchangeInfo;
        result.haveCode = true;
        result.codeInfo = {
            code,
            verified,
            orderStatus: userInfo.orderStatus,
        };

        const { orderStatus, allowShopCode, city } = userInfo;

        // 在租用户返回指定核销门店
        if (orderStatus === OrderStatusEnum.renting) {
            const shopInfo = await model.OilShopBrief.findOne({
                where: {
                    shopCode: allowShopCode,
                },
            }) as OilShopBriefModel;
            const { shopName, shopCode, city, address, tel } = shopInfo;
            (result.codeInfo as ICodeInfo).shopList = [
                {
                    shopName,
                    shopCode,
                    city,
                    address,
                    tel,
                },
            ];
            return result;
        }

        // 租后用户返回同城核销门店
        const allShopInfos = await model.OilShopBrief.findAll();
        const allShopList = allShopInfos.map(shopInfo => {
            const { shopName, shopCode, city, address, tel } = shopInfo;
            return {
                shopName,
                shopCode,
                city,
                address,
                tel,
            };
        });
        const shopList = allShopList.filter(shopInfo => shopInfo.city === city);
        (result.codeInfo as ICodeInfo).shopList = shopList;
        // (result.codeInfo as ICodeInfo).allShoList = allShopList;
        return result;
    }
}
