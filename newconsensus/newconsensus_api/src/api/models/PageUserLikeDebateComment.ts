/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
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
