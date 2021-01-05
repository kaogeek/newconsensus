/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
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
