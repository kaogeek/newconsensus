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

@Entity('main_page_slide')
export class MainPageSlide extends BaseModel {

    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'video_url' })
    public videoUrl: string;

    @Column({ name: 'image_url' })
    public imageUrl: string;

    @Column({ name: 'ordering' })
    public ordering: number;

    @Column({ name: 'delay_milisec' })
    public delayMiliSec: number;

    @Column({ name: 'is_auto_play' })
    public isAutoPlay: boolean;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdDate = moment().toDate();
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.modifiedDate = moment().toDate();
    }
}
