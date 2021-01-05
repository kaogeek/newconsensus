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
import { VoteCommentRepository } from '../repositories/VoteCommentRepository';
import { SearchUtil } from '../../utils/SearchUtil';
import { ObjectUtil } from '../../utils/ObjectUtil';
import { VoteComment } from '../models/VoteComment';
import { PageUserLikeVoteComment } from '../models/PageUserLikeVoteComment';
import { PageUserLikeVoteCommentService } from './PageUserLikeVoteCommentService';
import { Vote } from '../models/Vote';
import { VoteRepository } from '../repositories/VoteRepository';
import { PageUserService } from '../services/PageUserService';
import { SearchFilter } from '../controllers/requests/SearchFilterRequest';

@Service()
export class VoteCommentService {

    constructor(@OrmRepository() private repository: VoteCommentRepository, @Logger(__filename) private log: LoggerInterface,
        private pageUserLikeVoteCommentService: PageUserLikeVoteCommentService, @OrmRepository() private voteService: VoteRepository,
        private pageuserService: PageUserService) {
    }

    public async calculateVoteCount(voteId: any, count: number): Promise<any> {
        const vote: Vote = await this.voteService.findOne({
            where: {
                id: voteId,
            },
        });

        if (vote === null || vote === undefined) {
            return new Promise((resolve, reject) => {
                reject('Vote was not found');
            });
        }

        vote.voteCount += count;

        await this.voteService.update(voteId, vote);
    }

    // create VoteComment
    public async create(user: any, voteComment: VoteComment): Promise<any> {
        voteComment.createdBy = user.id;
        voteComment.createdByUsername = user.username;

        this.log.info('Create Vote Commnet');

        return new Promise(async (resolve, reject) => {
            try {
                const data: any = await this.repository.save(voteComment);

                await this.calculateVoteCount(voteComment.voteId, 1);

                const pageUser = await this.pageuserService.findOne(data.createdBy);

                if (pageUser !== undefined) {
                    // fetch page user  
                    data.pageUser = ObjectUtil.createNewObjectWithField(pageUser, undefined);
                }

                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    }

    // edit VoteComment
    // public edit(user: any, content: any, voteComment: any): Promise<UpdateResult> {

    //     voteComment.modifiedBy = user.id;
    //     voteComment.modifiedByUsername = user.username;

    //     this.log.info('Edit Vote Commnet');

    //     return this.repository.update(content, voteComment);
    // }

    // update VoteComment
    public update(id: any, voteComment: any): Promise<VoteComment> {
        voteComment.id = id;

        return new Promise((resolve, reject) => {
            this.repository.save(voteComment).then(async (resultComment: any) => {
                if (resultComment !== undefined) {
                    const user = await this.pageuserService.findOne(resultComment.createdBy);
                    const showFields = ['firstName', 'lastName','email'];

                    if (user !== undefined) {
                        // fetch page user 
                        voteComment.pageUser = ObjectUtil.createNewObjectWithField(user, showFields);
                    }
                }

                this.log.info('Update Vote Commnet ID: ' + voteComment.id);

                resolve(voteComment);
            }).catch((error: any) => {
                reject(error);
            });
        });
    }

    // findone VoteComment
    public findOne(content: any): Promise<any> {
        return this.repository.findOne(content);
    }

    // delete Vote
    public async deleteVoteComment(content: any, user?: any): Promise<any> {

        const pId: any = content.id;
        const pVoteId: any = content.voteId;

        const data: any = await this.delete(content, user);

        let pResult = false;

        if (data !== null && data !== undefined) {
            pResult = data.affected > 0;
        } else {
            pResult = false;
        }

        await this.calculateVoteCount(pVoteId, -1);

        return new Promise((resolve, reject) => {
            resolve({
                id: pId,
                voteId: pVoteId,
                result: pResult,
            });
        });
    }

    // delete VoteComment
    public async delete(content: any, user?: any): Promise<any> {
        this.log.info('Delete Vote Commnet');

        const comments: any[] = await this.repository.find(content);

        const uId: any = user !== null && user !== undefined ? user.id : undefined;

        for (const c of comments) {
            await this.pageUserLikeVoteCommentService.delete(uId, c.id);
        }

        return this.repository.delete(content);
    }

    // VoteComment List
    public search(filter: SearchFilter, join?: any): Promise<any> {
        const limits = SearchUtil.getSearchLimit(filter.limit);
        const condition: any = SearchUtil.createFindCondition(limits, filter.offset, filter.select, filter.relation, filter.whereConditions, filter.orderBy, join);

        if (filter.count) {
            return this.repository.count(condition);
        } else {
            return this.repository.find(condition);
        }
    }

    // find VoteComment
    public find(content: any): Promise<any> {
        return this.repository.find(content);
    }

    // like VoteComment
    public async like(pUserId: any, pVoteId: number, pVoteCommentId: number, islike: boolean): Promise<any> {
        // check page user like vote

        if (pUserId === null || pUserId === undefined) {
            return new Promise((resolve, reject) => {
                reject('UserId is null');
            });
        }

        if (pVoteCommentId === null || pVoteCommentId === undefined) {
            return new Promise((resolve, reject) => {
                reject('VoteCommentId is null');
            });
        }

        const pageUserLikeVote = await this.pageUserLikeVoteCommentService.findOne({
            where: {
                userId: pUserId,
                voteCommentId: pVoteCommentId,
            },
        });

        const voteComment: VoteComment = await this.findOne({
            where: {
                id: pVoteCommentId,
                voteId: pVoteId,
            },
        });

        if (voteComment === null || voteComment === undefined) {
            return new Promise((resolve, reject) => {
                reject('VoteCommentId was not found');
            });
        }

        let likeOld: boolean = undefined;

        if (pageUserLikeVote !== null && pageUserLikeVote !== undefined) {
            likeOld = pageUserLikeVote.isLike;
        }

        // like or dislike 
        // update
        if (pageUserLikeVote !== null && pageUserLikeVote !== undefined) {
            pageUserLikeVote.isLike = islike;

            await this.pageUserLikeVoteCommentService.update(pageUserLikeVote);

            if (islike && !likeOld) {
                // change dislike to like
                voteComment.likeCount += 1;
                voteComment.dislikeCount -= 1;
            } else if (!islike && likeOld) {
                // change like to dislike
                voteComment.dislikeCount += 1;
                voteComment.likeCount -= 1;
            } else {
                // same like dislike
                return this.deleteLike(pUserId, pVoteId, pVoteCommentId, true);
            }
        } else {
            if (islike !== null && islike !== undefined) {
                // create 
                const data: PageUserLikeVoteComment = new PageUserLikeVoteComment();

                data.userId = pUserId;
                data.voteCommentId = pVoteCommentId;
                data.isLike = islike;

                await this.pageUserLikeVoteCommentService.create(data);

                if (islike) {
                    voteComment.likeCount += 1;
                } else {
                    voteComment.dislikeCount += 1;
                }
            }
        }

        return this.update(pVoteCommentId, voteComment);
    }

    // Delete Like VoteComment
    public async deleteLike(pUserId: any, pVoteId: number, pVoteCommentId: number, deleteLike: boolean): Promise<any> {
        if (pUserId === null || pUserId === undefined) {
            return new Promise((resolve, reject) => {
                reject('UserId is null');
            });
        }

        if (pVoteCommentId === null || pVoteCommentId === undefined) {
            return new Promise((resolve, reject) => {
                reject('VoteCommentId is null');
            });
        }

        const pageUserLikeVote = await this.pageUserLikeVoteCommentService.findOne({
            where: {
                userId: pUserId,
                voteCommentId: pVoteCommentId,
            },
        });

        const voteComment: VoteComment = await this.findOne({
            where: {
                id: pVoteCommentId,
                voteId: pVoteId,
            },
        });

        if (voteComment === null || voteComment === undefined) {
            return new Promise((resolve, reject) => {
                reject('VoteCommentId was not found');
            });
        }

        // unlike and undislike 
        if ((deleteLike) && (pageUserLikeVote !== null && pageUserLikeVote !== undefined)) {
            // delete
            await this.pageUserLikeVoteCommentService.delete(pUserId, pVoteCommentId);
            
            if (pageUserLikeVote.isLike) {
                if (voteComment.likeCount > 0) {
                    voteComment.likeCount -= 1;
                }
            } else {
                if (voteComment.dislikeCount > 0) {
                    voteComment.dislikeCount -= 1;
                }
            }
        }

        return this.update(pVoteCommentId, voteComment);
    }

    public async countVoteCommentLike(voteIds: number[], isApproveComment?: boolean): Promise<any> {
        return new Promise((resolve, reject) => {
            this.repository.countVoteCommentLike(voteIds, isApproveComment).then((result: any) => {
                const propCountMap = {};
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
                resolve(propCountMap);
            }).catch((error) => { reject(error); });
        });
    }

    public async countCommentByValue(voteIds: number[], isApproveComment?: boolean): Promise<any> {
        return new Promise((resolve, reject) => {
            this.repository.countCommentByValue(voteIds, isApproveComment).then((result: any) => {
                const propCountMap = {};
                for (const item of result) {
                    const voteValue = item.voteValue;
                    const voteCount = parseInt(item.count, undefined);

                    if (propCountMap[item.voteId] === undefined) {
                        propCountMap[item.voteId] = {
                            agree: 0,
                            disagree: 0,
                            noComment: 0
                        };
                    }

                    const countObj = propCountMap[item.voteId];
                    if (voteValue === 0) {
                        // no comment
                        countObj.noComment = countObj.noComment + voteCount;
                    } else if (voteValue === 1) {
                        // agree
                        countObj.agree = countObj.agree + voteCount;
                    } else if (voteValue === -1) {
                        // disagree
                        countObj.disagree = countObj.disagree + voteCount;
                    }
                }
                resolve(propCountMap);
            }).catch((error) => { reject(error); });
        });
    }
}
