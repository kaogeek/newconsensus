/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import {Entity, ManyToOne, JoinColumn, PrimaryColumn} from 'typeorm';
// import {BaseModel} from './BaseModel';
// import moment = require('moment/moment');
import { PageContent } from './PageContent';
import { Tag } from './Tag';

@Entity('page_content_has_tag')
export class PageContentHasTag {

    @PrimaryColumn({name: 'page_id'})
    public pageId: number;

    @PrimaryColumn({name: 'tag_id'})
    public tagId: number;

    @ManyToOne(type => PageContent, pages => pages.tagId)
    @JoinColumn({name: 'page_id'})
    public pageContent: PageContent[];

    @ManyToOne(type => Tag, tag => tag.pageContentTagId)
    @JoinColumn({name: 'tag_id'})
    public tag: Tag[];
    
    // @ManyToOne(type => Tag, tag => tag.id)
    // @JoinColumn({name: 'tag_id'})
    // public tag: Tag[];

    // @ManyToOne(type => PageContent, pages => pages.pageContentTagId)
    // @JoinColumn({name: 'page_id'})
    // public page: PageContent[];

    // @BeforeInsert()
    // public async createDetails(): Promise<void> {
    //     this.createdDate = moment().toDate();
    // }

    // @BeforeUpdate()
    // public async updateDetails(): Promise<void> {
    //     this.modifiedDate = moment().toDate();
    // }

}
