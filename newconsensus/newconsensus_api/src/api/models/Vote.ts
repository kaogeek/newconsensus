/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm/index';
import { BaseModel } from './BaseModel';
import moment = require('moment/moment');
import { User } from './User';
import { Proposal } from './Proposal';

@Entity('vote')
export class Vote extends BaseModel {

    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'proposal_id' })
    public proposalId: number;

    @Column({ name: 'room_id' })
    public roomId: number;

    @Column({ name: 'content' })
    public content: string;

    @Column({ name: 'vote_count' })
    public voteCount: number;

    @Column({ name: 'is_active' })
    public isActive: boolean;

    @Column({ name: 'like_count' })
    public likeCount: number;

    @Column({ name: 'dislike_count' })
    public dislikeCount: number;

    @Column({ name: 'end_date' })
    public endDate: Date;

    @Column({ name: 'link' })
    public link: string;

    @Column({ name: 'title' })
    public title: string;

    @Column({ name: 'tagline' })
    public tagline: string;

    @Column({ name: 'cover_image' })
    public coverImage: string;

    @Column({name: 'video_url'})
    public videoUrl: string;

    @Column({name: 'image_url'})
    public imageUrl: string;

    @Column({ name: 'description'})
    public description: string;

    @ManyToOne(type => User)
    @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
    public user: User;

    @ManyToOne(type => Proposal)
    @JoinColumn({ name: 'proposal_id', referencedColumnName: 'id' })
    public proposal: Proposal;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdDate = moment().toDate();
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.modifiedDate = moment().toDate();
    }
}
