import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('address_amphur')
export class AddressAmphur {

    @PrimaryColumn({ name: 'id' })
    public id: string;

    @Column({ name: 'code' })
    public code: string;

    @Column({ name: 'name' })
    public name: string;

    // @ManyToOne(type => AddressProvince)
    // @JoinColumn({ name: 'province_id', referencedColumnName: 'id' })
    // public province: AddressProvince;

}
