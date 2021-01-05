/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm/index';
import { BaseModel } from './BaseModel';
import moment = require('moment');

@Entity('main_page_video')
export class MainPageVideo extends BaseModel {

    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'url' })
    public url: string;

    @Column({ name: 'tagline' })
    public tagline: string;

    @Column({ name: 'ordering' })
    public ordering: number;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdDate = moment().toDate();
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.modifiedDate = moment().toDate();
    }
}
