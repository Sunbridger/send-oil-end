import { Application, IBoot } from 'egg';
import { ActivityStatusType, OilActivityModel } from './app/model/oil_activity';

interface IActivityInfo {
    name: string;
    status: ActivityStatusType;
    startTime: Date;
    startTimestamp: number;
    endTime: Date;
    endTimestamp: number;
    maxNum: number;
}

declare module 'egg' {
    interface Application {
        activityInfo: IActivityInfo;
    }
}

export default class AppBoot implements IBoot {
    private readonly app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    async willReady() {
        const activityInfo = await this.app.model.OilActivity.findOne({
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

        this.app.activityInfo = {
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

        //     this.app.activityInfo = {
        //         name,
        //         status,
        //         startTime,
        //         startTimestamp,
        //         endTime,
        //         endTimestamp,
        //         maxNum
        //     };
        // } else {
        //     this.app.activityInfo = {
        //         name: 'send_oil',
        //         status: 1,
        //         startTime: new Date('2019/10/16 00:00:00'),
        //         startTimestamp: 1571155200000,
        //         endTime: new Date('2019/11/30 23:59:59'),
        //         endTimestamp: 1575129599000,
        //         maxNum: 12000
        //     };
        // }
    }
}
