/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import { Column, Entity, BeforeInsert, BeforeUpdate, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn} from 'typeorm';
import { BaseModel } from './BaseModel';
import moment = require('moment/moment');
import { PageContentHasTag } from './PageContentHasTag';
import { PageContentImage } from './PageContentImage';
import { User } from './User';

@Entity('page_content')
export class PageContent extends BaseModel {

    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'title' })
    public title: string;

    @Column({ name: 'content' })
    public content: string;

    @Column({ name: 'cover_image' })
    public coverImage: string;

    @Column({ name: 'meta_tag_title' })
    public metaTagTitle: string;

    @Column({ name: 'meta_tag_description' })
    public metaTagContent: string;

    @Column({ name: 'meta_tag_keywords' })
    public metaTagKeyword: string;

    @Column({ name: 'is_draft' })
    public isDraft: boolean;

    @Column({ name: 'view_count' })
    public viewCount: number;

    @Column({ name: 'video_url' })
    public videoUrl: string;

    @Column({ name: 'link' })
    public link: string;

    @Column({ name: 'description'})
    public description: string;

    @Column({ name: 'created_by_username' })
    public createdByUsername: string;

    @Column({ name: 'modified_by_username' })
    public modifiedByUsername: string;

    @OneToMany(type => PageContentHasTag, pageIds => pageIds.pageContent)
    public tagId: PageContentHasTag[];

    // @OneToMany(type => PageContentHasTag, hasTags => hasTags.tag)
    // public hasTag: PageContentHasTag[];

    @OneToMany(type => PageContentImage, pageImage => pageImage.pageContents)
    public pageImages: PageContentImage[];

    // @ManyToMany(()=> Tag , tag => tag.pageContents)
    // public tags: Tag[];

    // @ManyToMany(() => Tag)
    // @JoinTable()
    // publictags: Tag[];

    // @ManyToMany(()=> Tag , tagContents => tagContents.pageTag)
    // @JoinTable()
    // public tagContent: Tag[];

    @ManyToOne(type => User)
    @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
    public user: User;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdDate = moment().toDate();
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.modifiedDate = moment().toDate();
    }

}
