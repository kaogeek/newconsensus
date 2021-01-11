/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { DebateComment } from '../models/DebateComment';
import { DebateCommentRepository } from '../repositories/DebateCommentRepository';
import { SearchUtil } from '../../utils/SearchUtil';
import { SearchFilter } from '../controllers/requests/SearchFilterRequest';
import { PageUserLikeDebateCommentService } from './PageUserLikeDebateCommentService';
import { PageUserLikeDebateComment } from '../models/PageUserLikeDebateComment';
import { DebateLogs } from '../models/DebateLogs';
import { DEBATE_COMMENT_LOG_ACTION } from '../../LogsStatus';
import { DebateLogsService } from './DebateLogsService';
import { PageUserLikeDebateCommentRepository } from '../repositories/PageUserLikeDebateCommentRepository';

@Service()
export class DebateCommentService {

    constructor(@OrmRepository() private debateCommentRepository: DebateCommentRepository,
        @OrmRepository() private puLikeDbCommentRepo: PageUserLikeDebateCommentRepository,
        private puLikeDebateCommentService: PageUserLikeDebateCommentService,
        private dbLogsService: DebateLogsService) {
    }

    // create Debate Comment
    public async create(debateComment: any): Promise<DebateComment> {
        return this.debateCommentRepository.save(debateComment);
    }

    // update Debate Comment
    public update(id: any, debateComment: any): Promise<DebateComment> {
        debateComment.id = id;
        return this.debateCommentRepository.save(debateComment);
    }

    // findone Debate Comment
    public findOne(debateComment: any): Promise<any> {
        return this.debateCommentRepository.findOne(debateComment);
    }

    // delete Debate Comment
    public async delete(id: number): Promise<any> {
        // Find Page User Like Debate Comment
        const puLikeDbComment: any = await this.puLikeDbCommentRepo.find({
            where: { debateCommentId: id }
        });

        // Page User Like Debate Comment
        if (puLikeDbComment) {
            await this.puLikeDbCommentRepo.delete({ debateCommentId: id });
        }

        return this.debateCommentRepository.delete(id);
    }

    // Debate Comment List
    public search(searchfilter: SearchFilter, join?: any): Promise<any> {
        const limits = SearchUtil.getSearchLimit(searchfilter.limit);
        const condition: any = SearchUtil.createFindCondition(limits, searchfilter.offset, searchfilter.select, searchfilter.relation, searchfilter.whereConditions, searchfilter.orderBy, join);

        if (searchfilter.count) {
            return this.debateCommentRepository.count(condition);
        } else {
            return this.debateCommentRepository.find(condition);
        }
    }

    // find Debate Comment
    public find(debateComment: any): Promise<any> {
        return this.debateCommentRepository.find(debateComment);
    }

    // like Debate Comment
    public async likeDebateComment(uId: any, dbId: number, dbCommentId: number, islike: boolean): Promise<any> {
        // check page user like debate

        if (uId === null || uId === undefined) {
            return new Promise((resolve, reject) => {
                reject('UserId is null');
            });
        }

        if (dbCommentId === null || dbCommentId === undefined) {
            return new Promise((resolve, reject) => {
                reject('Debate CommentId is null');
            });
        }

        const pageUserLikeDebate = await this.puLikeDebateCommentService.findOne({
            where: {
                userId: uId,
                debateCommentId: dbCommentId,
            },
        });

        const debateComment: DebateComment = await this.findOne({
            where: {
                id: dbCommentId,
                debateId: dbId,
            },
        });

        let likeOld: boolean = undefined;
        const debateLogs = new DebateLogs();

        if (pageUserLikeDebate !== null && pageUserLikeDebate !== undefined) {
            likeOld = pageUserLikeDebate.isLike;
        }

        // like or dislike 
        // update
        if (pageUserLikeDebate !== null && pageUserLikeDebate !== undefined) {
            pageUserLikeDebate.isLike = islike;

            await this.puLikeDebateCommentService.update(pageUserLikeDebate);

            if (islike && !likeOld) {
                // change dislike to like
                debateComment.likeCount += 1;
                debateComment.dislikeCount -= 1;
                debateLogs.userId = uId;
                debateLogs.action = DEBATE_COMMENT_LOG_ACTION.LIKE;
                debateLogs.detail = JSON.stringify(debateComment);
                this.dbLogsService.create(debateLogs);
            } else if (!islike && likeOld) {
                // change like to dislike
                debateComment.dislikeCount += 1;
                debateComment.likeCount -= 1;
                debateLogs.userId = uId;
                debateLogs.action = DEBATE_COMMENT_LOG_ACTION.DISLIKE;
                debateLogs.detail = JSON.stringify(debateComment);
                this.dbLogsService.create(debateLogs);
            } else {
                // same like dislike
                // delete
                return this.deleteLikeDebateComment(uId, dbId, dbCommentId, true);
            }
        } else {
            if (islike !== null && islike !== undefined) {
                // create 
                const data: PageUserLikeDebateComment = new PageUserLikeDebateComment();

                data.userId = uId;
                data.debateCommentId = dbCommentId;
                data.isLike = islike;

                await this.puLikeDebateCommentService.create(data);

                if (islike) {
                    debateComment.likeCount += 1;
                    debateLogs.userId = uId;
                    debateLogs.action = DEBATE_COMMENT_LOG_ACTION.LIKE;
                    debateLogs.detail = JSON.stringify(debateComment);
                    this.dbLogsService.create(debateLogs);
                } else {
                    debateComment.dislikeCount += 1;
                    debateLogs.userId = uId;
                    debateLogs.action = DEBATE_COMMENT_LOG_ACTION.DISLIKE;
                    debateLogs.detail = JSON.stringify(debateComment);
                    this.dbLogsService.create(debateLogs);
                }
            }
        }

        return this.update(dbCommentId, debateComment);
    }

    // Delete Like Debate Comment
    public async deleteLikeDebateComment(uId: any, dbId: number, commentId: number, deleteLike: boolean): Promise<any> {
        if (uId === null || uId === undefined) {
            return new Promise((resolve, reject) => {
                resolve(undefined);
            });
        }

        if (commentId === null || commentId === undefined) {
            return new Promise((resolve, reject) => {
                resolve(undefined);
            });
        }

        const pageUserLikeDebate = await this.puLikeDebateCommentService.findOne({
            where: {
                userId: uId,
                debateCommentId: commentId,
            },
        });

        const debateComment: DebateComment = await this.findOne({
            where: {
                id: commentId,
                debateId: dbId,
            },
        });

        // unlike and undislike 
        if ((deleteLike) && (pageUserLikeDebate !== null && pageUserLikeDebate !== undefined)) {
            // delete
            await this.puLikeDebateCommentService.delete(uId, commentId);
            const debateLogs = new DebateLogs();

            if (pageUserLikeDebate.isLike) {
                if (debateComment.likeCount > 0) {
                    debateComment.likeCount -= 1;
                    debateLogs.userId = uId;
                    debateLogs.action = DEBATE_COMMENT_LOG_ACTION.REMOVE_LIKE;
                    debateLogs.detail = JSON.stringify(debateComment);
                    this.dbLogsService.create(debateLogs);
                }
            } else {
                if (debateComment.dislikeCount > 0) {
                    debateComment.dislikeCount -= 1;
                    debateLogs.userId = uId;
                    debateLogs.action = DEBATE_COMMENT_LOG_ACTION.REMOVE_DISLIKE;
                    debateLogs.detail = JSON.stringify(debateComment);
                    this.dbLogsService.create(debateLogs);
                }
            }
        }

        return this.update(commentId, debateComment);
    }

    public async countComment(debateId: number[], isApproveComment?: boolean): Promise<any> {
        return new Promise((resolve, reject) => {
            this.debateCommentRepository.countComment(debateId, isApproveComment).then((result: any) => {
                const dbCountMap = {};
                for (const item of result) {
                    dbCountMap[item.debateId] = item.count;
                }
                resolve(dbCountMap);
            }).catch((error) => { reject(error); });
        });
    }

    public async countDebateCommentLike(debateIds: number[], isApproveComment?: boolean): Promise<any> {
        return new Promise((resolve, reject) => {
            this.debateCommentRepository.countDebateCommentLike(debateIds, isApproveComment).then((result: any) => {
                const countMap = {};
                for (const item of result) {
                    const likeCount = item.likeCount;
                    const dislikeCount = item.dislikeCount;
                    const totalCount = item.totalCount;
                    const commentCount = item.commentCount;

                    countMap[item.proposalId] = {
                        likeCount,
                        dislikeCount,
                        totalCount,
                        commentCount
                    };
                }
                resolve(countMap);
            }).catch((error) => { reject(error); });
        });
    }
}
