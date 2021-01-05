/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('address_province')
export class AddressProvince {

    @PrimaryColumn({ name: 'id' })
    public id: string;

    @Column({ name: 'name' })
    public name: string;
}
