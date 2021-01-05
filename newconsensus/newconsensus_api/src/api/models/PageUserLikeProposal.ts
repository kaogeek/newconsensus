/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import { Column,PrimaryColumn, Entity } from 'typeorm';

@Entity('page_user_like_proposal')
export class PageUserLikeProposal {

    @PrimaryColumn({ name: 'user_id' })
    public userId: number;

    @PrimaryColumn({ name: 'proposal_id' })
    public proposalId: number;

    @Column({ name: 'is_like' })
    public isLike: boolean;

}
