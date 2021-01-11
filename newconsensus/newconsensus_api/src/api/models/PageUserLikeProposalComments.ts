/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import {Column, PrimaryColumn, Entity} from 'typeorm';

@Entity('page_user_like_proposal_comment')
export class PageUserLikeProposalComments  {

    @PrimaryColumn({ name: 'user_id' })
    public userId: number;

    @PrimaryColumn({ name: 'proposal_comment_id' })
    public proposalCommentId: number;

    @Column({ name: 'is_like' })
    public isLike: boolean;

}
