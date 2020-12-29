import { Service } from 'egg';

export default class ActivityService extends Service {
    /**
     * 发送成功短信
     * @param {String} phone 手机号
     * @param {String} code 核销码
     */
    public async sendSms(phone: string, code: string) {
        const { ctx, config, app } = this;
        const { url, account } = config.sendSmsInfo;
        const result = await ctx.curl(url, {
            method: 'POST',
            auth: account,
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
            },
            data: {
                phoneId: phone,
                typeCode: '3aegv', // 分类代号
                templateCode: '31xuu', // 模板代号
                templateParams: {
                    code,
                },
                signName: '弹个车', // 签名，与 signCode 两者必选一
            },
        });
        if (result.status !== 200) {
            let error = result;
            if (result.res && result.res.data && Buffer.isBuffer(result.res.data)) {
                error = ctx.helper.getJsonData(result.res.data.toString(), result);
            }
            app.logger.error(`用户手机:${phone} 发送短信失败`);
            app.logger.error(error);
        }
    }

    /**
     * push成功消息
     * @param {String} userId 用户id 这里是iid!!
     * @param {String} code 核销码
     */
    public async pushToC(userId: string, code: string) {
        const { ctx, config, app } = this;
        const { url, account } = config.pushInfo;
        const activityUrl = config.activityUrls.index;
        const result = await ctx.curl(url, {
            method: 'POST',
            headers: {
                authorization: `Basic ${new Buffer(account).toString('base64')}`,
                accept: 'application/json',
                'content-type': 'application/json',
            },
            data: {
                userId,
                channel: 'destiny',
                type: 'common',
                content: '兑换码领取成功',
                cardType: 'text',
                cardDef: {
                    title: '兑换码领取成功',
                    bodyText: `您的兑换码为${code}，有效期至2019年11月30日，请尽快使用`,
                    isShowFooter: true,
                    footer: {
                        text: '查看详情',
                        link: `dst://open/webv?url=${activityUrl}`,
                    },
                },
            },
        });
        if (result.res && result.res.data && Buffer.isBuffer(result.res.data)) {
            const resultData = ctx.helper.getJsonData(result.res.data.toString(), result);
            if (!resultData.success) {
                app.logger.error(`用户iid:${userId} 推送失败`);
                app.logger.error(resultData);
            }
        }
    }
}
