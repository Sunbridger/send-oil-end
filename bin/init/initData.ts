import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';
import { createConnection, Connection } from 'mysql2/promise';
import { getRandom } from './utils';

const shopsPath = path.resolve(__dirname, './shops.xlsx');
const shopsBuf = fs.readFileSync(shopsPath);
const shopsWb = XLSX.read(shopsBuf);
const shopsSheetName = shopsWb.SheetNames[0];

const usersPath = path.resolve(__dirname, './users.xlsx');
const usersBuf = fs.readFileSync(usersPath);
const usersWb = XLSX.read(usersBuf);
const usersSheetNames = usersWb.SheetNames;

// excel表中的数据结构
interface IShop {
    'shop_name': string;
    'city': string;
    'address': string;
    'tel': string;
    'shop_code': string;
    'company_code': string;
    'user_name': string; // 联系方式的名字
}

type UserType = '租中' | '租后';
enum orderTypeEnum {
    '租中',
    '租后',
}
// excel表中的数据结构
interface IUser {
    'order_id': string;
    'order_code': string;
    'user_id': string;
    'iid': string;
    'shop_code': string;
    'shop_name': string;
    'city_name': string;
    'company_code': string;
    'type': UserType;
}

const tableNames = {
    shop: 'oil_shop_brief_V2',
    user: 'oil_user_V2',
    exchange: 'oil_exchange_code_V2',
    fail: 'oil_exchange_fail_V2',
    activity: 'oil_activity_V2'
};

/**
 * 初始化店铺数据
 * @param {Connection} connection
 */
async function initShops(connection: Connection) {
    try {
        await connection.query(`drop table if exists ${tableNames.shop}`);
        await connection.query(`
            CREATE TABLE ${tableNames.shop}(
                id              int primary key auto_increment comment '主键',
                shop_name       varchar(255) not null comment '门店名称',
                city            varchar(10) not null comment '城市',
                address         varchar(255) not null comment '门店地址',
                tel             varchar(50) not null comment '门店电话',
                shop_code       varchar(50) not null comment '店铺code',
                company_code    varchar(50) not null comment '公司code',
                created_at      timestamp not null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
                updated_at      timestamp not null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '更新时间',
                constraint idx_shop_code unique (shop_code)
            )ENGINE=InnoDB DEFAULT CHARSET=utf8 comment='送机油活动_门店信息摘要';
        `);
        const shopKeys = [
            'shop_name',
            'city',
            'address',
            'tel',
            'shop_code',
            'company_code',
        ];
        const shops: IShop[] = XLSX.utils.sheet_to_json(shopsWb.Sheets[shopsSheetName]);

        // if (event === env.prodTest) {
        //     shops = shops.concat([
        //         {
        //             shop_name: '杭州大搜车',
        //             city: '杭州',
        //             address: '浙江省杭州市余杭区',
        //             tel: '13750897532',
        //             shop_code: '002166',
        //             company_code: 'company_code',
        //         },
        //     ]);
        // }

        const shopList = shops.map(shop => {
            const item: string[] = [];
            for (const key of shopKeys) {
                item.push(shop[key]);
            }
            return item;
        });
        // TODO: (shop_name, city, address, tel, shop_code, company_code)用shopKeys替换有问题？
        await connection.query(`INSERT IGNORE INTO ${tableNames.shop} (${shopKeys.join(',')}) VALUES ?`, [
            shopList,
        ]);
    } catch (e) {
        console.error(e);
    }
}

/**
 * 初始化用户
 * @param {Connection} connection
 */
async function initUsers(connection: Connection) {
    try {
        await connection.query(`drop table if exists ${tableNames.user}`);
        await connection.query(`
            CREATE TABLE ${tableNames.user}(
                id                  int primary key auto_increment comment '主键',
                user_id             varchar(50) not null comment '用户id',
                iid                 varchar(50) not null comment '用户iid',
                city                varchar(10) not null comment '订单所在城市',
                order_status        tinyint not null comment '租赁状态: 0-租前; 1:租后',
                order_num           varchar(255) not null comment '订单号',
                allow_shop_code     varchar(50) not null comment '允许核销的门店code/1则表示全部',     
                original_shop_code  varchar(50) not null comment '用户订单原始门店码',
                company_code        varchar(50) not null comment '订单所在公司code',
                code                varchar(50) BINARY not null comment '开始分配的核销码',
                created_at          timestamp not null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
                updated_at          timestamp not null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '更新时间',
                constraint idx_user_id unique (user_id),
                constraint idx_iid unique (iid)
            )ENGINE=InnoDB DEFAULT CHARSET=utf8 comment '送机油活动_用户白名单';
        `);
        const [ shops ] = await connection.query(`SELECT * FROM ${tableNames.shop}`);
        const userKeys = [
            'user_id',
            'iid',
            'city',
            'order_status',
            'order_num',
            'allow_shop_code',
            'original_shop_code',
            'company_code',
            'code',
        ];
        const users: IUser[] = usersSheetNames.reduce((result, sheetName) => {
            return result.concat(XLSX.utils.sheet_to_json(usersWb.Sheets[sheetName]));
        }, []);

        // if (event === env.prodTest) {
        //     users = users.concat([
        //         {
        //             order_id: '578025019666',
        //             order_code: '578025019666',
        //             user_id: 'wv4kdi0EUE',
        //             iid: '1326120',
        //             shop_code: 'shop_code',
        //             shop_name: 'shop_name',
        //             city_name: '杭州',
        //             company_code: 'company_code',
        //             type: '租后',
        //         },
        //         {
        //             order_id: '578025019669',
        //             order_code: '578025019669',
        //             user_id: 'rUKAFi3Rmm',
        //             iid: '2615782',
        //             shop_code: 'shop_code',
        //             shop_name: 'shop_name',
        //             city_name: '杭州',
        //             company_code: 'company_code',
        //             type: '租中',
        //         },
        //         {
        //             order_id: '578025019660',
        //             order_code: '578025019660',
        //             user_id: '5K6zgfdAma',
        //             iid: '2645645',
        //             shop_code: 'shop_code',
        //             shop_name: 'shop_name',
        //             city_name: '杭州',
        //             company_code: 'company_code',
        //             type: '租后',
        //         },
        //     ]);
        // }

        const randomCodes = getRandom(users.length);
        const userList = users.map(user => {
            const {
                user_id,
                iid,
                city_name,
                type,
                order_code,
                shop_code,
                company_code,
            } = user;
            const userInfo = {
                user_id,
                iid,
                city: city_name,
                order_status: 0,
                order_num: order_code,
                allow_shop_code: '',
                original_shop_code: shop_code,
                company_code,
                code: randomCodes.pop(),
            };
            // 根据订单状态 设置状态和城市
            if (type === orderTypeEnum[0]) {
                const targetShops = (shops as IShop[]).filter(shop => shop.company_code === userInfo.company_code);
                // 如果公司code相同的门店有多家，则选择相同城市的
                const targetShop = targetShops.length > 1 ? targetShops.find(shop => shop.city === userInfo.city) as IShop : targetShops[0];
                if (targetShops.length > 1) {
                    console.log(`${userInfo.user_id}用户所属公司存在多个门店, targetShop: ${targetShop.shop_name} / ${targetShop.company_code}`);
                }

                userInfo.order_status = orderTypeEnum.租中;
                userInfo.allow_shop_code = targetShop.shop_code;
            } else {
                userInfo.order_status = orderTypeEnum.租后;
                userInfo.allow_shop_code = '1';
            }
            return userKeys.map(key => userInfo[key]);
        });
        // TODO: 用userKeys替换有问题？
        await connection.query(`INSERT IGNORE INTO ${tableNames.user} (${userKeys.join(',')}) VALUES ?`, [
            userList,
        ]);
    } catch (e) {
        console.error(e);
    }
}

/**
 * 初始化领取核销表
 * @param {Connection} connection
 */
async function initExchange(connection: Connection) {
    try {
        await connection.query(`drop table if exists ${tableNames.exchange}`);
        await connection.query(`
            CREATE TABLE ${tableNames.exchange}(
                id                 int primary key auto_increment comment '主键',
                user_id            varchar(50) not null comment '用户id',
                code               varchar(50) BINARY not null comment '兑换码',
                allow_shop_code    varchar(50) not null comment '允许核销的门店code/1则表示全部',
                platform           varchar(5) not null comment '获取平台: (app|h5)',
                verified           tinyint default 0 not null comment '是否已核销: 0-未核销;1-已核销',
                verifier_id        varchar(50) null comment '核销人id',
                verify_shop_code   varchar(50) null comment '核销门店码',
                verify_time        timestamp null comment '核销时间',
                created_at         timestamp not null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
                updated_at         timestamp not null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '更新时间',
                constraint idx_code unique (code),
                constraint idx_user_id unique (user_id)
            )ENGINE=InnoDB DEFAULT CHARSET=utf8 comment='送机油活动_兑换码表';
        `);
    } catch (e) {
        console.error(e);
    }
}

/**
 * 初始化核销失败表
 * @param {Connection} connection
 */
async function initFail(connection: Connection) {
    try {
        await connection.query(`drop table if exists ${tableNames.fail}`);
        await connection.query(`
            CREATE TABLE ${tableNames.fail}(
                id                 int primary key auto_increment comment '主键',
                code               varchar(50) not null comment '兑换码',
                verifier_id        varchar(50) not null comment '核销人id',
                verifier_phone     varchar(12) not null comment '核销人手机',
                verifier_name      varchar(12) not null comment '核销人姓名',
                verify_shop_code   varchar(50) not null comment '核销门店码',
                failure_reason     varchar(50) null comment '核销失败理由',
                failure_code       int         null comment '核销失败码',
                verify_time        timestamp not null DEFAULT CURRENT_TIMESTAMP comment '核销时间',
                created_at         timestamp not null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
                updated_at         timestamp not null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '更新时间'
            )ENGINE=InnoDB DEFAULT CHARSET=utf8 comment='送机油活动_兑换失败表';
        `);
    } catch (e) {
        console.error(e);
    }
}

/**
 * 初始化活动信息
 * @param {Connection} connection
 */
async function initActivity(connection: Connection) {
    try {
        await connection.query(`drop table if exists ${tableNames.activity}`);
        await connection.query(`
            CREATE TABLE ${tableNames.activity}(
                id               int primary key auto_increment comment '主键',
                name             varchar(50) not null comment '活动名字',
                status           tinyint not null comment '活动状态: 0-无效; 1-有效',
                start_time        datetime not null comment '活动开始时间',
                end_time          datetime not null comment '活动结束时间',
                max_num           int not null comment '活动奖品数量',
                created_at       timestamp not null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
                updated_at       timestamp not null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '更新时间',
                constraint idx_name unique (name)
            )ENGINE=InnoDB DEFAULT CHARSET=utf8 comment '活动信息';
        `);

        await connection.query(`INSERT IGNORE INTO ${tableNames.activity} (name, status, start_time, end_time, max_num) VALUES (?)`, [
            ['send_oil', 1, new Date('2019/10/16 00:00:00'), new Date('2019/11/30 23:59:59'), 12000]
        ]);
    } catch (e) {
        console.error(e);
    }
}

async function start(database: string) {
    const connection = await createConnection({
        database,
        host: '172.17.40.212',
        user: 'root',
        password: 'root',
    });
    try {
        await initShops(connection);
        await initUsers(connection);
        await initExchange(connection);
        await initFail(connection);
        await initActivity(connection);
        await connection.destroy();
    } catch (e) {
        console.error(e);
        connection.destroy();
    }
}

start('oil');
