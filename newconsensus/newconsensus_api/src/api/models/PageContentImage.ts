/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import {Entity, Column, BeforeInsert, BeforeUpdate, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm';
// import {BaseModel} from './BaseModel';
// import moment = require('moment/moment');
import { BaseModel } from './BaseModel';
import moment = require('moment');
import { PageContent } from './PageContent';
// import { PageContent } from './PageContent';

@Entity('page_content_image')
export class PageContentImage extends BaseModel{

    @PrimaryGeneratedColumn({name: 'id'})
    public id: number;

    @Column({name: 'page_content_id'})
    public pageId: number;

    @Column({name: 'image_url'})
    public imageUrl: string;

    @ManyToOne(type => PageContent, pageContents => pageContents.pageImages)
    @JoinColumn({ name: 'page_content_id' })
    public pageContents: PageContent[];

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdDate = moment().toDate();
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.modifiedDate = moment().toDate();
    }

}
