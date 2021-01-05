/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import { EntityRepository, Repository } from 'typeorm';
import { DebateComment } from '../models/DebateComment';

@EntityRepository(DebateComment)
export class DebateCommentRepository extends Repository<DebateComment> {

    public async countComment(debateIds: number[], isApproveComment?: boolean): Promise<any> {
        if (debateIds === undefined || debateIds === null || debateIds.length <= 0) {
            return Promise.resolve([]);
        }

        let approveStmt = '';
        if (isApproveComment !== undefined) {
            if (isApproveComment) {
                approveStmt = ' and DebateComment.approve_user_id is not null';
            } else {
                approveStmt = ' and DebateComment.approve_user_id is null';
            }
        }

        const query: any = await this.manager.createQueryBuilder(DebateComment, 'DebateComment');
        query.select(['DebateComment.debate_id as debateId', 'COUNT(DebateComment.id) as count']);
        query.where('DebateComment.debate_id IN (:debateId)' + approveStmt, { debateId: debateIds });
        query.groupBy('debateId');
        query.orderBy('debateId', 'DESC');
        console.log('Query >>>> ' + query.getQuery());
        return query.getRawMany();
    }

    public async countDebateCommentLike(debateIds?: number[], isApproveComment?: boolean): Promise<any> {
        if (debateIds === undefined || debateIds === null || debateIds.length <= 0) {
            return Promise.resolve({});
        }

        let approveStmt = '';
        if (isApproveComment !== undefined) {
            if (isApproveComment) {
                approveStmt = ' and DebateComment.approve_user_id is not null';
            } else {
                approveStmt = ' and DebateComment.approve_user_id is null';
            }
        }

        const query: any = await this.manager.createQueryBuilder(DebateComment, 'DebateComment');
        query.select(['DebateComment.debate_id as proposalId', 'SUM(DebateComment.like_count) as likeCount', 'SUM(DebateComment.dislike_count) as dislikeCount',
            'SUM(DebateComment.like_count + DebateComment.dislike_count) as totalCount',
            'COUNT(DebateComment.id) as commentCount']);
        query.groupBy('DebateComment.debate_id');
        query.where('DebateComment.debate_id IN (:...ids)' + approveStmt, { ids: debateIds });
        query.orderBy('totalCount', 'DESC');

        console.log(query.getQuery());
        return query.getRawMany();
    }
}
