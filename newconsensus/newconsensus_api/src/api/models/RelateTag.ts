/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import {Column, PrimaryColumn, Entity, BeforeUpdate, BeforeInsert} from 'typeorm';
import {BaseModel} from './BaseModel';
import moment = require('moment/moment');
@Entity('relate_tag')
export class RelateTag extends BaseModel {

    @PrimaryColumn({name: 'name'})
    public name: string;

    @Column({name: 'trending_score'})
    public trendingScore: number;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdDate = moment().toDate();
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.modifiedDate = moment().toDate();
    }
}
