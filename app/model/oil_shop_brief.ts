import { Table, Model, PrimaryKey, AutoIncrement, Column, DataType, AllowNull } from 'sequelize-typescript';

@Table({
    modelName: 'oil_shop_brief_V2',
})
export class OilShopBriefModel extends Model<OilShopBriefModel> {
    @PrimaryKey
    @AutoIncrement
    @Column({
        comment: '主键',
        type: DataType.INTEGER,
    })
    id: number;

    @AllowNull(false)
    @Column({
        field: 'shop_name',
        comment: '门店名称',
        type: DataType.CHAR(255),
    })
    shopName: string;

    @AllowNull(false)
    @Column({
        comment: '城市',
        type: DataType.CHAR(10),
    })
    city: string;

    @AllowNull(false)
    @Column({
        comment: '门店地址',
        type: DataType.CHAR(255),
    })
    address: string;

    @AllowNull(false)
    @Column({
        comment: '门店电话',
        type: DataType.CHAR(50),
    })
    tel: string;

    @AllowNull(false)
    @Column({
        field: 'shop_code',
        comment: '店铺code',
        type: DataType.CHAR(50),
    })
    shopCode: string;

    @AllowNull(false)
    @Column({
        field: 'company_code',
        comment: '公司code',
        type: DataType.CHAR(50),
    })
    companyCode: string;

    public static async findByShopCode(shopCode) {
        return OilShopBriefModel.findOne({
            where: {
                shopCode,
            },
        });
    }
}

export default () => OilShopBriefModel;
