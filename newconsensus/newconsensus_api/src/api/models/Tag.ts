/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import { Column, PrimaryGeneratedColumn, Entity, BeforeUpdate, BeforeInsert, OneToMany } from 'typeorm';
import { BaseModel } from './BaseModel';
import moment = require('moment/moment');
import { IsNotEmpty } from 'class-validator';
import { PageContentHasTag } from './PageContentHasTag';

@Entity('tag')
export class Tag extends BaseModel {

    @PrimaryGeneratedColumn({ name: 'id' })
    @IsNotEmpty()
    public id: number;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'description' })
    public description: string;

    @OneToMany(type => PageContentHasTag, pageContentTagId => pageContentTagId.tag)
    public pageContentTagId: PageContentHasTag[];

    // @ManyToMany(()=> PageContent , pageContent => pageContent.tags)
    // @JoinTable()
    // public pageContents: PageContent[];

    // @OneToMany(type => PageContentHasTag, pageContentHasTag => pageContentHasTag._tag)
    // public pageContentHasTags: PageContentHasTag[];

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdDate = moment().toDate();
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.modifiedDate = moment().toDate();
    }
}
