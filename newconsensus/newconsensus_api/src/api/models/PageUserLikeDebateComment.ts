/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 */

import { Entity, Column } from 'typeorm';
import { PrimaryColumn } from 'typeorm/index';

@Entity('page_user_like_debate_comment')
export class PageUserLikeDebateComment {

    @PrimaryColumn({ name: 'user_id' })
    public userId: number;

    @PrimaryColumn({ name: 'debate_comment_id' })
    public debateCommentId: number;

    @Column({ name: 'is_like' })
    public isLike: boolean;
}
