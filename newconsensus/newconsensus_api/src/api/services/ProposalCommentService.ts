/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { ProposalComments } from '../models/ProposalComments';
import { ProposalCommentRepository } from '../repositories/ProposalCommentRepository';
import { SearchUtil as searchUtil } from '../../utils/SearchUtil';
import { PageUserLikeProposalCommentService } from './PageUserLikeProposalCommentService';
import { PageUserLikeProposalComments } from '../models/PageUserLikeProposalComments';

@Service()
export class ProposalCommentService {

    constructor(
        @OrmRepository() private proposalCommentRepository: ProposalCommentRepository,
        @Logger(__filename) private log: LoggerInterface,
        private pageUserLikeProposalCommentService: PageUserLikeProposalCommentService
    ) { }

    // find ProposalComments
    public findOne(findCondition: any): Promise<any> {
        return this.proposalCommentRepository.findOne(findCondition);
    }

    // findById ProposalComments
    public findById(id: any): Promise<any> {
        return this.proposalCommentRepository.findByIds(id);
    }

    // ProposalComments search
    public async search(limit: number, offset: number, select: any = [], relation: any[], whereConditions: any = [], orderBy: any, count: boolean, join?: any): Promise<any> {
        const condition: any = searchUtil.createFindCondition(limit, offset, select, relation, whereConditions, orderBy, join);

        if (count) {
            const commentCount = await this.proposalCommentRepository.count(condition);
            return commentCount;
        } else {
            return this.proposalCommentRepository.find(condition);
        }
    }

    // create ProposalComments
    public async create(proposal: ProposalComments): Promise<ProposalComments> {
        this.log.info('Create a new proposal comment => ', proposal.toString());
        const newProposal = await this.proposalCommentRepository.save(proposal);
        return newProposal;
    }

    // update ProposalComments
    public update(id: any, proposal: ProposalComments): Promise<ProposalComments> {
        this.log.info('Update a proposal comment');
        proposal.id = id;
        return this.proposalCommentRepository.save(proposal);
    }

    // delete ProposalComments
    public async delete(id: number): Promise<any> {
        this.log.info('Delete a proposal comment');
        const newProposal = await this.proposalCommentRepository.delete(id);
        return newProposal;
    }

    // delete ProposalComments form Proposal
    public async deleteFromProposal(user: any, condition?: any): Promise<any> {

        if (user !== null && user !== undefined && condition !== null && condition !== undefined && condition.id !== undefined) {
            this.pageUserLikeProposalCommentService.deleteFromComment(user, condition.id);
        }

        this.log.info('Delete a proposal comment: ' + condition);
        const newProposal = await this.proposalCommentRepository.delete(condition);
        return newProposal;
    }

    // find ProposalComments
    public findAll(findCondition: any): Promise<any> {
        this.log.info('Find all proposal comment');
        return this.proposalCommentRepository.find(findCondition);
    }

    // like comment
    public async likeProposalComment(user: any, pId: number, pCId: number, islike: boolean): Promise<any> {
        // check page user like vote

        if (user === null || user === undefined) {
            return new Promise((resolve, reject) => {
                resolve(undefined);
            });
        }

        if (pId === null || pId === undefined) {
            return new Promise((resolve, reject) => {
                resolve(undefined);
            });
        }

        const pageUserLikeProposalComments = await this.pageUserLikeProposalCommentService.findOne({
            where: {
                proposalCommentId: pCId,
                userId: user.id,
            },
        });

        const proposalComment: ProposalComments = await this.findOne({
            where: {
                id: pCId,
                proposalId: pId,
            },
        });

        if (proposalComment === null || proposalComment === undefined) {
            return new Promise((resolve, reject) => {
                resolve(undefined);
            });
        }

        // page like propoasl comment
        if ((pageUserLikeProposalComments === null || pageUserLikeProposalComments === undefined) && (islike.toString() === 'true' || islike.toString() === '1')) {
            // like comment
            const newPageUserLikeProposalComments = new PageUserLikeProposalComments();
            newPageUserLikeProposalComments.userId = user.id;
            newPageUserLikeProposalComments.proposalCommentId = pCId;
            newPageUserLikeProposalComments.isLike = true;
            proposalComment.likeCount += 1;
            this.pageUserLikeProposalCommentService.create(newPageUserLikeProposalComments);

        } else if ((pageUserLikeProposalComments === null || pageUserLikeProposalComments === undefined) && (islike.toString() === 'false' || islike.toString() === '0')) {
            // dislike comment
            const newPageUserLikeProposalComments = new PageUserLikeProposalComments();
            newPageUserLikeProposalComments.userId = user.id;
            newPageUserLikeProposalComments.proposalCommentId = pCId;
            newPageUserLikeProposalComments.isLike = false;
            proposalComment.dislikeCount += 1;

            this.pageUserLikeProposalCommentService.create(newPageUserLikeProposalComments);

        } else if ((pageUserLikeProposalComments !== null && pageUserLikeProposalComments !== undefined) && (islike.toString() === 'true' || islike.toString() === '1')) {
            if (!pageUserLikeProposalComments.isLike) {
                proposalComment.dislikeCount -= 1;
                proposalComment.likeCount += 1;
                pageUserLikeProposalComments.isLike = true;
                this.pageUserLikeProposalCommentService.create(pageUserLikeProposalComments);
            } else {

                return this.deleteLikeProposalComment(user, pId, pageUserLikeProposalComments.proposalCommentId);
            }

        } else if ((pageUserLikeProposalComments !== null && pageUserLikeProposalComments !== undefined) && (islike.toString() === 'false' || islike.toString() === '0')) {
            if (pageUserLikeProposalComments.isLike) {

                proposalComment.likeCount -= 1;
                proposalComment.dislikeCount += 1;
                pageUserLikeProposalComments.isLike = false;
                this.pageUserLikeProposalCommentService.create(pageUserLikeProposalComments);
            } else {
                return this.deleteLikeProposalComment(user, pId, pageUserLikeProposalComments.proposalCommentId);
            }
        }

        return this.update(proposalComment.id, proposalComment);
    }

    // remove like comment
    public async deleteLikeProposalComment(user: any, pId: number, pCId: number): Promise<any> {

        if (user === null || user === undefined) {
            return new Promise((resolve, reject) => {
                resolve(undefined);
            });
        }

        if (pCId === null || pCId === undefined) {
            return new Promise((resolve, reject) => {
                resolve(undefined);
            });
        }

        if (pId === null || pId === undefined) {
            return new Promise((resolve, reject) => {
                resolve(undefined);
            });
        }

        const pageUserLikeProposalComments = await this.pageUserLikeProposalCommentService.findOne({
            where: {
                userId: user.id,
                proposalCommentId: pCId,
            },
        });

        const proposalComments: ProposalComments = await this.findOne({
            where: {
                id: pCId,
                proposalId: pId,
            },
        });

        if (proposalComments === null || proposalComments === undefined) {
            return new Promise((resolve, reject) => {
                resolve(undefined);
            });
        }

        if ((pageUserLikeProposalComments !== null && pageUserLikeProposalComments !== undefined)) {

            if (!pageUserLikeProposalComments.isLike) {

                proposalComments.dislikeCount -= 1;
                this.pageUserLikeProposalCommentService.delete(pageUserLikeProposalComments.userId, pageUserLikeProposalComments.proposalCommentId);

            } else {

                proposalComments.likeCount -= 1;
                this.pageUserLikeProposalCommentService.delete(pageUserLikeProposalComments.userId, pageUserLikeProposalComments.proposalCommentId);

            }
        }
        return this.update(proposalComments.id, proposalComments);
    }

    public async countComment(proposalIds: number[], isApproveComment?: boolean): Promise<any> {
        return new Promise((resolve, reject) => {
            this.proposalCommentRepository.countComment(proposalIds, isApproveComment).then((result: any) => {
                const propCountMap = {};
                if (Array.isArray(result)) {
                    for (const item of result) {
                        propCountMap[item.proposalId] = item.count;
                    }
                }
                resolve(propCountMap);
            }).catch((error) => { reject(error); });
        });
    }

    public async countProposalCommentLike(proposalIds: number[], isApproveComment?: boolean): Promise<any> {
        return new Promise((resolve, reject) => {
            this.proposalCommentRepository.countProposalCommentLike(proposalIds, isApproveComment).then((result: any) => {
                const propCountMap = {};
                if (Array.isArray(result)) {
                    for (const item of result) {
                        const likeCount = item.likeCount;
                        const dislikeCount = item.dislikeCount;
                        const totalCount = item.totalCount;
                        const commentCount = item.commentCount;
    
                        propCountMap[item.proposalId] = {
                            likeCount,
                            dislikeCount,
                            totalCount,
                            commentCount
                        };
                    }
                }
                resolve(propCountMap);
            }).catch((error) => { reject(error); });
        });
    }

}
