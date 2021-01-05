/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Between } from 'typeorm';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Vote } from '../models/Vote';
import { VoteRepository } from '../repositories/VoteRepository';
import VoteResponses from '../controllers/responses/VoteResponses';
import { SearchUtil } from '../../utils/SearchUtil';
import { SearchFilter } from '../controllers/requests/SearchFilterRequest';
import { VoteCommentService } from './VoteCommentService';
import { PageUserLikeVoteService } from './PageUserLikeVoteService';
import { PageUserLikeVote } from '../models/PageUserLikeVote';
import { ProposalService } from './ProposalService';
import { RoomService } from './RoomService';
import { PageUserLikeVoteCommentService } from './PageUserLikeVoteCommentService';
import { DEFAULT_HOT_TOPIC_CALCULATE_CONFIG, VOTE_COMMENT_APPROVE_REQUIRED_CONFIG } from '../../Constants';
import { DecayFunctionUtil } from '../../utils/DecayFunctionUtil';
import { TagAppearanceService } from '../services/TagAppearanceService';
import { TAG_CONTENT_TYPE } from '../../TagContentType';
import { ConfigService } from './ConfigService';
import { ActionLogService } from './ActionLogService';
import { ACTION_LOG } from '../../ActionContentLog';

const PERCENT = 100;

@Service()
export class VoteService {

    constructor(@OrmRepository() private repository: VoteRepository,
        @Logger(__filename) private log: LoggerInterface,
        private voteCommentService: VoteCommentService,
        private pageUserLikeVoteService: PageUserLikeVoteService,
        private pageUserLikeVoteCommentService: PageUserLikeVoteCommentService,
        private proposalService: ProposalService,
        private roomService: RoomService, 
        private configService: ConfigService,
        private actionLogService: ActionLogService,
        private tagAppearanceService: TagAppearanceService) {
    }

    public percentVote(count: number, countAll: number): number {
        if (countAll <= 0) {
            return 0;
        }
        return (count / countAll) * PERCENT;
    }

    public errorVote(perNoComment: number, perError: number): number {
        if (perError > 100) {
            return perNoComment -= (perError - 100);
        } else {
            return perNoComment += (100 - perError);
        }
    }

    public getResponsesData(): any {
        return VoteResponses.data();
    }

    public async isContainsProposalId(id: any): Promise<boolean> {
        let isHasData = false;

        if (id !== null && id !== undefined) {

            const dId: any = await this.proposalService.findOne(id);

            isHasData = (dId !== null && dId !== undefined);
        }

        return new Promise<boolean>((resolve) => {
            resolve(isHasData);
        });
    }

    public async isRoomId(id: any): Promise<boolean> {
        let isHasData = false;

        if (id !== null && id !== undefined) {

            const dId: any = await this.roomService.findOne(id);

            isHasData = (dId !== null && dId !== undefined);
        }

        return new Promise<boolean>((resolve) => {
            resolve(isHasData);
        });
    }

    // create Vote
    public async create(user: any, vote: Vote, relateTags?: string[]): Promise<any> {

        if (vote === null || vote === undefined) {
            return new Promise((resolve, reject) => {
                reject('Vote is null');
            });
        }

        // if (vote.roomId === null || vote.roomId === undefined) {
        //     return new Promise((resolve, reject) => {
        //         reject('RoomId is null');
        //     });
        // }

        if (vote.proposalId !== null && vote.proposalId !== undefined) {

            const hasData: boolean = await this.isContainsProposalId(vote.proposalId);

            if (!hasData) {
                return new Promise((resolve, reject) => {
                    reject('ProposalId was not found');
                });
            }
        }

        if (vote.roomId !== null && vote.roomId !== undefined) {

            const hasData: boolean = await this.isRoomId(vote.roomId);

            if (!hasData) {
                return new Promise((resolve, reject) => {
                    reject('RoomId was not found');
                });
            }
        }

        vote.createdBy = user.id;
        vote.createdByUsername = user.username;

        this.log.info('Create Vote');

        const newVote = await this.repository.save(vote);

        await this.tagAppearanceService.createTagAppearance(newVote, relateTags, TAG_CONTENT_TYPE.VOTE, user);
         
        return this.repository.save(newVote);
    }

    // update Vote
    public async update(user: any, vote: Vote, relateTags?: string[]): Promise<Vote> {

        // if (vote.roomId === null || vote.roomId === undefined) {
        //     return new Promise<Vote>((resolve, reject) => {
        //         reject('RoomId is null');
        //     });
        // }

        if (vote.proposalId !== null && vote.proposalId !== undefined) {

            const hasData: boolean = await this.isContainsProposalId(vote.proposalId);

            if (!hasData) {
                return new Promise<Vote>((resolve, reject) => {
                    reject('ProposalId was not found');
                });
            }
        }

        if (vote.roomId !== null && vote.roomId !== undefined) {

            const hasData: boolean = await this.isRoomId(vote.roomId);

            if (!hasData) {
                return new Promise<Vote>((resolve, reject) => {
                    reject('RoomId was not found');
                });
            }
        }

        vote.modifiedBy = user.id;
        vote.modifiedByUsername = user.username;

        this.log.info('Update Vote');

        const newVote = await this.repository.save(vote);

        await this.tagAppearanceService.updateTagAppearance(newVote, relateTags, TAG_CONTENT_TYPE.VOTE, user);

        return newVote;
    }

    // findone Vote
    public findOne(content: any): Promise<any> {
        return this.repository.findOne(content);
    }

    // delete Vote
    public async delete(pId: number, user?: any): Promise<any> {

        // delete vote not used user

        const data: any = await this.repository.delete(pId);

        await this.pageUserLikeVoteService.delete(undefined, pId);

        await this.voteCommentService.delete({
            voteId: pId,
        });

        let pResult = false;

        if (data !== null && data !== undefined) {
            pResult = data.affected > 0;
        } else {
            pResult = false;
        }

        this.log.info('Delete Vote');

        this.tagAppearanceService.delete({
            where: {
                contentId: pId,
                type: TAG_CONTENT_TYPE.VOTE,
            },
        });

        return new Promise((resolve, reject) => {
            resolve({
                id: pId,
                result: pResult,
            });
        });
    }

    // Vote List
    public search(filter: SearchFilter): Promise<any> {
        const condition: any = SearchUtil.createFindCondition(filter.limit, filter.offset, filter.select, filter.relation, filter.whereConditions, filter.orderBy);

        if (filter.count) {
            return this.repository.count(condition);
        } else {
            return this.repository.find(condition);
        }
    }

    // find Vote
    public find(content: any): Promise<any> {
        return this.repository.find(content);
    }

    public async findId(voteId: number, userLikeId?: number): Promise<any> {
        const result: any = this.getResponsesData();

        const data: any = await this.findOne({
            where: {
                id: voteId,
            },
            join: {
                alias: 'vote',
                leftJoinAndSelect: {
                    pageuser: 'vote.user',
                    proposal: 'vote.proposal',
                }
            }
        });

        // can't find from Id 
        if (data === null || data === undefined) {
            return new Promise((resolve, reject) => {
                reject('Vote was not found');
            });
        }

        result.id = data.id;
        result.vote = data;
        // result.vote.pageUser = data.vote.user;

        const voteComments: any[] = await this.voteCommentService.find({
            where: {
                voteId: result.id,
            },
            join: {
                alias: 'voteComment',
                leftJoinAndSelect: {
                    pageuser: 'voteComment.pageUser',
                }
            }
        });

        if (voteComments === null || voteComments === undefined) {
            return new Promise((resolve, reject) => {
                reject('voteComment was not found');
            });
        }

        let countAgree = 0;
        let countDisAgree = 0;
        let countNoComment = 0;
        let countAll = 0;

        countAll = voteComments.length;

        for (const re of voteComments) {

            const puLikeComment = await this.pageUserLikeVoteCommentService.findOne({
                where: {
                    userId: userLikeId ? userLikeId : re.createdBy,
                    voteCommentId: re.id,
                },
            });

            const cmLike: any = (puLikeComment !== null && puLikeComment !== undefined) ? puLikeComment.isLike : undefined;

            const cVoteComment: any = {};

            cVoteComment.data = re;
            // cVoteComment.isUserLike = cmLike;
            const cleanVoteComment = this.cleanPageUserField(cVoteComment.data);
            cleanVoteComment.isUserLike = cmLike;

            if (re.value === 1) {
                countAgree++;
                result.voteComment.agree.voteComments.push(cleanVoteComment);
            } else if (re.value === -1) {
                countDisAgree++;
                result.voteComment.disagree.voteComments.push(cleanVoteComment);
            } else {
                countNoComment++;
                result.voteComment.noComment.voteComments.push(cleanVoteComment);
            }
        }

        try {
            if (countAll > 0) {
                // 
                result.voteComment.agree.percent = this.percentVote(countAgree, countAll);
                result.voteComment.disagree.percent = this.percentVote(countDisAgree, countAll);
                result.voteComment.noComment.percent = this.percentVote(countNoComment, countAll);
                // 
                const perError: number = result.voteComment.agree.percent + result.voteComment.disagree.percent + result.voteComment.noComment.percent;

                result.voteComment.noComment.percent = this.errorVote(result.voteComment.noComment.percent, perError);
            }
        } catch (error) {
            return new Promise((resolve, reject) => {
                reject(error);
            });
        }

        return new Promise((resolve, reject) => {
            resolve(result);
        });
    }

    // find hot
    public async findHot(startDate: Date, endDate: Date, roomId?: number, limit?: number): Promise<any> {

        const searchfilter: SearchFilter = new SearchFilter();
        if (limit !== undefined) {
            if (limit > 200) {
                limit = 200;
            }
        }

        let stmtObj = undefined;
        if (startDate && endDate) {
            stmtObj = {
                createdDate: Between(startDate, endDate)
            };
        }

        if (roomId !== undefined) {
            if (stmtObj === undefined) {
                stmtObj = {};
            }

            stmtObj.roomId = roomId;
        }

        if (stmtObj) {
            searchfilter.whereConditions = [stmtObj];
        }

        const ids = [];
        const idsString = [];
        const findResult = await this.search(searchfilter);
        for (const item of findResult) {
            item.agree = 0;
            item.disagree = 0;
            item.noComment = 0;
            item.agreePercent = 0;
            item.disagreePercent = 0;
            item.noCommentPercent = 0;
            ids.push(item.id);
            idsString.push(item.id+'');
        }

        // ([W + AX + BY + CZ] as baseScore) * decay(t)
        // A = จำนวน. like+Dislike ของ Topic, B = จำนวน. Comment, C = จำนวน like+Dislike ของ comment, D = จำนวน view
        const w = DEFAULT_HOT_TOPIC_CALCULATE_CONFIG.WEIGHT;
        const x = DEFAULT_HOT_TOPIC_CALCULATE_CONFIG.WEIGHT_X;
        const y = DEFAULT_HOT_TOPIC_CALCULATE_CONFIG.WEIGHT_Y;
        const z = DEFAULT_HOT_TOPIC_CALCULATE_CONFIG.WEIGHT_Z;
        const v = DEFAULT_HOT_TOPIC_CALCULATE_CONFIG.WEIGHT_V;

        let isApproveComment = false;
        const approveCommentConfig = await this.configService.getConfig(VOTE_COMMENT_APPROVE_REQUIRED_CONFIG);
        if (approveCommentConfig && approveCommentConfig.value) {
            if (approveCommentConfig.value === 'true') {
                isApproveComment = true;
            }
        }

        const voteLikeMap = await this.countVoteLike(ids);
        const commentCountMap = await this.voteCommentService.countVoteCommentLike(ids, isApproveComment);
        const commentValueMap = await this.voteCommentService.countCommentByValue(ids, isApproveComment);
        const voteViewMap = await this.countVoteView(idsString);
        const dateArray: Date[] = [];

        let result: any = [];
        const baseScoreMap: any = {};

        for (const item of findResult) {
            const voteId = item.id;
            const voteCreated = item.createdDate;
            const voteLike = voteLikeMap[voteId];
            const voteCommentLike = commentCountMap[voteId];
            const voteView = voteViewMap[voteId];
            const voteValueAgree = commentValueMap[voteId] ? commentValueMap[voteId].agree : 0;
            const voteValuedisagree = commentValueMap[voteId] ? commentValueMap[voteId].disagree : 0;
            const voteValueNoComment = commentValueMap[voteId] ? commentValueMap[voteId].noComment : 0;
            const voteCount = voteValueAgree + voteValuedisagree + voteValueNoComment;

            item.agree = voteValueAgree;
            item.disagree = voteValuedisagree;
            item.noComment = voteValueNoComment;
            item.agreePercent = voteCount > 0 ? (voteValueAgree / voteCount) * 100 : 0;
            item.disagreePercent = voteCount > 0 ? (voteValuedisagree / voteCount) * 100 : 0;
            item.noCommentPercent = voteCount > 0 ? (voteValueNoComment / voteCount) * 100 : 0;

            const a = (voteLike !== undefined) ? voteLike.totalCount : 0;
            const b = (voteCommentLike !== undefined) ? voteCommentLike.commentCount : 0;
            const c = (voteCommentLike !== undefined) ? voteCommentLike.totalCount : 0;
            const d = (voteView !== undefined) ? voteView.totalCount : 0;
            const baseScore = (w + (a * x) + (b * y) + (c * z) + (d * v));

            baseScoreMap[voteId] = baseScore;

            if (voteCreated) {
                dateArray.push(item.createdDate);
            }
        }

        // const decayMap: any = DecayFunctionUtil.generateLinearDecayMap(startDate, endDate, dateArray, 'day', 3, 0.1);
        const decayMap: any = DecayFunctionUtil.generateExpoDecayMap(startDate, endDate, dateArray, 'day', 3, 0.75);
        // const decayMap: any = DecayFunctionUtil.generateF1DecayMap(startDate, endDate, dateArray, 'day', 3, 0.7);

        // Hot
        for (const item of findResult) {
            const voteId = item.id;
            const voteCreated = item.createdDate.toISOString();
            const baseScore = baseScoreMap[voteId] ? baseScoreMap[voteId] : 0;
            const decayValue = decayMap[voteCreated] ? decayMap[voteCreated] : 0;

            result.push({
                score: (baseScore * decayValue),
                vote: item
            });
        }

        result = result.sort((obj1: any, obj2: any) => {
            if (obj1.score < obj2.score) {
                return 1;
            } else if (obj1.score > obj2.score) {
                return -1;
            }
            return 0;
        }).map((item: any) => {
            return item.vote;
        });

        if (limit !== undefined) {
            const limitIds = [];
            for (let i = 0; i < limit; i++) {
                const vote = result[i];

                if (i < result.length) {
                    limitIds.push(vote);
                }
            }

            result = limitIds;
        }

        return Promise.resolve(result);
    }

    public findCommentCountById(id: number): Promise<any> {

        const searchfilter: SearchFilter = new SearchFilter();

        searchfilter.whereConditions = [{
            voteId: id,
        }];
        searchfilter.count = true;

        return this.voteCommentService.search(searchfilter);
    }

    public async likeVote(pUserId: any, pVoteId: number, islike: boolean): Promise<any> {
        // check page user like vote
        if (pUserId === null || pUserId === undefined) {
            return new Promise((resolve, reject) => {
                reject('UserId is null');
            });
        }

        if (pVoteId === null || pVoteId === undefined) {
            return new Promise((resolve, reject) => {
                reject('VoteId is null');
            });
        }

        const pageUserLikeVote = await this.pageUserLikeVoteService.findOne({
            where: {
                userId: pUserId,
                voteId: pVoteId,
            },
        });

        const vote: Vote = await this.findOne(pVoteId);

        if (vote === null || vote === undefined) {
            return new Promise((resolve, reject) => {
                reject('VoteId was not found');
            });
        }

        let likeOld: boolean = undefined;

        if (pageUserLikeVote !== null && pageUserLikeVote !== undefined) {
            likeOld = pageUserLikeVote.isLike;
        }

        // update
        if (pageUserLikeVote !== null && pageUserLikeVote !== undefined) {
            pageUserLikeVote.isLike = islike;
            await this.pageUserLikeVoteService.update(pageUserLikeVote);
            if (islike && !likeOld) {
                // change dislike to like
                vote.likeCount += 1;
                vote.dislikeCount -= 1;
            } else if (!islike && likeOld) {
                // change like to dislike
                vote.dislikeCount += 1;
                vote.likeCount -= 1;
            } else {
                // same like dislike
                return this.deleteLikeVote(pUserId, pVoteId, true);
            }
        } else {
            if (islike !== null && islike !== undefined) {
                // create 
                const data: PageUserLikeVote = new PageUserLikeVote();

                data.userId = pUserId;
                data.voteId = pVoteId;
                data.isLike = islike;

                await this.pageUserLikeVoteService.create(data);

                if (islike) {
                    vote.likeCount += 1;
                } else {
                    vote.dislikeCount += 1;
                }
            }
        }

        return this.update(pVoteId, vote);
    }

    public async deleteLikeVote(pUserId: any, pVoteId: number, deleteLike: boolean): Promise<any> {
        // check page user like vote

        if (pUserId === null || pUserId === undefined) {
            return new Promise((resolve, reject) => {
                reject('UserId is null');
            });
        }

        if (pVoteId === null || pVoteId === undefined) {
            return new Promise((resolve, reject) => {
                reject('VoteId is null');
            });
        }

        const pageUserLikeVote = await this.pageUserLikeVoteService.findOne({
            where: {
                userId: pUserId,
                voteId: pVoteId,
            },
        });

        const vote: Vote = await this.findOne(pVoteId);

        if (vote === null || vote === undefined) {
            return new Promise((resolve, reject) => {
                reject('VoteId was not found');
            });
        }

        // unlike and undislike 
        if ((deleteLike) && (pageUserLikeVote !== null && pageUserLikeVote !== undefined)) {
            try {
                // delete
                await this.pageUserLikeVoteService.delete(pageUserLikeVote.userId, pVoteId);
            } catch (error) {
                return new Promise((resolve, reject) => {
                    reject(error);
                });
            }

            if (pageUserLikeVote.isLike) {
                if (vote.likeCount > 0) {
                    vote.likeCount -= 1;
                }
            } else {
                if (vote.dislikeCount > 0) {
                    vote.dislikeCount -= 1;
                }
            }

            this.log.info('Delete Like');
        } else {
            return new Promise((resolve, reject) => {
                reject('Can not Delete');
            });
        }

        return this.update(pVoteId, vote);
    }

    public cleanVotesPageUser(toRemoveList: any[]): any[] {
        const clearResult: any[] = [];

        if (toRemoveList !== undefined && toRemoveList !== null) {
            for (let item of toRemoveList) {
                item = this.cleanPageUserField(item);
                clearResult.push(item);
            }
        }

        return clearResult;
    }

    public cleanUserField(vote: any): any {
        if (vote !== undefined && vote !== null) {
            if (vote.user !== undefined && vote.user !== null) {
                const clearItem = {
                    firstName: vote.user.firstName,
                    lastName: vote.user.lastName,
                    username: vote.user.username,
                    displayName: vote.user.displayName,
                    avatarPath: vote.user.avatarPath,
                    avatar: vote.user.avatar,
                    currentExp: vote.user.currentExp
                };
                vote.user = clearItem;
            }
        }
        return vote;
    }

    public cleanPageUserField(vote: any): any {
        if (vote !== undefined && vote !== null) {
            if (vote.pageUser !== undefined && vote.pageUser !== null) {
                const clearItem = {
                    firstName: vote.pageUser.firstName,
                    lastName: vote.pageUser.lastName,
                    username: vote.pageUser.username,
                    displayName: vote.pageUser.displayName,
                    avatarPath: vote.pageUser.avatarPath,
                    avatar: vote.pageUser.avatar,
                    currentExp: vote.pageUser.currentExp
                };
                vote.pageUser = clearItem;
            }
        }
        return vote;
    }

    public async countVoteLike(voteIds?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.repository.countVoteLike(voteIds).then((result: any) => {
                const propCountMap = {};
                for (const item of result) {
                    const likeCount = item.likeCount;
                    const dislikeCount = item.dislikeCount;
                    const totalCount = item.totalCount;

                    propCountMap[item.proposalId] = {
                        likeCount,
                        dislikeCount,
                        totalCount
                    };
                }
                resolve(propCountMap);
            }).catch((error) => { reject(error); });
        });
    }

    public async countVoteView(voteIds: string[]): Promise<any> {
        if (!voteIds || voteIds.length <= 0) {
            return Promise.resolve({});
        }

        return new Promise((resolve, reject) => {
            this.actionLogService.countContentId(voteIds, 'vote', ACTION_LOG.VIEW).then((result: any) => {
                const propCountMap = {};
                for (const item of result) {
                    const totalCount = item.count;

                    propCountMap[item.contentId] = {
                        totalCount
                    };
                }
                resolve(propCountMap);
            }).catch((error) => { reject(error); });
        });
    }
}
