/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Between, MoreThanOrEqual } from 'typeorm';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Debate } from '../models/Debate';
import { DebateRepository } from '../repositories/DebateRepository';
import { SearchUtil } from '../../utils/SearchUtil';
import { SearchFilter } from '../controllers/requests/SearchFilterRequest';
import { DebateCommentService } from './DebateCommentService';
import { PageUserLikeDebateService } from './PageUserLikeDebateService';
import { PageUserLikeDebate } from '../models/PageUserLikeDebate';
import { PageUserLikeDebateRepository } from '../repositories/PageUserLikeDebateRepository';
import { DebateLogs } from '../models/DebateLogs';
import { DEBATE_LOG_ACTION } from '../../LogsStatus';
import { DebateLogsService } from './DebateLogsService';
import { ProposalHasDebateRepository } from '../repositories/ProposalHasDebateRepository';
import { DEFAULT_HOT_TOPIC_CALCULATE_CONFIG, DEBATE_HOT_CONFIG_NAME, DEBATE_COMMENT_APPROVE_REQUIRED_CONFIG } from '../../Constants';
import { DecayFunctionUtil } from '../../utils/DecayFunctionUtil';
import { ConfigService } from './ConfigService';
import { TagAppearanceService } from '../services/TagAppearanceService';
import { ActionLogService } from '../services/ActionLogService';
import { TAG_CONTENT_TYPE } from '../../TagContentType';
import { ACTION_LOG } from '../../ActionContentLog';

@Service()
export class DebateService {

    constructor(@OrmRepository() private dbRepo: DebateRepository,
        @OrmRepository() private puLikeDbRepo: PageUserLikeDebateRepository,
        @OrmRepository() private ppsHasDbRepo: ProposalHasDebateRepository,
        private dbCommentService: DebateCommentService,
        private puLikeDbService: PageUserLikeDebateService,
        private dbLogsService: DebateLogsService,
        private configService: ConfigService,
        private tagAppearanceService: TagAppearanceService,
        private actionLogService: ActionLogService,
        @Logger(__filename) private log: LoggerInterface) {
    }

    // create Debate
    public async create(debate: Debate, relateTags?: string[], user?: any): Promise<Debate> {
        this.log.info('Create a new content => ', debate.toString());

        const newDebate = await this.dbRepo.save(debate);
        try {
            await this.tagAppearanceService.createTagAppearance(newDebate, relateTags, TAG_CONTENT_TYPE.DEBATE, user);
        } catch (error) {
            console.log(error);
        }

        return newDebate;
    }

    // update Debate
    public async update(id: any, debate: Debate, relateTags?: string[], user?: any): Promise<Debate> {
        this.log.info('Update a debate');
        debate.id = id;

        const newDebate = await this.dbRepo.save(debate);
        try {
            await this.tagAppearanceService.updateTagAppearance(newDebate, relateTags, TAG_CONTENT_TYPE.DEBATE, user);
        } catch (error) {
            console.log(error);
        }

        return newDebate;
    }

    // findone Debate
    public async findOne(debate: any): Promise<any> {
        return this.dbRepo.findOne(debate);
    }

    // delete Debate
    public async delete(_debateId: number): Promise<any> {
        this.log.info('Delete a Debate');

        // Find Page User Like Debate
        const puLikeDb: any = await this.puLikeDbService.find({
            where: { debateId: _debateId }
        });

        // Page User Like Debate
        if (puLikeDb) {
            await this.puLikeDbRepo.delete({ debateId: _debateId });
        }

        // Find Debate Comment
        const dbComment: any = await this.dbCommentService.findOne({
            where: { debateId: _debateId }
        });

        // Debate Comment
        if (dbComment) {
            // Find Page User Like Debate Comment
            // const puLikeDbComment: any = await this.puLikeDbCommentRepo.find({
            //     where: { debateCommentId: dbComment.id }
            // });

            // Page User Like Debate Comment
            // if (puLikeDbComment) {
            //     await this.puLikeDbCommentRepo.delete({ debateCommentId: dbComment.id });
            // }

            await this.dbCommentService.delete(_debateId);
        }

        // Find Proposal Has Debate
        const ppsHasDb: any = await this.ppsHasDbRepo.find({
            where: { debateId: _debateId }
        });

        // Proposal Has Debate
        if (ppsHasDb) {
            await this.ppsHasDbRepo.delete({ debateId: _debateId });
        }

        this.tagAppearanceService.delete({
            where: {
                contentId: _debateId,
                type: TAG_CONTENT_TYPE.DEBATE,
            },
        });

        return await this.dbRepo.delete({ id: _debateId });
    }

    // Debate List
    public search(searchfilter: SearchFilter): Promise<any> {
        const limits = SearchUtil.getSearchLimit(searchfilter.limit);
        const condition: any = SearchUtil.createFindCondition(limits, searchfilter.offset, searchfilter.select, searchfilter.relation, searchfilter.whereConditions, searchfilter.orderBy);

        if (searchfilter.count) {
            return this.dbRepo.count(condition);
        } else {
            return this.dbRepo.find(condition);
        }
    }

    public async searchMoreRelation(searchFilter: SearchFilter, showCountComment: boolean, showUser: boolean, showCountAppvComment?: boolean): Promise<any> {
        const condition = SearchUtil.createFindCondition(searchFilter.limit, searchFilter.offset, searchFilter.select, searchFilter.relation, searchFilter.whereConditions, searchFilter.orderBy);

        if (showUser) {
            condition.join = {
                alias: 'debate',
                leftJoinAndSelect: {
                    pageuser: 'debate.pageUser'
                }
            };
        }

        if (searchFilter.count) {
            return this.dbRepo.count(condition);
        } else {
            return new Promise(async (resolve, reject) => {
                this.dbRepo.find(condition).then(async (searchResult: any[]) => {
                    if (showUser && !showCountComment) {
                        searchResult = this.cleanDebatesPageUser(searchResult);
                    } else if (!showUser && showCountComment) {
                        // search count comment
                        const idList: any[] = [];
                        for (const item of searchResult) {
                            idList.push(item.id);
                        }

                        let isApproveComment = undefined;
                        const approveCommentConfig = await this.configService.getConfig(DEBATE_COMMENT_APPROVE_REQUIRED_CONFIG);
                        if (approveCommentConfig && approveCommentConfig.value) {
                            if (approveCommentConfig.value === 'true') {
                                isApproveComment = true;
                            }
                        }

                        // force show approve flag
                        if (showCountAppvComment !== undefined) {
                            isApproveComment = showCountAppvComment;
                        }

                        const countResult = await this.dbCommentService.countComment(idList, isApproveComment);
                        for (const item of searchResult) {
                            item.commentCount = (countResult[item.id] !== undefined) ? countResult[item.id] : 0;
                        }
                    } else if (showUser && showCountComment) {
                        const idList: any[] = [];
                        const cleanResult: any[] = [];
                        for (const item of searchResult) {
                            idList.push(item.id);
                            cleanResult.push(this.cleanPageUserField(item));
                        }

                        let isApproveComment = undefined;
                        const approveCommentConfig = await this.configService.getConfig(DEBATE_COMMENT_APPROVE_REQUIRED_CONFIG);
                        if (approveCommentConfig && approveCommentConfig.value) {
                            if (approveCommentConfig.value === 'true') {
                                isApproveComment = true;
                            }
                        }

                        // force show approve flag
                        if (showCountAppvComment !== undefined) {
                            isApproveComment = showCountAppvComment;
                        }

                        const countResult = await this.dbCommentService.countComment(idList, isApproveComment);
                        for (const item of cleanResult) {
                            item.commentCount = (countResult[item.id] !== undefined) ? countResult[item.id] : 0;
                        }

                        searchResult = cleanResult;
                    }
                    resolve(searchResult);
                }).catch((error) => {
                    reject(error);
                });
            });
        }
    }

    // find Debate
    public find(content: any): Promise<any> {
        return this.dbRepo.find(content);
    }

    // find Debate ById
    public findById(id: any): Promise<any> {
        return this.dbRepo.findByIds(id);
    }

    public async findHot(startDate: Date, endDate: Date, limit?: number, offset?: number, count?: boolean): Promise<any> {
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

        let hotScoreIndicator = await this.configService.getConfig(DEBATE_HOT_CONFIG_NAME.HOT_SCORE_INDICATOR);
        if (hotScoreIndicator !== undefined) {
            hotScoreIndicator = parseFloat(hotScoreIndicator.value);
        } else {
            hotScoreIndicator = DEFAULT_HOT_TOPIC_CALCULATE_CONFIG.HOT_SCORE_INDICATOR;
        }

        if (startDate && endDate) {
            searchfilter.whereConditions = [{
                createdDate: Between(startDate, endDate),
                hotScore: MoreThanOrEqual(hotScoreIndicator)
            }];
        } else {
            searchfilter.whereConditions = [{
                hotScore: MoreThanOrEqual(hotScoreIndicator)
            }];
        }

        searchfilter.orderBy = {
            hotScore: 'DESC',
            createdDate: 'DESC'
        };

        const findResult = await this.searchMoreRelation(searchfilter, true, true);

        return Promise.resolve(findResult);
    }

    /* old version
    public async findHot(startDate: Date, endDate: Date, limit?: number): Promise<any> {
        const searchfilter: SearchFilter = new SearchFilter();
        if (limit !== undefined) {
            if (limit > 200) {
                limit = 200;
            }
        }

        if (startDate && endDate) {
            searchfilter.whereConditions = [{
                createdDate: Between(startDate, endDate)
            }];
        }

        searchfilter.orderBy = {
            createdDate: 'DESC'
        };

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

        const debateLikeMap = await this.countDebateLike(ids);
        const commentCountMap = await this.dbCommentService.countDebateCommentLike(ids);
        const dateArray: Date[] = [];

        let result: any = [];
        const baseScoreMap: any = {};

        for (const item of findResult) {
            const debateId = item.id;
            const debateCreated = item.createdDate;
            const debateLike = debateLikeMap[debateId];
            const debateCommentLike = commentCountMap[debateId];

            const a = (debateLike !== undefined) ? debateLike.totalCount : 0;
            const b = (debateCommentLike !== undefined) ? debateCommentLike.commentCount : 0;
            const c = (debateCommentLike !== undefined) ? debateCommentLike.totalCount : 0;
            const baseScore = (w + (a * x) + (b * y) + (c * z));

            baseScoreMap[debateId] = baseScore;

            if (debateCreated) {
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
            const debateId = item.id;
            const debateCreated = item.createdDate.toISOString();
            const baseScore = baseScoreMap[debateId] ? baseScoreMap[debateId] : 0;
            const decayValue = decayMap[debateCreated] ? decayMap[debateCreated] : 0;

            result.push({
                score: (baseScore * decayValue),
                debate: item
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
            return item.debate;
        });

        if (limit !== undefined) {
            const limitIds = [];
            for (let i = 0; i < limit; i++) {
                const debate = result[i];

                if (i < result.length) {
                    limitIds.push(debate);
                }
            }

            result = limitIds;
        }

        return Promise.resolve(result);
    }*/

    public async updateHot(startDate: Date, endDate: Date, limit?: number): Promise<any> {
        const searchfilter: SearchFilter = new SearchFilter();
        if (limit !== undefined) {
            if (limit > 200) {
                limit = 200;
            }
        }

        if (startDate && endDate) {
            searchfilter.whereConditions = [{
                createdDate: Between(startDate, endDate)
            }];
        }

        searchfilter.orderBy = {
            createdDate: 'DESC'
        };

        let isApproveComment = false;
        const approveCommentConfig = await this.configService.getConfig(DEBATE_COMMENT_APPROVE_REQUIRED_CONFIG);
        if (approveCommentConfig && approveCommentConfig.value) {
            if (approveCommentConfig.value === 'true') {
                isApproveComment = true;
            }
        }

        const ids = [];
        const idsString = [];
        const findResult = await this.searchMoreRelation(searchfilter, true, true);
        for (const item of findResult) {
            ids.push(item.id);
            idsString.push(item.id + '');
        }

        const hotConfig = await this.getHotConfig();

        // ([W + AX + BY + CZ + DV] as baseScore) * decay(t)
        // A = จำนวน. like+Dislike ของ Topic, B = จำนวน. Comment, C = จำนวน like+Dislike ของ comment, D = จำนวน view
        const w = hotConfig.weight;
        const x = hotConfig.weightX;
        const y = hotConfig.weightY;
        const z = hotConfig.weightZ;
        const v = hotConfig.weightV;
        const maxFrac = hotConfig.maxFraction;

        const debateLikeMap = await this.countDebateLike(ids);
        const debateViewMap = await this.countDebateView(idsString);
        const commentCountMap = await this.dbCommentService.countDebateCommentLike(ids, isApproveComment);
        const dateArray: Date[] = [];

        const result: any = [];
        const baseScoreMap: any = {};

        for (const item of findResult) {
            const debateId = item.id;
            const debateCreated = item.createdDate;
            const debateLike = debateLikeMap[debateId];
            const debateCommentLike = commentCountMap[debateId];
            const debateView = debateViewMap[debateId];

            const a = (debateLike !== undefined) ? debateLike.totalCount : 0;
            const b = (debateCommentLike !== undefined) ? debateCommentLike.commentCount : 0;
            const c = (debateCommentLike !== undefined) ? debateCommentLike.totalCount : 0;
            const d = (debateView !== undefined) ? debateView.totalCount : 0;
            const baseScore = (w + (a * x) + (b * y) + (c * z) + (d * v));

            baseScoreMap[debateId] = baseScore;

            if (debateCreated) {
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
            const debateId = item.id;
            const debateCreated = item.createdDate.toISOString();
            const baseScore = baseScoreMap[debateId] ? baseScoreMap[debateId] : 0;
            const decayValue = decayMap[debateCreated] ? decayMap[debateCreated] : 0;

            // update score
            item.hotScore = this.formatFraction((baseScore * decayValue), maxFrac);

            const updaetDebate = await this.update(debateId, item);

            result.push(updaetDebate);
        }

        return Promise.resolve(result);
    }

    public async resetHot(searchfilter: SearchFilter): Promise<any> {
        const debateSearchProm = this.search(searchfilter);

        return new Promise((resolve, reject) => {
            debateSearchProm.then((debateSearchList: any) => {
                if (debateSearchList) {
                    const result = [];

                    for (const item of debateSearchList) {
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

    public findCommentCountById(id: number): Promise<any> {
        const searchfilter: SearchFilter = new SearchFilter();

        searchfilter.whereConditions = [{
            debateId: id,
        }];
        searchfilter.count = true;

        return this.dbCommentService.search(searchfilter);
    }

    public async likeDebate(uId: any, id: number, islike: boolean): Promise<any> {
        // check page user like debate
        if (uId === null || uId === undefined) {
            return new Promise((resolve, reject) => {
                resolve('UserId is nul');
            });
        }

        if (id === null || id === undefined) {
            return new Promise((resolve, reject) => {
                resolve('DebateId is null');
            });
        }

        const pageUserLikeDebate = await this.puLikeDbService.findOne({
            where: {
                userId: uId,
                debateId: id,
            },
        });

        const debate: Debate = await this.findOne(id);

        let likeOld: boolean = undefined;
        const debateLogs = new DebateLogs();

        if (pageUserLikeDebate !== null && pageUserLikeDebate !== undefined) {
            likeOld = pageUserLikeDebate.isLike;
        }

        if (pageUserLikeDebate !== null && pageUserLikeDebate !== undefined) {
            pageUserLikeDebate.isLike = islike;

            await this.puLikeDbService.update(pageUserLikeDebate);

            if (islike && !likeOld) {
                // change dislike to like
                debate.likeCount += 1;
                debate.dislikeCount -= 1;
                debateLogs.userId = uId;
                debateLogs.action = DEBATE_LOG_ACTION.LIKE;
                debateLogs.detail = JSON.stringify(debate);
                this.dbLogsService.create(debateLogs);
            } else if (!islike && likeOld) {
                // change like to dislike
                debate.dislikeCount += 1;
                debate.likeCount -= 1;
                debateLogs.userId = uId;
                debateLogs.action = DEBATE_LOG_ACTION.DISLIKE;
                debateLogs.detail = JSON.stringify(debate);
                this.dbLogsService.create(debateLogs);
            } else {
                // same like dislike
                return this.deleteLikeDebate(uId, id, true);
            }
        } else {
            if (islike !== null && islike !== undefined) {
                // create 
                const data: PageUserLikeDebate = new PageUserLikeDebate();

                data.userId = uId;
                data.debateId = id;
                data.isLike = islike;

                const puLikeDebate: any = await this.puLikeDbService.create(data);

                if (puLikeDebate) {
                    if (islike) {
                        debate.likeCount += 1;
                        debateLogs.userId = uId;
                        debateLogs.action = DEBATE_LOG_ACTION.LIKE;
                    } else {
                        debate.dislikeCount += 1;
                        debateLogs.userId = uId;
                        debateLogs.action = DEBATE_LOG_ACTION.DISLIKE;
                    }
                }
            }

            debateLogs.detail = JSON.stringify(debate);

            this.dbLogsService.create(debateLogs);
        }

        return this.update(id, debate);
    }

    public async deleteLikeDebate(uId: any, id: number, deleteLike: boolean): Promise<any> {
        // check page user like debate

        if (uId === null || uId === undefined) {
            return new Promise((resolve, reject) => {
                resolve('UserId is null');
            });
        }

        if (id === null || id === undefined) {
            return new Promise((resolve, reject) => {
                resolve('DebateId is null');
            });
        }

        const pageUserLikeDebate = await this.puLikeDbService.findOne({
            where: {
                userId: uId,
                debateId: id,
            },
        });

        const debate: Debate = await this.findOne(id);

        if (debate === null || debate === undefined) {
            return new Promise((resolve, reject) => {
                reject('debateId was not found');
            });
        }

        // unlike and undislike 
        if (deleteLike && (pageUserLikeDebate !== null && pageUserLikeDebate !== undefined)) {
            // delete
            await this.puLikeDbService.delete(pageUserLikeDebate.userId, id);
            const debateLogs = new DebateLogs();

            if (pageUserLikeDebate.isLike) {
                if (debate.likeCount > 0) {
                    debate.likeCount -= 1;
                    debateLogs.userId = uId;
                    debateLogs.action = DEBATE_LOG_ACTION.REMOVE_LIKE;
                    debateLogs.detail = JSON.stringify(debate);
                    this.dbLogsService.create(debateLogs);
                }
            } else {
                if (debate.dislikeCount > 0) {
                    debate.dislikeCount -= 1;
                    debateLogs.userId = uId;
                    debateLogs.action = DEBATE_LOG_ACTION.REMOVE_DISLIKE;
                    debateLogs.detail = JSON.stringify(debate);
                    this.dbLogsService.create(debateLogs);
                }
            }
        }

        this.log.info('Delete Like');

        return this.update(id, debate);
    }

    public cleanDebatesPageUser(toRemoveList: any[]): any[] {
        const clearResult: any[] = [];

        if (toRemoveList !== undefined && toRemoveList !== null) {
            for (let item of toRemoveList) {
                item = this.cleanPageUserField(item);
                clearResult.push(item);
            }
        }

        return clearResult;
    }

    public cleanPageUserField(debate: any): any {
        if (debate !== undefined && debate !== null) {
            if (debate.pageUser !== undefined && debate.pageUser !== null) {
                const clearItem = {
                    firstName: debate.pageUser.firstName,
                    lastName: debate.pageUser.lastName,
                    username: debate.pageUser.username,
                    displayName: debate.pageUser.displayName,
                    avatarPath: debate.pageUser.avatarPath,
                    avatar: debate.pageUser.avatar,
                    level: debate.pageUser.level,
                    isOfficial: debate.pageUser.isOfficial,
                    currentExp: debate.pageUser.currentExp
                };
                debate.pageUser = clearItem;
            }
        }
        return debate;
    }

    public async countDebateLike(debateIds?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.dbRepo.countDebateLike(debateIds).then((result: any) => {
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

    public async countDebateView(debateIds: string[]): Promise<any> {
        if (!debateIds || debateIds.length <= 0) {
            return Promise.resolve({});
        }

        return new Promise((resolve, reject) => {
            this.actionLogService.countContentId(debateIds, 'debate', ACTION_LOG.VIEW).then((result: any) => {
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

    // find Proposal has debate
    public findAll(findCondition: any): Promise<any> {
        return this.dbRepo.find(findCondition);
    }

    private getHotConfig(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const functionNameConfig = await this.configService.getConfig(DEBATE_HOT_CONFIG_NAME.FUNCTION);
            let functionMConfig = await this.configService.getConfig(DEBATE_HOT_CONFIG_NAME.FUNCTION_M);
            const weightConfig = await this.configService.getConfig(DEBATE_HOT_CONFIG_NAME.WEIGHT);
            const weightXConfig = await this.configService.getConfig(DEBATE_HOT_CONFIG_NAME.WEIGHT_X);
            const weightYConfig = await this.configService.getConfig(DEBATE_HOT_CONFIG_NAME.WEIGHT_Y);
            const weightZConfig = await this.configService.getConfig(DEBATE_HOT_CONFIG_NAME.WEIGHT_Z);
            const weightVConfig = await this.configService.getConfig(DEBATE_HOT_CONFIG_NAME.WEIGHT_V);
            let maxConfig = await this.configService.getConfig(DEBATE_HOT_CONFIG_NAME.SCORE_MAX_FRACTION);

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
                result.weightZ = parseFloat(weightYConfig.value);
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
