/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import 'reflect-metadata';
import { Body, Post, Get, Delete, Param, QueryParam, JsonController, Authorized, Res, Req, Put } from 'routing-controllers';
import { DebateCommentService } from '../../services/DebateCommentService';
import { DebateService } from '../../services/DebateService';
import { SearchFilter } from '../requests/SearchFilterRequest';
import { ResponceUtil } from '../../../utils/ResponceUtil';
import { DebateLogs } from '../../models/DebateLogs';
import { DEBATE_COMMENT_LOG_ACTION, CONTENT_TYPE, USER_EXP_STATEMENT } from '../../../LogsStatus';
import { DebateLogsService } from '../../services/DebateLogsService';
import moment = require('moment/moment');
import { UserExpStatement } from '../../models/UserExpStatement';
import { UserExpStatementService } from '../../services/UserExpStatementService';

@JsonController('/admin/debate')
export class AdminDebateCommentController {
    constructor(private debateService: DebateService, private debateCommentService: DebateCommentService, 
        private debateLogsService: DebateLogsService, private userExpStmtService: UserExpStatementService) {
    }

    // Debate Admin Comment API
    // Find Admin Debate Comment API
    /**
     * @api {get} /api/admin/debate/:debateId/comment/:id Find Debate Comment
     * @apiGroup AdminDebateComment
     * @apiHeader {String} Authorization
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Find Admin Debate Comment Successfully",
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
     * @apiSampleRequest /api/admin/debate/:debateId/comment/:id
     * @apiErrorExample {json} Admin Debate Comment Error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/:debateId/comment/:id')
    @Authorized()
    public async findDebateComment(@Param('debateId') debateId: number, @Param('id') commentId: number, @Res() response: any): Promise<any> {
        const debate = await this.debateService.findOne({
            where: {
                id: debateId,
            },
        });

        if (!debate) {
            return response.status(400).send(ResponceUtil.getErrorResponce('Invalid Debate Id', undefined));
        }

        const debateComment = await this.debateCommentService.findOne({
            where: {
                id: commentId,
            },
        });

        if (debateComment) {
            return response.status(200).send(ResponceUtil.getSucessResponce('Get Debate Comment Successful', debateComment));
        } else {
            return response.status(400).send(ResponceUtil.getErrorResponce('Unable to get Debate Comment', undefined));
        }
    }

    // Search Debate Comment API
    /**
     * @api {post} /api/admin/debate/:debateId/comment/search Search Debate Comment
     * @apiGroup AdminDebateComment
     * @apiHeader {String} Authorization
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
     *      "dislikeCount" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Search Admin Debate Successfully",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/debate/:debateId/comment/search
     * @apiErrorExample {json} Admin Debate Comment error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/:debateId/comment/search')
    @Authorized()
    public async searchDebateComment(@Body() filter: SearchFilter, @Param('debateId') debateIdParam: number, @QueryParam('show_user') showUser: boolean, @Res() response: any): Promise<any> {
        try {
            if (filter === null || filter === undefined) {
                return response.status(400).send(ResponceUtil.getErrorResponce('Invalid Search', undefined));
            }

            if (debateIdParam === null || debateIdParam === undefined) {
                return response.status(400).send(ResponceUtil.getErrorResponce('Invalid Debate Id', undefined));
            }

            filter.whereConditions = [{ debateId: debateIdParam }];

            let join: any = undefined;
            if (showUser) {
                join = {
                    alias: 'dbComment',
                    leftJoinAndSelect: {
                        pageuser: 'dbComment.pageUser'
                    }
                };
            }

            const debateComment: any[] = await this.debateCommentService.search(filter, join);

            if (debateComment.length > 0) {
                return response.status(200).send(ResponceUtil.getSucessResponce('Search Debate Comment Successful', debateComment));
            } else {
                return response.status(200).send(ResponceUtil.getErrorResponce('Search Debate Comment Successful', []));
            }
        } catch (error) {
            return response.status(400).send(ResponceUtil.getErrorResponce('Search Debate Comment Error', error));
        }
    }

    // Delete Debate Comment API
    /**
     * @api {delete} /api/admin/debate/:debateId/comment/:id Delete Debate Comment
     * @apiGroup AdminDebateComment
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
     * @apiSampleRequest /api/admin/debate/:debateId/comment/:id
     * @apiErrorExample {json} Debate Comment error
     * HTTP/1.1 500 Internal Server Error
     */
    @Delete('/:debateId/comment/:id')
    @Authorized()
    public async deleteDebateComment(@Param('debateId') _debateId: number, @Param('id') commentId: number, @Res() response: any, @Req() req: any): Promise<any> {
        if (commentId === null || commentId === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
        }

        const debateComment = await this.debateCommentService.findOne({
            where: {
                debateId: _debateId,
                id: commentId,
            },
        });

        const deleteDebateCommentResult = [];

        if (debateComment !== null && debateComment !== undefined) {
            const deleteDebateComment = await this.debateCommentService.delete(commentId);
            if (deleteDebateComment) {
                deleteDebateCommentResult.push(
                    {
                        id: commentId,
                        debateId: _debateId,
                        result: true,
                    }
                );

                return response.status(200).send(ResponceUtil.getSucessResponce('Delete Debate Comment Successful', deleteDebateCommentResult));
            } else {
                deleteDebateCommentResult.push(
                    {
                        id: commentId,
                        debateId: _debateId,
                        result: false,
                    }
                );

                const debateLogs = new DebateLogs();
                debateLogs.userId = req.user.id;
                debateLogs.action = DEBATE_COMMENT_LOG_ACTION.DELETE;
                debateLogs.detail = JSON.stringify(deleteDebateCommentResult);

                const debateLogsCreated = await this.debateLogsService.create(debateLogs);

                if (debateLogsCreated) {
                    return response.status(200).send(ResponceUtil.getSucessResponce('Delete Debate Success', deleteDebateCommentResult));
                }
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
    }

    // Approve Debate Comment API
    /**
     * @api {put} /api/admin/debate/:debateId/comment/:id/approve Approve Debate Comment
     * @apiGroup AdminDebateComment
     * @apiHeader {String} Authorization
     * @apiParamExample {json} Input
     * {
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully Approve Debate Comment.",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/debate/:debateId/comment/:id/approve
     * @apiErrorExample {json} Debate Comment error
     * HTTP/1.1 500 Internal Server Error
     */
    @Put('/:debateId/comment/:id/approve')
    @Authorized()
    public async approveDebateComment(@Param('debateId') _debateId: number, @Param('id') commentId: number, @Res() response: any, @Req() req: any): Promise<any> {
        if (commentId === null || commentId === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('debate comment Id is required', undefined));
        }

        if (_debateId === null || _debateId === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('debate Id is required', undefined));
        }

        const debateComment = await this.debateCommentService.findOne({
            where: {
                debateId: _debateId,
                id: commentId,
            },
        });

        if (debateComment !== null && debateComment !== undefined) {
            if (debateComment.approveUserId && debateComment.approveUserId !== '') {
                return response.status(400).send(ResponceUtil.getErrorResponce('Debate comment was approved.', undefined));
            }

            debateComment.approveUserId = req.user.id;
            debateComment.approveUsername = req.user.username;
            debateComment.approveDate = moment().toDate();

            const data = await this.debateCommentService.update(commentId, debateComment);

            if (data !== null && data !== undefined) {
                const debateLogs = new DebateLogs();
                debateLogs.userId = req.user.id;
                debateLogs.action = DEBATE_COMMENT_LOG_ACTION.APPROVE;
                debateLogs.detail = JSON.stringify(debateComment);

                await this.debateLogsService.create(debateLogs);

                const userExpStmt = new UserExpStatement();
                userExpStmt.contentType = CONTENT_TYPE.DEBATE;
                userExpStmt.action = USER_EXP_STATEMENT.COMMENT;
                userExpStmt.contentId = debateComment.id.toString();
                userExpStmt.userId = debateComment.createdBy.toString();

                const dataUser = await this.userExpStmtService.createUserExpStmt(userExpStmt);
                const dataUserExpStmt = this.userExpStmtService.create(dataUser);
                if (dataUserExpStmt) {
                    return response.status(200).send(ResponceUtil.getSucessResponce('Success approve debate Comment.', data));
                }
            } else {
                return response.status(400).send(ResponceUtil.getErrorResponce('Cannot approve debate comment.', undefined));
            }
        }

        return response.status(400).send(ResponceUtil.getErrorResponce('Cannot find debate comment.', undefined));
    }

    // Approve Debate Comment API
    /**
     * @api {put} /api/admin/debate/:debateId/comment/:id/unapprove Unapprove Debate Comment
     * @apiGroup AdminDebateComment
     * @apiHeader {String} Authorization
     * @apiParamExample {json} Input
     * {
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully Unpprove Debate Comment.",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/debate/:debateId/comment/:id/unapprove
     * @apiErrorExample {json} Debate Comment error
     * HTTP/1.1 500 Internal Server Error
     */
    @Put('/:debateId/comment/:id/unapprove')
    @Authorized()
    public async unapproveDebateComment(@Param('debateId') _debateId: number, @Param('id') commentId: number, @Res() response: any, @Req() req: any): Promise<any> {
        if (commentId === null || commentId === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('debate comment Id is required', undefined));
        }

        if (_debateId === null || _debateId === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('debate Id is required', undefined));
        }

        const debateComment = await this.debateCommentService.findOne({
            where: {
                debateId: _debateId,
                id: commentId,
            },
        });

        if (debateComment !== null && debateComment !== undefined) {
            if (debateComment.approveUserId === null || debateComment.approveUserId === undefined) {
                return response.status(400).send(ResponceUtil.getErrorResponce('Debate comment was not approved.', undefined));
            }

            debateComment.approveUserId = null;
            debateComment.approveUsername = null;
            debateComment.approveDate = null;

            const data = await this.debateCommentService.update(commentId, debateComment);

            if (data !== null && data !== undefined) {
                const debateLogs = new DebateLogs();
                debateLogs.userId = req.user.id;
                debateLogs.action = DEBATE_COMMENT_LOG_ACTION.APPROVE;
                debateLogs.detail = JSON.stringify(debateComment);

                await this.debateLogsService.create(debateLogs);

                return response.status(200).send(ResponceUtil.getSucessResponce('Success unapprove debate Comment.', data));
            } else {
                return response.status(400).send(ResponceUtil.getErrorResponce('Cannot unapprove debate comment.', undefined));
            }
        }

        return response.status(400).send(ResponceUtil.getErrorResponce('Cannot find debate comment.', undefined));
    }
}
