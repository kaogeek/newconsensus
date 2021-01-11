/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import { PrimaryColumn, Column, PrimaryGeneratedColumn, Entity, BeforeUpdate, BeforeInsert, ManyToOne, JoinColumn } from 'typeorm';
import { BaseModel } from './BaseModel';
import { PageUser } from './PageUser';
import moment = require('moment/moment');

@Entity('proposal_comment')
export class ProposalComments extends BaseModel {

    @PrimaryGeneratedColumn()
    public id: number;

    @PrimaryColumn({ name: 'proposal_id' })
    public proposalId: number;

    @Column({ name: 'comment' })
    public comment: string;

    @Column({ name: 'like_count' })
    public likeCount: number;

    @Column({ name: 'dislike_count' })
    public dislikeCount: number;

    @Column({name: 'approve_user_id'})
    public approveUserId: number;

    @Column({name: 'approve_username'})
    public approveUsername: string;

    @Column({name: 'approve_date'})
    public approveDate: Date;

    @ManyToOne(type => PageUser)
    @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
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
