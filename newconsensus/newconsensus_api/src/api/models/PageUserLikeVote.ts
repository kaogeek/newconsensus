/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 */

import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity('page_user_like_vote')
export class PageUserLikeVote {

    @PrimaryColumn({ name: 'user_id' })
    public userId: number;

    @PrimaryColumn({ name: 'vote_id' })
    public voteId: number;

    @Column({ name: 'is_like' })
    public isLike: boolean;
}
