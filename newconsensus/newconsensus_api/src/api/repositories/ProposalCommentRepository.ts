/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import { EntityRepository, Repository } from 'typeorm';
import { ProposalComments } from '../models/ProposalComments';
// import { SearchUtil } from '../../utils/SearchUtil';

@EntityRepository(ProposalComments)
export class ProposalCommentRepository extends Repository<ProposalComments>  {

    public async countComment(proposalIds: number[], isApproveComment?: boolean): Promise<any> {
        if (proposalIds === undefined || proposalIds === null || proposalIds.length <= 0) {
            return Promise.resolve([]);
        }

        let approveStmt = '';
        if (isApproveComment !== undefined) {
            if (isApproveComment) {
                approveStmt = ' and ProposalComments.approve_user_id is not null';
            } else {
                approveStmt = ' and ProposalComments.approve_user_id is null';
            }
        }

        const query: any = await this.manager.createQueryBuilder(ProposalComments, 'ProposalComments');
        query.select(['ProposalComments.proposal_id as proposalId', 'COUNT(ProposalComments.id) as count']);
        query.where('ProposalComments.proposal_id IN (:...ids)' + approveStmt, { ids: proposalIds });
        query.groupBy('proposalId');
        query.orderBy('proposalId', 'DESC');
        console.log(query.getQuery());
        return query.getRawMany();
    }

    public async countProposalCommentLike(proposalIds?: number[], isApproveComment?: boolean): Promise<any> {
        if (proposalIds === undefined || proposalIds === null || proposalIds.length <= 0) {
            return Promise.resolve({});
        }

        let approveStmt = '';
        if (isApproveComment !== undefined) {
            if (isApproveComment) {
                approveStmt = ' and ProposalComments.approve_user_id is not null';
            } else {
                approveStmt = ' and ProposalComments.approve_user_id is null';
            }
        }

        const query: any = await this.manager.createQueryBuilder(ProposalComments, 'ProposalComments');
        query.select(['ProposalComments.proposal_id as proposalId', 'SUM(ProposalComments.like_count) as likeCount', 'SUM(ProposalComments.dislike_count) as dislikeCount',
            'SUM(ProposalComments.like_count + ProposalComments.dislike_count) as totalCount',
            'COUNT(ProposalComments.id) as commentCount']);
        query.groupBy('ProposalComments.proposal_id');
        query.where('ProposalComments.proposal_id IN (:...ids)' + approveStmt, { ids: proposalIds });
        query.orderBy('totalCount', 'DESC');

        console.log(query.getQuery());
        return query.getRawMany();
    }

}
