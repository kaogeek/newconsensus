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
@Entity('tag_appearance')
export class TagAppearance extends BaseModel {

    @PrimaryColumn({name: 'tag'})
    public tag: string;

    @PrimaryColumn({name: 'content_id'})
    public contentId: number;

    @Column({name: 'type'})
    public type: string;

    @Column({name: 'count_appearance'})
    public countAppearance: number;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdDate = moment().toDate();
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.modifiedDate = moment().toDate();
    }
}
