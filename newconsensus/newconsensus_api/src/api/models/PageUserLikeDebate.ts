/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
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
