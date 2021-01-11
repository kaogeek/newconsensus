/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import { Column, Entity, PrimaryColumn } from 'typeorm';
// import { AddressProvince } from './AddressProvince';
// import { AddressDistrict } from './AddressDistrict';

@Entity('address_postcode')
export class AddressPostcode {

    @PrimaryColumn({ name: 'id' })
    public id: number;
    
    @Column({ name: 'district' })
    public district: string;

    @Column({ name: 'amphoe' })
    public amphoe: string;

    @Column({ name: 'province' })
    public province: string;

    @Column({ name: 'postcode' })
    public postcode: number;

    // @ManyToOne(type => AddressProvince)
    // @JoinColumn({ name: 'province_id', referencedColumnName: 'id' })
    // public province: AddressProvince;

    // @ManyToOne(type => AddressDistrict, districts => districts.amphur)
    // @JoinColumn({ name: 'id'})
    // public district: AddressDistrict[];

}
