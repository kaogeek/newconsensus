/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import {Column, PrimaryGeneratedColumn, Entity, BeforeUpdate, BeforeInsert, ManyToOne, JoinColumn} from 'typeorm';
import {BaseModel} from './BaseModel';
import {PageUser} from './PageUser';
import moment = require('moment/moment');
@Entity('proposal')
export class Proposal extends BaseModel {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({name: 'room_id'})
    public roomId: number;

    @Column({name: 'title'})
    public title: string;

    @Column({name: 'content'})
    public content: string;

    @Column({name: 'req_supporter'})
    public reqSupporter: number;

    @Column({name: 'approve_user_id'})
    public approveUserId: number;

    @Column({name: 'approve_username'})
    public approveUsername: string;

    @Column({name: 'approve_date'})
    public approveDate: Date;

    @Column({name: 'supporter_count'})
    public supporterCount: number;

    @Column({name: 'like_count'})
    public likeCount: number;

    @Column({name: 'dislike_count'})
    public dislikeCount: number;
    
    @Column({name: 'end_date'})
    public endDate: Date;

    @Column({name: 'video_url'})
    public videoUrl: string;
    
    @Column({name: 'image_url'})
    public imageUrl: string;

    @Column({ name: 'pin_ordering' })
    public pinOrdering: number;

    @Column({ name: 'hot_score' })
    public hotScore: number;

    @ManyToOne(type => PageUser)
    @JoinColumn({name: 'created_by', referencedColumnName: 'id'})
    public pageUser: PageUser;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdDate = moment().toDate();
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.modifiedDate = moment().toDate();
    }
}
