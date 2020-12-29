import { Service } from 'egg';
import * as xlsx from 'xlsx';
import axios from 'axios';
import { OilUserModel, OrderStatusEnum } from '../model/oil_user';
// import path from 'path';
import { CodeVerifiedEnum } from '../model/oil_exchange_code';

export default class scheduleService extends Service {
    /**
     * getExcel 获取Excel Data (二维数组)
     */
    public async getExcelData({
        startTimestamp,
        endTimestamp
    }) {
        const { ctx, app } = this;
        const { model } = ctx;

        const exchangeList = await model.OilExchangeCode.findAll({
            where: {
                createdAt: {
                    $gte: new Date(startTimestamp),
                    $lte: new Date(endTimestamp)
                }
            },
            order: [
                ['created_at', 'DESC']
            ],
            include: [
                {
                    model: OilUserModel
                }
            ]
        });
        const head = ['城市', '用户ID', '用户IID', '订单转态', '用户来源', '首租订单号', '用户兑换码', '兑换码状态', '领取时间', '核销时间', '核销门店shopCode', '用户订单原shopcode'];

        if (!exchangeList.length) {
            return [head];
        }

        const { endTimestamp: activityEndTimestamp } = app.activityInfo;

        const resultList = exchangeList.map(exchangeInfo => {
            const userInfo = exchangeInfo.userInfo;

            const codeStatus = Date.now() > activityEndTimestamp ? '已过期' :
                exchangeInfo.verified === CodeVerifiedEnum.yes ? '已兑换' : '待兑换';

            return [
                userInfo.city,
                userInfo.userId,
                userInfo.iid,
                userInfo.orderStatus === OrderStatusEnum.afrerRenting ? '租后' : '在租',
                exchangeInfo.platform,
                userInfo.orderNum,
                userInfo.code,
                codeStatus,
                exchangeInfo.createdAt,
                exchangeInfo.verifyTime,
                exchangeInfo.verifyShopCode,
                userInfo.originalShopCode
            ];
        });
        return [
            head,
            ...resultList
        ];
    }

    /**
     * async getExcel 定时任务获取Excel (binary)
     */
    public async genExcel({
        startTimestamp,
        endTimestamp
    }) {
        // const { ctx, logger } = this;
        const excelData = await this.getExcelData({
            startTimestamp,
            endTimestamp
        });

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.aoa_to_sheet(excelData);

        xlsx.utils.book_append_sheet(wb, ws, '领取核销情况');

        return xlsx.write(wb, {
            bookType: 'xlsx',
            type: 'buffer'
        });
    }

    /**
     * 上传数据到maven
     * @param params.startTimestamp
     * @param params.endTimestamp
     */
    async uploadExcel({
        startTimestamp,
        endTimestamp
    }) {
        const { ctx, app } = this;
        const fileData = await this.genExcel({
            startTimestamp,
            endTimestamp
        });

        /**
         * @param stamp 时间戳
         * @return 'MMDD'
         */
        function formTime(stamp) {
            const date = new Date(stamp);
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return [month, day].map(item => item.toString().padStart(2, '0')).join('');
        }

        const fileName = `送机油${formTime(startTimestamp)}-${formTime(endTimestamp)}`;
        const url = `https://repo.souche-inc.com/repository/raw-packages/tangeche-f2e/reprot/market/send-oil/${encodeURIComponent(fileName)}.xlsx`;
        const auth = Buffer.from('sdev:7J48qUFA6m2E8uJx').toString('base64');
        return axios.put(url, fileData, {
            headers: {
                Authorization: 'Basic ' + auth,
                'Content-Type': 'application/octet-stream'
            },
            timeout: 60 * 1000
        }).then(() => url).catch(err => {
            app.logger.error(err);
            app.logger.error(err);
            app.logger.error('上传到maven失败');
            throw new ctx.HttpError.InternalServerError('上传到maven失败');
        });
    }
}
