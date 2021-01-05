/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 */

import { Column, Entity } from 'typeorm';
import { PrimaryColumn } from 'typeorm/index';

@Entity('page_user_like_debate')
export class PageUserLikeDebate {

    @PrimaryColumn({ name: 'user_id' })
    public userId: number;

    @PrimaryColumn({ name: 'debate_id' })
    public debateId: number;

    @Column({ name: 'is_like' })
    public isLike: boolean;
}
