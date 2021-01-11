/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
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
