/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import { Column } from 'typeorm';
import { Exclude } from 'class-transformer';
export abstract class BaseModel {
    @Exclude()
    @Column({ name: 'created_by' })
    public createdBy: string;

    @Column({ name: 'created_date' })
    public createdDate: Date;

    @Column({ name: 'created_by_username' })
    public createdByUsername: string;

    @Exclude()
    @Column({ name: 'modified_by' })
    public modifiedBy: string;

    @Exclude()
    @Column({ name: 'modified_date' })
    public modifiedDate: Date;

    @Column({ name: 'modified_by_username' })
    public modifiedByUsername: string;
}
