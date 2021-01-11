/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import 'reflect-metadata';
import { Body, Post, Get, Put, Param, QueryParam, JsonController, Authorized, Res, Req, Delete } from 'routing-controllers';
import { DebateComment } from '../models/DebateComment';
import { CreateDebateComment } from './requests/CreateDebateCommentRequest';
import { UpdateDebateComment } from './requests/UpdateDebateCommentRequest';
import { DebateService } from '../services/DebateService';
import { DebateCommentService } from '../services/DebateCommentService';
import { SearchFilter } from './requests/SearchFilterRequest';
import { ResponceUtil } from '../../utils/ResponceUtil';
import { UpdatePageUserLikeDebateComment } from './requests/UpdatePageUserLikeDebateCommentRequest';
import { DebateLogs } from '../models/DebateLogs';
import { DEBATE_COMMENT_LOG_ACTION, USER_EXP_STATEMENT, CONTENT_TYPE } from '../../LogsStatus';
import { DebateLogsService } from '../services/DebateLogsService';
import { ObjectUtil } from '../../utils/ObjectUtil';
import { PageUserService } from '../services/PageUserService';
import { BadWordService } from '../services/BadWordService';
import { PageUserLikeDebateCommentService } from '../services/PageUserLikeDebateCommentService';
import { UserExpStatementService } from '../services/UserExpStatementService';
import { UserExpStatement } from '../models/UserExpStatement';

@JsonController('/debate')
export class DebateCommentController {
    constructor(private dbService: DebateService, private dbCommentService: DebateCommentService, private debateLogsService: DebateLogsService,
        private pageuserService: PageUserService, private badWordService: BadWordService,
        private pdLikeCommentService: PageUserLikeDebateCommentService, private userExpStmtService: UserExpStatementService) {
    }

    // Debate Comment API
    // Find Debate Comment API
    /**
     * @api {get} /api/debate/:debateId/comment/:id Find Debate Comment
     * @apiGroup DebateComment
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Find Debate Comment Successfully",
     *      "data":{
     *      "id" : "",
     *      "debateId" : "",
     *      "comment" : "",
     *      "likeCount" : "",
     *      "dislikeCount" : "",
     *      "createdBy" : "",
     *      "createdDate" : "",
     *      "createdTime" : "",
     *      "modifiedDate" : "",
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/debate/:debateId/comment/:id
     * @apiErrorExample {json} Debate Comment Error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/:debateId/comment/:id')
    public async findDebateComment(@Param('debateId') _debateId: number, @Param('id') commentId: number, @Res() response: any): Promise<any> {
        const debateComment = await this.dbCommentService.findOne({
            where: {
                debateId: _debateId,
                id: commentId,
            },
        });

        if (debateComment) {
            return response.status(200).send(ResponceUtil.getSucessResponce('Find Debate Comment Successful', debateComment));
        } else {
            return response.status(400).send(ResponceUtil.getErrorResponce('Unable to Find Debate Comment', undefined));
        }
    }

    // Search Debate Comment API
    /**
     * @api {post} /api/debate/:debateId/comment/search Search Debate Comment
     * @apiGroup DebateComment
     * @apiParam (Request body) {number} limit limit
     * @apiParam (Request body) {number} offset offset
     * @apiParam (Request body) {String} select select
     * @apiParam (Request body) {String} relation relation
     * @apiParam (Request body) {String} whereConditions whereConditions
     * @apiParam (Request body) {boolean} isCount isCount (0=false, 1=true)
     * @apiParamExample {json} Input
     * {
     *      "debateId" : "",
     *      "title" : "",
     *      "content" : "",
     *      "likeCount" : "",
     *      "dislikeCount" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Search Debate Successfully",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/debate/:debateId/comment/search
     * @apiErrorExample {json} Debate Comment error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/:debateId/comment/search')
    public async searchDebateComment(@Body() filter: SearchFilter, @Param('debateId') debateIdParam: number, @QueryParam('show_user') showUser: boolean, @QueryParam('user_like') userLikeId: number, @Res() response: any): Promise<any> {

        if (filter === null || filter === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
        }

        if (debateIdParam === null || debateIdParam === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
        }

        if (filter.whereConditions !== null && filter.whereConditions !== undefined) {
            if (filter.whereConditions.length > 0) {
                for (const con of filter.whereConditions) {
                    con.debateId = debateIdParam;
                }
            } else {
                filter.whereConditions = [{ debateId: debateIdParam }];
            }
        } else {
            filter.whereConditions = [{ debateId: debateIdParam }];
        }

        try {
            let join: any = undefined;
            if (showUser) {
                join = {
                    alias: 'dbComment',
                    leftJoinAndSelect: {
                        pageuser: 'dbComment.pageUser'
                    }
                };
            }

            let data: any[] = await this.dbCommentService.search(filter, join);

            const clearResult: any[] = [];
            const whereConditions: any[] = [];
            const commentItemMap = {};
            if (data !== undefined && data !== null) {
                for (let item of data) {
                    const key: string = item.id;
                    item = this.dbService.cleanPageUserField(item);
                    clearResult.push(item);
                    // add to map
                    commentItemMap[key] = item;

                    const likeFilter = { debateCommentId: item.id, userId: userLikeId };
                    whereConditions.push(likeFilter);
                }
            }

            data = clearResult;

            if (userLikeId !== undefined) {
                // search like
                const likeFilter = new SearchFilter();
                likeFilter.whereConditions = whereConditions;

                const likeResult = await this.pdLikeCommentService.search(likeFilter);

                if (likeResult.length > 0) {
                    for (const item of likeResult) {
                        const key: string = item.debateCommentId;

                        if (commentItemMap[key] !== undefined) {
                            commentItemMap[key].isUserLike = item.isLike;
                        }
                    }
                }
            }

            if (data) {
                return response.status(200).send(ResponceUtil.getSucessResponce('success', data));
            } else {
                return response.status(200).send(ResponceUtil.getSucessResponce('success', []));
            }

            // let debateComment: any[] = await this.dbCommentService.search(filter, join);

            // debateComment = this.dbService.cleanDebatesPageUser(debateComment);

            // if (debateComment.length > 0) {
            //     return response.status(200).send(ResponceUtil.getSucessResponce('Search Debate Comment Successful', debateComment));
            // } else {
            //     return response.status(200).send(ResponceUtil.getSucessResponce('Search Debate Comment Successful', []));
            // }
        } catch (error) {
            return response.status(400).send(ResponceUtil.getErrorResponce('Cannot Search Debate Comment', error));
        }
    }

    // Create Debate Comment API
    /**
     * @api {post} /api/debate/:debateId/comment Add Debate Comment
     * @apiGroup DebateComment
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {String} comment Debate Comment
     * @apiParamExample {json} Input
     * {
     *      "comment" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "New Debate Comment is created successfully",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/debate/:debateId/comment
     * @apiErrorExample {json} Debate Comment error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/:debateId/comment')
    @Authorized('customer')
    public async createDebateComment(@Param('debateId') debateId: number, @Body({ validate: true }) debateCommentParam: CreateDebateComment, @Req() req: any, @Res() response: any): Promise<any> {
        if (debateCommentParam.comment === '' || debateCommentParam.comment === null || debateCommentParam.comment === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
        }

        const debateComment = new DebateComment();
        debateComment.debateId = debateId;
        debateComment.comment = this.badWordService.clean(debateCommentParam.comment);
        debateComment.likeCount = 0;
        debateComment.dislikeCount = 0;
        debateComment.createdBy = req.user.id;
        debateComment.createdByUsername = req.user.username;

        const debateCommentSave = await this.dbCommentService.create(debateComment);
        if (debateCommentSave !== undefined) {

            // fetch user
            const pageUser = await this.pageuserService.findOne(debateCommentSave.createdBy);

            if (pageUser !== undefined) {
                // fetch page user
                const showFields = ['firstName', 'lastName', 'username', 'displayName','currentExp'];
                debateCommentSave.pageUser = ObjectUtil.createNewObjectWithField(pageUser, showFields);
            }

            const debateLogs = new DebateLogs();
            debateLogs.userId = req.user.id;
            debateLogs.action = DEBATE_COMMENT_LOG_ACTION.CREATE;
            debateLogs.detail = JSON.stringify(debateCommentSave);

            const debateLogsCreated = await this.debateLogsService.create(debateLogs);

            if (debateLogsCreated) {
                return response.status(200).send(ResponceUtil.getSucessResponce('Create Debate Comment Successful', debateCommentSave));
            }
        } else {
            const errorResponse: any = ResponceUtil.getErrorResponce('Unable to Create Debate Comment', undefined);
            return response.status(400).send(errorResponse);
        }
    }

    // Like Debate Comment API
    /**
     * @api {post} /api/debate/:debateId/comment/:id/like Like Debate Comment
     * @apiGroup DebateComment
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {boolean} isLike Like
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Like Debate Comment Successfully",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/debate/:debateId/comment/:id/like
     * @apiErrorExample {json} Debate Comment error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/:debate_id/comment/:id/like')
    @Authorized('customer')
    public async likedebate(@Param('debate_id') debateId: number, @Param('id') id: number, @Body({ validate: true }) param: UpdatePageUserLikeDebateComment, @Res() response: any, @Req() request: any): Promise<any> {
        if (id === null || id === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
        }

        if (param.isLike === null || param.isLike === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('undefined isLike', undefined));
        } 

        const user_id = request.user.id;

        const like: any = (param.isLike === 'true');

        const debateComment = await this.dbCommentService.likeDebateComment(user_id, debateId, id, like);
        const userExp = await this.userExpStmtService.findOne({ 
            where: [
                {
                    contentId: debateComment.id,
                    userId: user_id,
                    action: USER_EXP_STATEMENT.LIKE,
                    isFirst: true
                },
                {
                    contentId: debateComment.id,
                    userId: user_id,
                    action: USER_EXP_STATEMENT.DISLIKE,
                    isFirst: true
                },
                {
                    contentId: debateComment.id,
                    userId: user_id,
                    action: USER_EXP_STATEMENT.UNLIKE,
                    isFirst: true
                },
                {
                    contentId: debateComment.id,
                    userId: user_id,
                    action: USER_EXP_STATEMENT.UNDISLIKE,
                    isFirst: true
                }
            ],
            order: {
                createdDate: 'DESC'
            }
        });
        const userExpStmt = new UserExpStatement();
        userExpStmt.contentType = CONTENT_TYPE.DEBATE; 
        if (userExp === undefined) {
            userExpStmt.action = USER_EXP_STATEMENT.LIKE;
            userExpStmt.contentId = debateComment.id.toString();
            userExpStmt.userId = user_id.toString();

        } else {
            userExpStmt.contentId = userExp.contentId;
            userExpStmt.userId = userExp.userId;
            userExpStmt.isFirst = userExp.isFirst;
            if (param.isLike !== true) {
                if (userExp.action === USER_EXP_STATEMENT.DISLIKE) {
                    userExpStmt.action = USER_EXP_STATEMENT.UNDISLIKE;
                } else {
                    userExpStmt.action = USER_EXP_STATEMENT.DISLIKE;
                }
            } else {
                if (userExp.action === USER_EXP_STATEMENT.LIKE) {
                    userExpStmt.action = USER_EXP_STATEMENT.UNLIKE;
                } else {
                    userExpStmt.action = USER_EXP_STATEMENT.LIKE;
                }
            }
        }
        const dataUser = await this.userExpStmtService.createUserLikeDisLike(userExpStmt);
        const dataUserExpStmt = this.userExpStmtService.create(dataUser); 

        if (dataUserExpStmt) {
            return response.status(200).send(ResponceUtil.getSucessResponce('success', debateComment));
        } else {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
        }
    }

    // Update Debate Comment API
    /**
     * @api {put} /api/debate/:debateId/comment/:id Update Debate Comment
     * @apiGroup DebateComment
     * @apiParam (Request body) {String} comment Debate Comment
     * @apiHeader {String} Authorization
     * @apiParamExample {json} Input
     * {
     *      "comment" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": " Debate is updated successfully",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/debate/:debateId/comment/:id
     * @apiErrorExample {json} updateDebate error
     * HTTP/1.1 500 Internal Server Error
     */
    @Put('/:debateId/comment/:id')
    @Authorized('customer')
    public async updateDebateComment(@Body({ validate: true }) debateComment: UpdateDebateComment, @Param('debateId') _debateId: number, @Param('id') debateCommentId: number, @Req() req: any, @Res() response: any): Promise<any> {
        const debate = await this.dbCommentService.findOne({
            where: {
                debateId: _debateId,
                id: debateCommentId
            },
        });

        if (!debate) {
            return response.status(400).send(ResponceUtil.getErrorResponce('Invalid Debate Id', undefined));
        }

        if ((debate.createdBy !== null || debate.createdByUsername !== null) && (debate.createdBy !== undefined || debate.createdByUsername !== undefined) && (debate.createdBy === req.user.id || debate.createdByUsername === req.user.username)) {
            debate.comment = this.badWordService.clean(debateComment.comment);
            debate.modifiedBy = req.user.id;
            debate.modifiedByUsername = req.user.username;
        } else {
            return response.status(400).send(ResponceUtil.getErrorResponce('Cannot Update Debate Comment', {
                message: 'Comment creator was not match'
            }));
        }

        const debateCommentUpdate = await this.dbCommentService.update(debateCommentId, debate);
        if (debateCommentUpdate) {
            const debateLogs = new DebateLogs();
            debateLogs.userId = req.user.id;
            debateLogs.action = DEBATE_COMMENT_LOG_ACTION.DELETE;
            debateLogs.detail = JSON.stringify(debate);

            const debateLogsCreated = await this.debateLogsService.create(debateLogs);

            if (debateLogsCreated) {
                return response.status(200).send(ResponceUtil.getSucessResponce('Update Debate Comment Successful', debateCommentUpdate));
            }
        } else {
            return response.status(400).send(ResponceUtil.getErrorResponce('Unable to Update Debate Comment', undefined));
        }
    }

    // Delete Debate Comment API
    /**
     * @api {delete} /api/debate/:debateId/comment/:id Delete Debate Comment
     * @apiGroup DebateComment
     * @apiHeader {String} Authorization
     * @apiParamExample {json} Input
     * {
     *      "debateId" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully deleted Admin Debate Comment.",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/debate/:debateId/comment/:id
     * @apiErrorExample {json} Debate Comment error
     * HTTP/1.1 500 Internal Server Error
     */
    @Delete('/:debateId/comment/:id')
    @Authorized('customer')
    public async deleteDebateComment(@Param('debateId') _debateId: number, @Param('id') commentId: number, @Res() response: any, @Req() req: any): Promise<any> {
        if (commentId === null || commentId === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
        }

        const debateComment = await this.dbCommentService.findOne({
            where: {
                debateId: _debateId,
                id: commentId,
            },
        });

        const deleteDebateCommentResult = [];

        if (debateComment !== null && debateComment !== undefined) {
            const deleteDebateComment = await this.dbCommentService.delete(commentId);

            if (deleteDebateComment) {
                deleteDebateCommentResult.push(
                    {
                        id: commentId,
                        debateId: _debateId,
                        result: true,
                    }
                );
                const debateLogs = new DebateLogs();
                debateLogs.userId = req.user.id;
                debateLogs.action = DEBATE_COMMENT_LOG_ACTION.DELETE;
                debateLogs.detail = JSON.stringify(deleteDebateComment);

                const debateLogsCreated = await this.debateLogsService.create(debateLogs);

                if (debateLogsCreated) {
                    return response.status(200).send(ResponceUtil.getSucessResponce('Update Debate Comment Successful', deleteDebateComment));
                }
            } else {
                deleteDebateCommentResult.push(
                    {
                        id: commentId,
                        debateId: _debateId,
                        result: false,
                    }
                );

                return response.status(400).send(ResponceUtil.getErrorResponce('Unable to Delete Debate Comment', undefined));
            }
        } else {
            deleteDebateCommentResult.push(
                {
                    id: commentId,
                    debateId: _debateId,
                    result: false,
                }
            );

            return response.status(400).send(ResponceUtil.getErrorResponce('Unable to Get Debate Comment', undefined));
        }
    }

    // Delete Like Debate Comment API
    /**
     * @api {delete} /api/debate/:debateId/comment/:id/like Delete Like API
     * @apiGroup DebateComment
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {boolean} deleteLike Delete Like
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Like Debate Comment Successfully",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/debate/:debateId/comment/:id/like
     * @apiErrorExample {json} Debate Comment Error
     * HTTP/1.1 500 Internal Server Error
     */

    @Delete('/:debateId/comment/:id/like')
    @Authorized('customer')
    public async deleteLikeDebateComment(@Param('debateId') debateId: number, @Param('id') id: number, @Res() response: any, @Req() request: any): Promise<any> {
        if (id === null || id === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
        }

        const userId = request.user.id;

        const debateComment = await this.dbCommentService.deleteLikeDebateComment(userId, debateId, id, true);

        if (debateComment) {
            const debateLogs = new DebateLogs();
            debateLogs.userId = userId;
            debateLogs.action = DEBATE_COMMENT_LOG_ACTION.REMOVE_LIKE;
            debateLogs.detail = JSON.stringify(debateComment);

            const debateLogsCreated = await this.debateLogsService.create(debateLogs);

            if (debateLogsCreated) {
                return response.status(200).send(ResponceUtil.getSucessResponce('success', debateComment));
            }
        } else {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
        }
    }
}
