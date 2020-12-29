import { Subscription } from 'egg';
import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';

class uploadExcel extends Subscription {
    static get schedule() {
        return {
            type: 'worker',
            cron: '0 0 11 * * *',
            // immediate: true
        };
    }

    async subscribe() {
        const { app, service } = this;
        // service.schedule.uploadExcel()
        const { startTimestamp, startTime } = app.activityInfo;
        const today = new Date();
        const endOfYesterday = new Date(`${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate() - 1} 23:59:59`);

        const startFormat = format(startTime, 'YYYY-MM-DD');
        const endFormat = format(endOfYesterday, 'YYYY-MM-DD');

        const fileData = await service.schedule.genExcel({
            startTimestamp,
            endTimestamp: endOfYesterday.getTime()
        });

        const filename = `机油报表${startFormat} ~ ${endFormat}`;
        const filePath = path.resolve(__dirname, '../public', `${filename}.xlsx`);

        fs.writeFileSync(filePath, fileData);

        await service.util.sendEmail({
            to: 'chenweibin@souche.com,shenkai01@souche.com',
            subject: filename,
            attachments: [
                {
                    filename: `${filename}.xlsx`,
                    path: filePath
                }
            ]
        });

        fs.unlinkSync(filePath);

        return true;
    }
}

module.exports = uploadExcel;
