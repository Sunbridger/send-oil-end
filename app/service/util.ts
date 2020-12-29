import { Service } from 'egg';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

export default class ActivityService extends Service {
    /**
     * 发送邮件
     */
    public async sendEmail(mailOptions: Mail.Options) {
        const sender = 'souche2019@163.com';
        const transporter = nodemailer.createTransport({
            service: '163',
            auth: {
                user: sender,
                pass: 'souche2019', // 授权码
            }
        });

        try {
            await transporter.sendMail(Object.assign({
                from: sender
            }, mailOptions));
            return true;
        } catch (err) {
            console.log(err);
            this.app.logger.error('发送邮件失败');
            return false;
        }
    }
}
