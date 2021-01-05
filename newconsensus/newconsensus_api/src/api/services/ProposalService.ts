/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Between, IsNull, Not, MoreThanOrEqual } from 'typeorm';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Proposal } from '../models/Proposal';
import { ProposalSupporter } from '../models/ProposalSupporter';
import { ProposalRepository } from '../repositories/ProposalRepository';
import { ProposalCommentService } from './ProposalCommentService';
import { ProposalSupporterService } from './ProposalSupporterService';
import { PageUserLikeProposalService } from './PageUserLikeProposalService';
import { PageUserLikeProposalCommentService } from './PageUserLikeProposalCommentService';
import { ActionLogService } from './ActionLogService';
import { SearchFilter } from '../controllers/requests/SearchFilterRequest';
import { SearchUtil } from '../../utils/SearchUtil';
import { DecayFunctionUtil } from '../../utils/DecayFunctionUtil';
import { PageUserLikeProposal } from '../models/PageUserLikeProposal';
import { ProposalHasDebateService } from './ProposalHasDebateService';
import { ProposalHasDebate } from '../models/ProposalHasDebate';
import { DebateService } from './DebateService';
import { DEFAULT_HOT_TOPIC_CALCULATE_CONFIG, PROPOSAL_HOT_CONFIG_NAME, PROPOSAL_COMMENT_APPROVE_REQUIRED_CONFIG } from '../../Constants';
import moment = require('moment/moment');
import { ConfigService } from './ConfigService';
import { TagAppearanceService } from './TagAppearanceService';
import { TAG_CONTENT_TYPE } from '../../TagContentType';
import { ACTION_LOG } from '../../ActionContentLog';
// import { UserExpStatementService } from './UserExpStatementService';
// import { CONTENT_TYPE, USER_EXP_STATEMENT } from '../../LogsStatus';
// import { UserExpStatement } from '../models/UserExpStatement';

@Service()
export class ProposalService {

    constructor(
        @OrmRepository() private proposalRepository: ProposalRepository,
        @Logger(__filename) private log: LoggerInterface,
        private proposalCommentService: ProposalCommentService,
        private proposalSupporterService: ProposalSupporterService,
        private pageUserLikeProposalService: PageUserLikeProposalService,
        private pageUserLikeProposalCommentService: PageUserLikeProposalCommentService,
        private proposalHasDebateService: ProposalHasDebateService,
        private debateService: DebateService,
        private configService: ConfigService,
        private tagAppearanceService: TagAppearanceService,
        private actionLogService: ActionLogService,
        // private userExpStmtService: UserExpStatementService
    ) { }

    // find proposal
    public findOne(findCondition: any): Promise<any> {
        return this.proposalRepository.findOne(findCondition);
    }

    // findById proposal
    public findById(id: any): Promise<any> {
        return this.proposalRepository.findByIds(id);
    }

    // proposal search
    public async search(limit: number, offset: number, select: any = [], relation: any[], whereConditions: any = [], orderBy: any, count: boolean, join?: any): Promise<any> {
        const condition = SearchUtil.createFindCondition(limit, offset, select, relation, whereConditions, orderBy, join);
        if (count) {
            return this.proposalRepository.count(condition);
        } else {
            return this.proposalRepository.find(condition);
        }
    }

    public async searchMoreRelation(searchFilter: SearchFilter, showCountComment: boolean, showUser: boolean, showDebate?: boolean, showCountAppvComment?: boolean): Promise<any> {
        const condition = SearchUtil.createFindCondition(searchFilter.limit, searchFilter.offset, searchFilter.select, searchFilter.relation, searchFilter.whereConditions, searchFilter.orderBy);

        if (showUser) {
            condition.join = {
                alias: 'proposal',
                leftJoinAndSelect: {
                    pageuser: 'proposal.pageUser'
                }
            };
        }

        if (searchFilter.count) {
            return this.proposalRepository.count(condition);
        } else {
            return new Promise(async (resolve, reject) => {
                this.proposalRepository.find(condition).then(async (searchResult: any[]) => {
                    const hasDebateFilters = [];
                    const proposalMap = {};

                    if (showUser && !showCountComment) {
                        searchResult = this.cleanProposalsPageUser(searchResult);

                        if (showDebate) {
                            for (const item of searchResult) {
                                hasDebateFilters.push({
                                    proposalId: item.id
                                });
                                proposalMap[item.id] = item;
                                proposalMap[item.id].debates = [];
                            }
                        }
                    } else if (!showUser && showCountComment) {
                        // search count comment
                        const idList: any[] = [];
                        for (const item of searchResult) {
                            idList.push(item.id);

                            if (showDebate) {
                                hasDebateFilters.push({
                                    proposalId: item.id
                                });
                                proposalMap[item.id] = item;
                                proposalMap[item.id].debates = [];
                            }
                        }

                        let isApproveComment = undefined;
                        const approveCommentConfig = await this.configService.getConfig(PROPOSAL_COMMENT_APPROVE_REQUIRED_CONFIG);
                        if (approveCommentConfig && approveCommentConfig.value) {
                            if (approveCommentConfig.value === 'true') {
                                isApproveComment = true;
                            }
                        }

                        // force show approve flag
                        if (showCountAppvComment !== undefined) {
                            isApproveComment = showCountAppvComment;
                        }

                        const countResult = await this.proposalCommentService.countComment(idList, isApproveComment);
                        for (const item of searchResult) {
                            item.commentCount = (countResult[item.id] !== undefined) ? countResult[item.id] : 0;
                        }
                    } else if (showUser && showCountComment) {
                        const idList: any[] = [];
                        const cleanResult: any[] = [];
                        for (const item of searchResult) {
                            idList.push(item.id);
                            cleanResult.push(this.cleanPageUserField(item));

                            if (showDebate) {
                                hasDebateFilters.push({
                                    proposalId: item.id
                                });
                                proposalMap[item.id] = item;
                                proposalMap[item.id].debates = [];
                            }
                        }

                        let isApproveComment = undefined;
                        const approveCommentConfig = await this.configService.getConfig(PROPOSAL_COMMENT_APPROVE_REQUIRED_CONFIG);
                        if (approveCommentConfig && approveCommentConfig.value) {
                            if (approveCommentConfig.value === 'true') {
                                isApproveComment = true;
                            }
                        }

                        // force show approve flag
                        if (showCountAppvComment !== undefined) {
                            isApproveComment = showCountAppvComment;
                        }

                        const countResult = await this.proposalCommentService.countComment(idList, isApproveComment);
                        for (const item of cleanResult) {
                            item.commentCount = (countResult[item.id] !== undefined) ? countResult[item.id] : 0;
                        }

                        searchResult = cleanResult;
                    } else {
                        if (showDebate) {
                            for (const item of searchResult) {
                                hasDebateFilters.push({
                                    proposalId: item.id
                                });
                                proposalMap[item.id] = item;
                                proposalMap[item.id].debates = [];
                            }
                        }
                    }

                    if (hasDebateFilters.length > 0) {
                        const debateIdList = await this.proposalHasDebateService.findAll(hasDebateFilters);
                        const debateProposalIdsMap = {}; // debate as a key.
                        let debateList = [];
                        if (debateIdList !== undefined && debateIdList.length > 0) {
                            const debateCondition = {
                                select: ['id', 'title'],
                                where: []
                            };
                            for (const hasDebate of debateIdList) {
                                debateCondition.where.push({
                                    id: hasDebate.debateId
                                });

                                if (debateProposalIdsMap[hasDebate.debateId] === undefined) {
                                    debateProposalIdsMap[hasDebate.debateId] = [];
                                }

                                debateProposalIdsMap[hasDebate.debateId].push(hasDebate.proposalId);
                            }
                            debateList = await this.debateService.findAll(debateCondition);
                        }

                        for (const debate of debateList) {
                            if (debateProposalIdsMap[debate.id] === undefined) {
                                continue;
                            }

                            const proposalIdsList = debateProposalIdsMap[debate.id];
                            for (const prop of proposalIdsList) {
                                if (proposalMap[prop] === undefined) {
                                    continue;
                                }

                                proposalMap[prop].debates.push(debate);
                            }
                        }
                    }

                    resolve(searchResult);
                }).catch((error) => {
                    reject(error);
                });
            });
        }
    }

    // create proposal
    public async create(user: any, proposal: Proposal, debateTag: string[] = [], relateTags?: string[]): Promise<Proposal> {

        if (debateTag !== null && debateTag !== undefined && debateTag.length > 0) {
            const debate = await this.debateService.findById(debateTag);

            if (debate.length < debateTag.length) {
                return undefined;
            }
        }

        this.log.info('Create a new proposal => ', proposal.toString());
        const newProposal = await this.proposalRepository.save(proposal);
        const condition: any[] = [];

        let list: any = {};
        let pHasDebate: any;
        const setDebate: any[] = [];
        if (debateTag && debateTag.length > 0) {
            debateTag.forEach((data: any) => {
                list = {};
                list.proposalId = newProposal.id;
                list.debateId = Number(data);
                setDebate.push(data);
                condition.push(list);
            });
            pHasDebate = await this.proposalHasDebateService.findAll({
                where: condition
            });

            if (pHasDebate.length > 0) {
                pHasDebate.forEach(async element => {
                    if (!setDebate.includes(element.debateId)) {
                        const newPHasDebate = new ProposalHasDebate();
                        newPHasDebate.proposalId = proposal.id;
                        newPHasDebate.debateId = element.debateId;

                        await this.proposalHasDebateService.create(newPHasDebate);
                    }
                });
            } else {
                setDebate.forEach(async data => {
                    const newPHasDebate = new ProposalHasDebate();
                    newPHasDebate.proposalId = proposal.id;
                    newPHasDebate.debateId = data;
                    newPHasDebate.createdBy = user.id;
                    newPHasDebate.createdByUsername = user.username;

                    await this.proposalHasDebateService.create(newPHasDebate);
                });
            }
        }

        await this.tagAppearanceService.createTagAppearance(newProposal, relateTags, TAG_CONTENT_TYPE.PROPOSAL, user);

        return newProposal;
    }

    // update proposal
    public async update(user: any, proposal: Proposal, debateTag?: string[], relateTags?: string[]): Promise<Proposal> {

        if (debateTag !== null && debateTag !== undefined && debateTag.length > 0) {
            const debate = await this.debateService.findById(debateTag);
            if (debate.length < debateTag.length) {
                return Promise.reject('Invalid debate id');
            }
        }

        if (user) {
            proposal.modifiedBy = user.id;
            proposal.modifiedByUsername = user.username;
            proposal.modifiedDate = moment().toDate();
        }

        const newProposal = await this.proposalRepository.save(proposal);

        const condition: any[] = [];

        let list: any = {};
        let pHasDebate: any;
        const setDebate: any[] = [];
        const newTag: any[] = [];
        if (debateTag !== undefined) {
            // remove all tag and add the new one
            await this.proposalHasDebateService.deleteFromProposal({ proposalId: newProposal.id });

            if (debateTag !== null && debateTag.length > 0) {
                debateTag.forEach((data: any) => {
                    list = {};
                    list.proposalId = newProposal.id;
                    list.debateId = Number(data);
                    setDebate.push(data);
                    condition.push(list);
                });

                pHasDebate = await this.proposalHasDebateService.findAll({
                    select: ['debateId'],
                    where: condition,
                });

                pHasDebate.forEach(element => {
                    newTag.push(element.debateId);
                });

                if (pHasDebate.length > 0) {
                    setDebate.forEach(async data => {

                        if (!newTag.includes(data)) {

                            const newPHasDebate = new ProposalHasDebate();
                            newPHasDebate.proposalId = newProposal.id;
                            newPHasDebate.debateId = data;
                            newPHasDebate.createdBy = user.id;
                            newPHasDebate.createdByUsername = user.username;

                            await this.proposalHasDebateService.create(newPHasDebate);
                        }
                    });
                } else {
                    setDebate.forEach(async data => {
                        const newPHasDebate = new ProposalHasDebate();
                        newPHasDebate.proposalId = proposal.id;
                        newPHasDebate.debateId = data;
                        newPHasDebate.createdBy = user.id;
                        newPHasDebate.createdByUsername = user.username;

                        await this.proposalHasDebateService.create(newPHasDebate);
                    });
                }
            }
        }

        await this.tagAppearanceService.updateTagAppearance(newProposal, relateTags, TAG_CONTENT_TYPE.PROPOSAL, user);

        return newProposal;
    }

    // delete proposal
    public async delete(user: any, id: number): Promise<any> {

        this.proposalCommentService.deleteFromProposal(null, {
            where: {
                proposalId: id,
            },
        });

        this.pageUserLikeProposalCommentService.deleteFromProposal({
            where: {
                proposalId: id,
            },
        });

        this.proposalHasDebateService.deleteFromProposal({
            where: {
                proposalId: id,
            },
        });

        this.pageUserLikeProposalService.deletes({
            where: {
                proposalId: id,
            },
        });

        this.tagAppearanceService.delete({
            where: {
                contentId: id,
                type: TAG_CONTENT_TYPE.PROPOSAL,
            },
        });

        this.log.info('Delete a proposal');
        const proposal = await this.proposalRepository.delete(id);
        return proposal;
    }

    // find proposal
    public findAll(findCondition: any): Promise<any> {
        this.log.info('Find all proposal');
        return this.proposalRepository.find(findCondition);
    }

    // find comment count
    public async findCommentCountById(id: number): Promise<any> {

        const searchfilter: SearchFilter = new SearchFilter();
        searchfilter.whereConditions = [{
            proposalId: id,
        }];
        searchfilter.count = true;

        return await this.proposalCommentService.search(searchfilter.limit, searchfilter.offset, searchfilter.select, searchfilter.relation, searchfilter.whereConditions, searchfilter.orderBy, searchfilter.count);
    }

    // find hot
    public async findHot(startDate: Date, endDate: Date, roomId?: number, limit?: number, isApprove?: boolean, offset?: number, count?: boolean): Promise<any> {

        const searchfilter: SearchFilter = new SearchFilter();
        if (limit !== undefined) {
            if (limit > 200) {
                limit = 200;
            }
        }
        searchfilter.limit = limit;
        if (offset === undefined) {
            offset = 0;
        }
        searchfilter.offset = offset;
        searchfilter.count = count;

        let hotScoreIndicator = await this.configService.getConfig(PROPOSAL_HOT_CONFIG_NAME.HOT_SCORE_INDICATOR);
        if (hotScoreIndicator !== undefined) {
            hotScoreIndicator = parseFloat(hotScoreIndicator.value);
        } else {
            hotScoreIndicator = DEFAULT_HOT_TOPIC_CALCULATE_CONFIG.HOT_SCORE_INDICATOR;
        }

        let stmtObj = undefined;
        if (startDate && endDate) {
            stmtObj = {
                createdDate: Between(startDate, endDate),
                hotScore: MoreThanOrEqual(hotScoreIndicator)
            };
        } else {
            stmtObj = {
                hotScore: MoreThanOrEqual(hotScoreIndicator)
            };
        }

        if (roomId !== undefined) {
            if (stmtObj === undefined) {
                stmtObj = {};
            }

            stmtObj.roomId = roomId;
        }

        if (isApprove !== undefined) {
            if (isApprove) {
                stmtObj.approveUserId = Not(IsNull());
            } else {
                stmtObj.approveUserId = IsNull();
            }
        }

        if (stmtObj) {
            searchfilter.whereConditions = [stmtObj];
        }

        searchfilter.orderBy = {
            hotScore: 'DESC',
            createdDate: 'DESC'
        };

        const findResult = await this.searchMoreRelation(searchfilter, true, true);

        return Promise.resolve(findResult);
    }
    /*
    public async findHot(startDate: Date, endDate: Date, roomId?: number, limit?: number, isApprove?: boolean): Promise<any> {

        const searchfilter: SearchFilter = new SearchFilter();
        if (limit !== undefined) {
            if (limit > 200) {
                limit = 200;
            }
        }
        // searchfilter.offset = offset;
        // searchfilter.limit = limit;

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

        if (isApprove !== undefined) {
            if (isApprove) {
                stmtObj.approveUserId = Not(IsNull());
            } else {
                stmtObj.approveUserId = IsNull();
            }
        }

        if (stmtObj) {
            searchfilter.whereConditions = [stmtObj];
        }

        const ids = [];
        const findResult = await this.searchMoreRelation(searchfilter, true, true);
        for (const item of findResult) {
            ids.push(item.id);
        }

        const hotConfig = await this.getHotConfig();

        // ([W + AX + BY + CZ] as baseScore) * decay(t)
        // A = จำนวน. like+Dislike ของ Topic, B = จำนวน. Comment, C = จำนวน like+Dislike ของ commen
        const w = hotConfig.weight;
        const x = hotConfig.weightX;
        const y = hotConfig.weightY;
        const z = hotConfig.weightZ;

        const proposalLikeMap = await this.countProposalLike(ids);
        const commentCountMap = await this.proposalCommentService.countProposalCommentLike(ids);
        const dateArray: Date[] = [];

        let result: any = [];
        const baseScoreMap: any = {};

        for (const item of findResult) {
            const proposalId = item.id;
            const proposalCreated = item.createdDate;
            const proposalLike = proposalLikeMap[proposalId];
            const proposalCommentLike = commentCountMap[proposalId];

            const a = (proposalLike !== undefined) ? proposalLike.totalCount : 0;
            const b = (proposalCommentLike !== undefined) ? proposalCommentLike.commentCount : 0;
            const c = (proposalCommentLike !== undefined) ? proposalCommentLike.totalCount : 0;
            const baseScore = (w + (a * x) + (b * y) + (c * z));

            baseScoreMap[proposalId] = baseScore;

            if (proposalCreated) {
                dateArray.push(item.createdDate);
            }
        }

        let functionM = hotConfig.functionM;

        let decayMap: any;
        if (hotConfig.function === 'linear') {
            if (functionM === undefined) {
                functionM = DEFAULT_HOT_TOPIC_CALCULATE_CONFIG.LINEAR_M;
            }
            decayMap = DecayFunctionUtil.generateLinearDecayMap(startDate, endDate, dateArray, 'day', 3, functionM);
        } else if (hotConfig.function === 'f1') {
            if (functionM === undefined) {
                functionM = DEFAULT_HOT_TOPIC_CALCULATE_CONFIG.F1_M;
            }
            decayMap = DecayFunctionUtil.generateF1DecayMap(startDate, endDate, dateArray, 'day', 3, functionM);
        } else {
            if (functionM === undefined) {
                functionM = DEFAULT_HOT_TOPIC_CALCULATE_CONFIG.EXPO_M;
            }
            decayMap = DecayFunctionUtil.generateExpoDecayMap(startDate, endDate, dateArray, 'day', 3, functionM);
        }

        // Hot
        for (const item of findResult) {
            const proposalId = item.id;
            const proposalCreated = item.createdDate.toISOString();
            const baseScore = baseScoreMap[proposalId] ? baseScoreMap[proposalId] : 0;
            const decayValue = decayMap[proposalCreated] ? decayMap[proposalCreated] : 0;

            result.push({
                score: (baseScore * decayValue),
                proposal: item
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
            return item.proposal;
        });

        if (limit !== undefined) {
            const limitIds = [];
            for (let i = 0; i < limit; i++) {
                const proposal = result[i];

                if (i < result.length) {
                    limitIds.push(proposal);
                }
            }

            result = limitIds;
        }

        return Promise.resolve(result);
    }*/

    public async updateHot(startDate: Date, endDate: Date, roomId?: number, limit?: number, isApprove?: boolean): Promise<any> {

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

        if (isApprove !== undefined) {
            if (isApprove) {
                stmtObj.approveUserId = Not(IsNull());
            } else {
                stmtObj.approveUserId = IsNull();
            }
        }

        if (stmtObj) {
            searchfilter.whereConditions = [stmtObj];
        }

        const ids = [];
        const idsString = [];
        const findResult = await this.searchMoreRelation(searchfilter, true, true);
        for (const item of findResult) {
            ids.push(item.id);
            idsString.push(item.id + '');
        }

        const hotConfig = await this.getHotConfig();

        // ([W + AX + BY + CZ] as baseScore) * decay(t)
        // A = จำนวน. like+Dislike ของ Topic, B = จำนวน. Comment, C = จำนวน like+Dislike ของ comment, D = จำนวน view
        const w = hotConfig.weight;
        const x = hotConfig.weightX;
        const y = hotConfig.weightY;
        const z = hotConfig.weightZ;
        const v = hotConfig.weightV;
        const maxFrac = hotConfig.maxFraction;

        let isApproveComment = false;
        const approveCommentConfig = await this.configService.getConfig(PROPOSAL_COMMENT_APPROVE_REQUIRED_CONFIG);
        if (approveCommentConfig && approveCommentConfig.value) {
            if (approveCommentConfig.value === 'true') {
                isApproveComment = true;
            }
        }

        const proposalLikeMap = await this.countProposalLike(ids);
        const proposalViewMap = await this.countProposalView(idsString);
        const commentCountMap = await this.proposalCommentService.countProposalCommentLike(ids, isApproveComment);
        const dateArray: Date[] = [];

        const result: any = [];
        const baseScoreMap: any = {};

        for (const item of findResult) {
            const proposalId = item.id;
            const proposalCreated = item.createdDate;
            const proposalLike = proposalLikeMap[proposalId];
            const proposalCommentLike = commentCountMap[proposalId];
            const proposalView = proposalViewMap[proposalId];

            const a = (proposalLike !== undefined) ? proposalLike.totalCount : 0;
            const b = (proposalCommentLike !== undefined) ? proposalCommentLike.commentCount : 0;
            const c = (proposalCommentLike !== undefined) ? proposalCommentLike.totalCount : 0;
            const d = (proposalView !== undefined) ? proposalView.totalCount : 0;
            const baseScore = (w + (a * x) + (b * y) + (c * z) + (d * v));

            baseScoreMap[proposalId] = baseScore;

            if (proposalCreated) {
                dateArray.push(item.createdDate);
            }
        }

        let functionM = hotConfig.functionM;

        let decayMap: any;
        if (hotConfig.function === 'linear') {
            if (functionM === undefined) {
                functionM = DEFAULT_HOT_TOPIC_CALCULATE_CONFIG.LINEAR_M;
            }
            decayMap = DecayFunctionUtil.generateLinearDecayMap(startDate, endDate, dateArray, 'day', 3, functionM);
        } else if (hotConfig.function === 'f1') {
            if (functionM === undefined) {
                functionM = DEFAULT_HOT_TOPIC_CALCULATE_CONFIG.F1_M;
            }
            decayMap = DecayFunctionUtil.generateF1DecayMap(startDate, endDate, dateArray, 'day', 3, functionM);
        } else {
            if (functionM === undefined) {
                functionM = DEFAULT_HOT_TOPIC_CALCULATE_CONFIG.EXPO_M;
            }
            decayMap = DecayFunctionUtil.generateExpoDecayMap(startDate, endDate, dateArray, 'day', 3, functionM);
        }

        // Hot
        for (const item of findResult) {
            const proposalId = item.id;
            const proposalCreated = item.createdDate.toISOString();
            const baseScore = baseScoreMap[proposalId] ? baseScoreMap[proposalId] : 0;
            const decayValue = decayMap[proposalCreated] ? decayMap[proposalCreated] : 0;

            // update score
            item.hotScore = this.formatFraction((baseScore * decayValue), maxFrac);
            const updateProposal = await this.update(proposalId, item);

            result.push(updateProposal);
        }

        return Promise.resolve(result);
    }

    public async resetHot(searchfilter: SearchFilter): Promise<any> {
        const searchProm = this.search(searchfilter.limit, searchfilter.offset, searchfilter.select, searchfilter.relation, searchfilter.whereConditions, searchfilter.orderBy, searchfilter.count);

        return new Promise((resolve, reject) => {
            searchProm.then((searchList: any) => {
                if (searchList) {
                    const result = [];

                    for (const item of searchList) {
                        item.hotScore = 0;
                        const updatedItem = this.update(item.id, item);
                        result.push(updatedItem);
                    }

                    resolve(result);
                } else {
                    resolve([]);
                }
            }).catch((err) => {
                reject(err);
            });
        });
    }

    // like
    public async likeProposal(user: any, pId: number, islike: boolean): Promise<any> {
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

        const pageUserLikeProposal = await this.pageUserLikeProposalService.findOne({
            where: {
                userId: user.id,
                proposalId: pId,
            },
        });

        const proposal: Proposal = await this.findOne(pId);

        if (proposal === null || proposal === undefined) {
            return new Promise((resolve, reject) => {
                resolve(undefined);
            });
        }

        let likeOld: boolean = undefined;

        if (pageUserLikeProposal !== null && pageUserLikeProposal !== undefined) {
            likeOld = pageUserLikeProposal.isLike;
        }

        // update
        if (pageUserLikeProposal !== null && pageUserLikeProposal !== undefined) {
            pageUserLikeProposal.isLike = islike;
            await this.pageUserLikeProposalService.update(user.id, pId, pageUserLikeProposal);
            if (islike && !likeOld) {
                // change dislike to like
                proposal.likeCount += 1;
                proposal.dislikeCount -= 1;
            } else if (!islike && likeOld) {
                // change like to dislike
                proposal.dislikeCount += 1;
                proposal.likeCount -= 1;
            } else {
                // same like dislike
                return this.deleteLikeProposal(user, pId, true);
            }
        } else {
            if (islike !== null && islike !== undefined) {
                // create 
                const data: PageUserLikeProposal = new PageUserLikeProposal();

                data.userId = user.id;
                data.proposalId = pId;
                data.isLike = islike;

                await this.pageUserLikeProposalService.create(data);

                if (islike) {
                    proposal.likeCount += 1;
                } else {
                    proposal.dislikeCount += 1;
                }
            }
        }

        return this.update(user, proposal, undefined);
    }

    // remove like
    public async deleteLikeProposal(user: any, pId: number, deleteLike: boolean): Promise<any> {

        if (user === null || user === undefined) {
            return new Promise((resolve, reject) => {
                resolve('UserId is null');
            });
        }

        if (pId === null || pId === undefined) {
            return new Promise((resolve, reject) => {
                resolve('ProposalId is null');
            });
        }

        const pageUserLikeProposal = await this.pageUserLikeProposalService.findOne({
            where: {
                userId: user.id,
                proposalId: pId,
            },
        });

        const proposal: Proposal = await this.findOne(pId);

        if (proposal === null || proposal === undefined) {
            return new Promise((resolve, reject) => {
                resolve('ProposalId was not found');
            });
        }

        // unlike and undislike 
        if ((deleteLike) && (pageUserLikeProposal !== null && pageUserLikeProposal !== undefined)) {
            try {
                // delete
                await this.pageUserLikeProposalService.delete(pageUserLikeProposal.userId, pId);
            } catch (error) {
                return new Promise((resolve, reject) => {
                    reject(error);
                });
            }

            if (pageUserLikeProposal.isLike) {
                if (proposal.likeCount > 0) {
                    proposal.likeCount -= 1;
                }
            } else {
                if (proposal.dislikeCount > 0) {
                    proposal.dislikeCount -= 1;
                }
            }

            this.log.info('Proposal Like');
        } else {
            return new Promise((resolve, reject) => {
                reject('Can not Proposal');
            });
        }
        return this.update(user, proposal, undefined);
    }

    // supporter proposal
    public async updateUserSupportProposal(user: any, proposal: Proposal): Promise<any> {

        const proposalSupport = await this.proposalSupporterService.findOne({
            where: {
                proposalId: proposal.id,
                userId: user.id,
            },
        });

        if (proposalSupport === null || proposalSupport === undefined) {

            const proposalSupporter = new ProposalSupporter();
            proposalSupporter.proposalId = proposal.id;
            proposalSupporter.userId = user.id;
            proposalSupporter.createdBy = user.id;
            proposalSupporter.createdByUsername = user.username;
            this.proposalSupporterService.create(proposalSupporter);

            proposal.supporterCount += 1;
            proposal.modifiedBy = user.id;
            proposal.modifiedByUsername = user.username;
            await this.update(user, proposal);

        } else {

            this.proposalSupporterService.deleteFromProposal(proposalSupport);

            proposal.supporterCount -= 1;
            proposal.modifiedBy = user.id;
            proposal.modifiedByUsername = user.username;
            await this.update(user, proposal);
            // const userExp = await this.userExpStmtService.findOne({
            //     where: {
            //         contentId: proposal.id,
            //         userId: proposal.createdBy
            //     }
            // });
            // const userExpStmt = new UserExpStatement();
            // console.log('userExp.action ', userExp.action);

            // if(userExp ){
            //     userExpStmt.contentType = CONTENT_TYPE.PROPOSAL;
            //     userExpStmt.action = USER_EXP_STATEMENT.UNSUPPORT + ' ' + CONTENT_TYPE.PROPOSAL;
            //     userExpStmt.contentId = proposal.id.toString();
            //     userExpStmt.userId = proposal.createdBy.toString();
            //     userExpStmt.valueExp = 0;
            //     userExpStmt.isFirst = false;
            // }
        }

        return proposal;
    }

    public async countProposalLike(proposalIds?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.proposalRepository.countProposalLike(proposalIds).then((result: any) => {
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

    public cleanProposalsPageUser(toRemoveList: any[]): any[] {
        const clearResult: any[] = [];

        if (toRemoveList !== undefined && toRemoveList !== null) {
            for (let item of toRemoveList) {
                item = this.cleanPageUserField(item);
                clearResult.push(item);
            }
        }

        return clearResult;
    }

    public cleanPageUserField(proposal: any): any {
        if (proposal !== undefined && proposal !== null) {
            if (proposal.pageUser !== undefined && proposal.pageUser !== null) {
                const clearItem = {
                    firstName: proposal.pageUser.firstName,
                    lastName: proposal.pageUser.lastName,
                    username: proposal.pageUser.username,
                    displayName: proposal.pageUser.displayName,
                    avatarPath: proposal.pageUser.avatarPath,
                    avatar: proposal.pageUser.avatar,
                    level: proposal.pageUser.level,
                    isOfficial: proposal.pageUser.isOfficial,
                    currentExp: proposal.pageUser.currentExp
                };
                proposal.pageUser = clearItem;
            }
        }
        return proposal;
    }

    public updateProposal(proposal: any): Promise<any> {
        return this.proposalRepository.save(proposal);
    }

    public async countProposalView(proposalIds: string[]): Promise<any> {
        if (!proposalIds || proposalIds.length <= 0) {
            return Promise.resolve({});
        }

        return new Promise((resolve, reject) => {
            this.actionLogService.countContentId(proposalIds, 'proposal', ACTION_LOG.VIEW).then((result: any) => {
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

    private getHotConfig(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const functionNameConfig = await this.configService.getConfig(PROPOSAL_HOT_CONFIG_NAME.FUNCTION);
            let functionMConfig = await this.configService.getConfig(PROPOSAL_HOT_CONFIG_NAME.FUNCTION_M);
            const weightConfig = await this.configService.getConfig(PROPOSAL_HOT_CONFIG_NAME.WEIGHT);
            const weightXConfig = await this.configService.getConfig(PROPOSAL_HOT_CONFIG_NAME.WEIGHT_X);
            const weightYConfig = await this.configService.getConfig(PROPOSAL_HOT_CONFIG_NAME.WEIGHT_Y);
            const weightZConfig = await this.configService.getConfig(PROPOSAL_HOT_CONFIG_NAME.WEIGHT_Z);
            const weightVConfig = await this.configService.getConfig(PROPOSAL_HOT_CONFIG_NAME.WEIGHT_V);
            let maxConfig = await this.configService.getConfig(PROPOSAL_HOT_CONFIG_NAME.SCORE_MAX_FRACTION);

            if (functionMConfig !== undefined) {
                functionMConfig = parseFloat(functionMConfig.value);
            }
            if (maxConfig !== undefined) {
                maxConfig = parseFloat(maxConfig.value);
            } else {
                maxConfig = DEFAULT_HOT_TOPIC_CALCULATE_CONFIG.SCORE_MAX_FRACTION;
            }

            const result = {
                function: DEFAULT_HOT_TOPIC_CALCULATE_CONFIG.FUNCTION,
                weight: DEFAULT_HOT_TOPIC_CALCULATE_CONFIG.WEIGHT,
                weightX: DEFAULT_HOT_TOPIC_CALCULATE_CONFIG.WEIGHT_X,
                weightY: DEFAULT_HOT_TOPIC_CALCULATE_CONFIG.WEIGHT_Y,
                weightZ: DEFAULT_HOT_TOPIC_CALCULATE_CONFIG.WEIGHT_Z,
                weightV: DEFAULT_HOT_TOPIC_CALCULATE_CONFIG.WEIGHT_V,
                functionM: functionMConfig,
                maxFraction: maxConfig
            };

            if (functionNameConfig && functionNameConfig.value) {
                result.function = functionNameConfig.value;
            }
            if (weightConfig && weightConfig.value) {
                result.weight = parseFloat(weightConfig.value);
            }
            if (weightXConfig && weightXConfig.value) {
                result.weightX = parseFloat(weightXConfig.value);
            }
            if (weightYConfig && weightYConfig.value) {
                result.weightY = parseFloat(weightYConfig.value);
            }
            if (weightZConfig && weightZConfig.value) {
                result.weightZ = parseFloat(weightZConfig.value);
            }
            if (weightVConfig && weightVConfig.value) {
                result.weightV = parseFloat(weightVConfig.value);
            }

            resolve(result);
        });
    }

    private formatFraction(value: number, maxFrac: number): number {
        if (value === undefined) {
            return value;
        }

        if (maxFrac === undefined) {
            return value;
        }

        const valueFormatString = value.toLocaleString('en-US', {
            minimumFractionDigits: maxFrac,
            maximumFractionDigits: maxFrac
        });

        try {
            return parseFloat(valueFormatString);
        } catch (error) { console.log(error); }

        return value;
    }
}
