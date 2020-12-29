import { Table, Model, PrimaryKey, AutoIncrement, Column, DataType, AllowNull } from 'sequelize-typescript';

// export type CodeVerifiedType = 0 | 1;
// export enum CodeVerifiedEnum {
//     no,
//     yes
// }

@Table({
    modelName: 'oil_exchange_fail_V2',
})
export class OilExchangeFailModel extends Model<OilExchangeFailModel> {
    @PrimaryKey
    @AutoIncrement
    @Column({
        comment: '主键',
        type: DataType.INTEGER,
    })
    id: number;

    @Column({
        comment: '兑换码',
        type: DataType.CHAR(50),
    })
    code: string;

    // @Column({
    //     comment: '是否已核销: 0-未核销;1-已核销',
    //     type: DataType.INTEGER,
    // })
    // verified: CodeVerifiedType;

    @AllowNull
    @Column({
        field: 'verifier_id',
        comment: '核销人id',
        type: DataType.CHAR(50),
    })
    verifierId: string;

    @Column({
        field: 'verifier_phone',
        comment: '核销人手机号',
        type: DataType.CHAR(12),
    })
    verifierPhone: string;

    @Column({
        field: 'verifier_name',
        comment: '核销人名字',
        type: DataType.CHAR(12),
    })
    verifierName: string;

    @AllowNull
    @Column({
        field: 'verify_shop_code',
        comment: '核销门店码',
        type: DataType.CHAR(50),
    })
    verifyShopCode: string;

    @AllowNull
    @Column({
        field: 'failure_reason',
        comment: '核销失败理由',
        type: DataType.CHAR(50),
    })
    failureReason: string;

    @AllowNull
    @Column({
        field: 'failure_code',
        comment: '核销失败码',
        type: DataType.INTEGER,
    })
    failureCode: string;

    @AllowNull
    @Column({
        field: 'verify_time',
        comment: '核销时间',
        type: DataType.DATE,
    })
    verifyTime: Date;

}

export default () => OilExchangeFailModel;
