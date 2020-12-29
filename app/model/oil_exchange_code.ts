import { Table, Model, PrimaryKey, AutoIncrement, Column, DataType, AllowNull, BelongsTo } from 'sequelize-typescript';
import { OilUserModel } from './oil_user';

export type CodeVerifiedType = 0 | 1;
export enum CodeVerifiedEnum {
    no, // 没有核销
    yes, // 已经核销
}

export type CodePlatformType = 'app' | 'h5';
export enum CodePlatformEnum {
    app = 'app',
    h5 = 'h5',
}

@Table({
    modelName: 'oil_exchange_code_V2',
})
export class OilExchangeCodeModel extends Model<OilExchangeCodeModel> {
    @PrimaryKey
    @AutoIncrement
    @Column({
        comment: '主键',
        type: DataType.INTEGER,
    })
    id: number;

    @Column({
        field: 'user_id',
        comment: '用户id',
        type: DataType.CHAR(50),
    })
    @BelongsTo(() => OilUserModel, {
        as: 'userInfo',
        foreignKey: 'userId',
        targetKey: 'userId',
    })
    userId: string;
    userInfo: OilUserModel;

    @Column({
        comment: '兑换码',
        type: DataType.CHAR(50),
    })
    code: string;

    @Column({
        field: 'allow_shop_code',
        comment: '允许核销的门店code/1则表示全部',
        type: DataType.CHAR(50),
    })
    allowShopCode: string;

    @Column({
        comment: '获取平台: (app|h5)',
        type: DataType.CHAR(5),
    })
    platform: CodePlatformType;

    @Column({
        comment: '是否已核销: 0-未核销;1-已核销',
        type: DataType.INTEGER,
    })
    verified: CodeVerifiedType;

    @AllowNull
    @Column({
        field: 'verifier_id',
        comment: '核销人id',
        type: DataType.CHAR(50),
    })
    verifierId: string;

    @AllowNull
    @Column({
        field: 'verify_shop_code',
        comment: '核销门店码',
        type: DataType.CHAR(50),
    })
    verifyShopCode: string;

    @AllowNull
    @Column({
        field: 'verify_time',
        comment: '核销时间',
        type: DataType.DATE,
    })
    verifyTime: Date;

    @AllowNull
    @Column({
        field: 'created_at',
        comment: '生成时间',
        type: DataType.DATE,
    })
    createdAt: Date;

    public static async findByUserId(userId) {
        return OilExchangeCodeModel.findOne({
            where: {
                userId,
            },
        });
    }
}

export default () => OilExchangeCodeModel;
