import { Table, Model, PrimaryKey, AutoIncrement, Column, DataType, AllowNull } from 'sequelize-typescript';

export type OrderStatusType = 0 | 1;
export enum OrderStatusEnum {
    renting,
    afrerRenting,
}

@Table({
    modelName: 'oil_user_V2',
})
export class OilUserModel extends Model<OilUserModel> {
    @PrimaryKey
    @AutoIncrement
    @Column({
        comment: '主键',
        type: DataType.INTEGER,
    })
    id: number;

    @AllowNull(false)
    @Column({
        field: 'user_id',
        comment: '用户id',
        type: DataType.CHAR(50),
    })
    userId: string;

    @AllowNull(false)
    @Column({
        comment: '用户iid',
        type: DataType.CHAR(50),
    })
    iid: string;

    @AllowNull(false)
    @Column({
        comment: '订单所在城市',
        type: DataType.CHAR(10),
    })
    city: string;

    @AllowNull(false)
    @Column({
        field: 'order_status',
        comment: '租赁状态: 0-租前; 1:租后',
        type: DataType.INTEGER,
    })
    orderStatus: OrderStatusType;

    @AllowNull(false)
    @Column({
        field: 'order_num',
        comment: '订单号',
        type: DataType.CHAR(255),
    })
    orderNum: string;

    @AllowNull(false)
    @Column({
        field: 'allow_shop_code',
        comment: '允许核销的门店code/1则表示全部',
        type: DataType.CHAR(50),
    })
    allowShopCode: string;

    @AllowNull(false)
    @Column({
        field: 'original_shop_code',
        comment: '用户订单原始门店码',
        type: DataType.CHAR(50),
    })
    originalShopCode: string;

    @AllowNull(false)
    @Column({
        field: 'company_code',
        comment: '订单所在公司code',
        type: DataType.CHAR(50),
    })
    companyCode: string;

    @AllowNull(false)
    @Column({
        comment: '开始分配的核销码',
        type: DataType.CHAR(50),
    })
    code: string;

    public static async findByUserId(userId) {
        return OilUserModel.findOne({
            where: {
                userId,
            },
        });
    }
}

export default () => OilUserModel;
