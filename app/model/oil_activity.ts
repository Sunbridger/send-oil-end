import { Table, Model, PrimaryKey, AutoIncrement, Column, DataType, AllowNull } from 'sequelize-typescript';

export type ActivityStatusType = 0 | 1;
export enum ActivityStatusEnum {
    no,
    yes
}

@Table({
    modelName: 'oil_activity_V2',
})
export class OilActivityModel extends Model<OilActivityModel> {
    @PrimaryKey
    @AutoIncrement
    @Column({
        comment: '主键',
        type: DataType.INTEGER,
    })
    id: number;

    @AllowNull(false)
    @Column({
        comment: '活动名字',
        type: DataType.CHAR(50),
    })
    name: string;

    @AllowNull(false)
    @Column({
        comment: '活动状态',
        type: DataType.INTEGER,
    })
    status: ActivityStatusType;

    @AllowNull(false)
    @Column({
        field: 'start_time',
        comment: '活动开始时间',
        type: DataType.DATE,
    })
    startTime: Date;

    @AllowNull(false)
    @Column({
        field: 'end_time',
        comment: '活动结束时间',
        type: DataType.DATE,
    })
    endTime: Date;

    @AllowNull(false)
    @Column({
        field: 'max_num',
        comment: '活动奖品数量',
        type: DataType.INTEGER,
    })
    maxNum: number;
}

export default () => OilActivityModel;
