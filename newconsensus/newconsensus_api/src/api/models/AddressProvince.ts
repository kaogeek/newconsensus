/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('address_province')
export class AddressProvince {

    @PrimaryColumn({ name: 'id' })
    public id: string;

    @Column({ name: 'name' })
    public name: string;
}
