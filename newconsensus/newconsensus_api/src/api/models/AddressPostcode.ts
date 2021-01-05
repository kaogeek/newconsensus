/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
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
