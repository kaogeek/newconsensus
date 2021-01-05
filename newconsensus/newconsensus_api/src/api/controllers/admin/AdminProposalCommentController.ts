/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import 'reflect-metadata';
import {
    Post, Body, JsonController, Res, Get, Authorized, Param, Delete, Req, Put
} from 'routing-controllers';
import { ProposalCommentService } from '../../services/ProposalCommentService';
import { ProposalLogs } from '../../models/ProposalLogs';
import { SearchFilter } from './../requests/SearchFilterRequest';
import { ResponceUtil } from '../../../utils/ResponceUtil';
import { ProposalLogService } from '../../services/ProposalLogService';
import { PROPOSAL_COMMENT_LOG_ACTION, CONTENT_TYPE, USER_EXP_STATEMENT } from '../../../LogsStatus';
import moment = require('moment/moment');
import { UserExpStatementService } from '../../services/UserExpStatementService';
import { UserExpStatement } from '../../models/UserExpStatement';

@JsonController('/admin/proposal')
export class AdminProposalCommentController {

    constructor(private proposalCommentService: ProposalCommentService, private proposalLogService: ProposalLogService,private userExpStmtService: UserExpStatementService,) {
    }

    // Get Admin Proposal Comment Find API
    /**
     * @api {get} /api/admin/proposal/:proposal_id/comment/:id Admin Proposal Comment Find API
     * @apiHeader {String} Authorization
     * @apiGroup Admin Proposal Comment
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     * "message": "Successfully get proposal comment Find",
     * "data":{
     * "name" : "",
     * "description" : "",
     * }
     * "status": "1"
     * }
     * @apiSampleRequest /api/admin/proposal/:proposal_id/comment/:id
     * @apiErrorExample {json} proposal error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/:proposal_id/comment/:id')
    @Authorized()
    public async pageProposalCommentFind(@Param('proposal_id') proposalIdParam: number, @Param('id') commentId: number, @Res() response: any): Promise<any> {
        const proposalComment = await this.proposalCommentService.findOne({

            where: {
                id: commentId,
                proposalId: proposalIdParam,
            },
        });

        if (proposalComment) {
            const successResponse: any = ResponceUtil.getSucessResponce('Successfully get proposal comment Find.', proposalComment);
            return response.status(200).send(successResponse);
        } else {
            const errorResponse: any = ResponceUtil.getErrorResponce('Error get proposal comment Find.', undefined);
            return response.status(400).send(errorResponse);
        }
    }

    // Proposal Comment Search API
    /**
     * @api {Post} /api/admin/:proposal_id/comment/search Proposal Comment Search API
     * @apiGroup Admin Proposal Comment
     * @apiParam (Request body) {number} limit limit
     * @apiParam (Request body) {number} offset offset
     * @apiParam (Request body) {String} select select
     * @apiParam (Request body) {String} relation relation
     * @apiParam (Request body) {String} whereConditions whereConditions
     * @apiParam (Request body) {boolean} count count (0=false, 1=true)
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully get proposal list",
     *      "data":{
     *              "id" : "",
     *              "roomId" : "",
     *              "approveUserId" : "",
     *              "approveDate" : "",
     *              "likeCount" : "",
     *              "dislikeCount" : "",
     *              "endDate" : "", 
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/proposal/:proposal_id/comment/search
     * @apiErrorExample {json} Page error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/:proposal_id/comment/search')
    public async propalList(@Param('proposal_id') proposalIdParam: number, @Body({ validate: true }) filter: SearchFilter, @Res() response: any): Promise<any> {

        if (filter === null || filter === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
        }

        if (proposalIdParam === null || proposalIdParam === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
        }

        filter.whereConditions = [{ proposalId: proposalIdParam }];

        try {
            const data: any[] = await this.proposalCommentService.search(filter.limit, filter.offset, filter.select, filter.relation, filter.whereConditions, filter.orderBy, filter.count);

            if (data.length > 0) {
                return response.status(200).send(ResponceUtil.getSucessResponce('Search Proposal Comment Successful', data));
            } else {
                return response.status(200).send(ResponceUtil.getErrorResponce('Search Proposal Comment Successful', []));
            }
        } catch (error) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', error));
        }
    }
 
    // Admin  Delete Proposal Comment API
    /**
     * @api {delete} /api/admin/proposal/:proposal_id/comment/:id Delete Proposal Comment API
     * @apiGroup Admin Proposal Comment
     * @apiHeader {String} Authorization
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Delete VoteComment Successfully",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/proposal/:proposal_id/comment/:id
     * @apiErrorExample {json} vote error
     * HTTP/1.1 500 Internal Server Error
     */

    @Delete('/:proposal_id/comment/:id')
    @Authorized()
    public async deleteProposalComment(@Param('proposal_id') proposalIdParam: number, @Param('id') idParam: number, @Req() request: any, @Res() response: any): Promise<any> {
        if (idParam === null || idParam === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('proposal comment Id is required', undefined));
        }

        if (proposalIdParam === null || proposalIdParam === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('proposal Id is required', undefined));
        }

        const proposalComment = await this.proposalCommentService.findOne({
            where: {
                id: idParam,
                proposalId: proposalIdParam,
            },
        });

        if (proposalComment !== null && proposalComment !== undefined) {
            const data = await this.proposalCommentService.deleteFromProposal(request.user, proposalComment);

            if (data !== null && data !== undefined) {
                return response.status(200).send(ResponceUtil.getSucessResponce('success', data));
            } else {
                return response.status(400).send(ResponceUtil.getErrorResponce('error proposal comment', undefined));
            }
        }

        return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
    }

    // Proposal Comment Approve API
    /**
     * @api {Put} /api/admin/:proposal_id/comment/:id/approve Proposal Comment Approve API
     * @apiGroup Admin Proposal Comment
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Success approve proposal Comment",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/proposal/:proposal_id/comment/:id/approve
     * @apiErrorExample {json} Page error
     * HTTP/1.1 500 Internal Server Error
     */
    @Put('/:proposal_id/comment/:id/approve')
    @Authorized()
    public async approveProposal(@Param('proposal_id') proposalIdParam: number, @Param('id') idParam: number, @Req() request: any, @Res() response: any): Promise<any> {

        if (idParam === null || idParam === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('proposal comment Id is required', undefined));
        }

        if (proposalIdParam === null || proposalIdParam === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('proposal Id is required', undefined));
        }

        const proposalComment = await this.proposalCommentService.findOne({
            where: {
                id: idParam,
                proposalId: proposalIdParam,
            },
        });

        if (proposalComment !== null && proposalComment !== undefined) {
            if(proposalComment.approveUserId && proposalComment.approveUserId !== ''){
                return response.status(400).send(ResponceUtil.getErrorResponce('Proposal comment was approved.', undefined));
            }
            proposalComment.approveUserId = request.user.id;
            proposalComment.approveUsername = request.user.username;
            proposalComment.approveDate = moment().toDate();

            const data = await this.proposalCommentService.update(idParam, proposalComment);

            if (data !== null && data !== undefined) {
                const userExpStmt = new UserExpStatement();
                userExpStmt.contentType = CONTENT_TYPE.PROPOSAL;
                userExpStmt.action = USER_EXP_STATEMENT.COMMENT;
                userExpStmt.contentId = proposalComment.id.toString();
                userExpStmt.userId = proposalComment.createdBy.toString();
        
                const dataUser = await this.userExpStmtService.createUserExpStmt(userExpStmt);
                const dataUserExpStmt = this.userExpStmtService.create(dataUser);
                if (dataUserExpStmt) {
                    return response.status(200).send(ResponceUtil.getSucessResponce('Success approve proposal Comment.', data));
                }
                this.addLog(proposalIdParam, PROPOSAL_COMMENT_LOG_ACTION.APPROVE, JSON.stringify(proposalComment), moment().toDate(), request.user.id);

            } else {
                return response.status(400).send(ResponceUtil.getErrorResponce('Cannot approve proposal comment.', undefined));
            }
        }

        return response.status(400).send(ResponceUtil.getErrorResponce('Cannot find proposal comment.', undefined));
    }

    // Proposal Comment Unapprove API
    /**
     * @api {Put} /api/admin/:proposal_id/comment/:id/unapprove Proposal Comment Unapprove API
     * @apiGroup Admin Proposal Comment
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Success unapprove proposal Comment",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/proposal/:proposal_id/comment/:id/unapprove
     * @apiErrorExample {json} Page error
     * HTTP/1.1 500 Internal Server Error
     */
    @Put('/:proposal_id/comment/:id/unapprove')
    @Authorized()
    public async unapproveProposal(@Param('proposal_id') proposalIdParam: number, @Param('id') idParam: number, @Req() request: any, @Res() response: any): Promise<any> {

        if (idParam === null || idParam === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('proposal comment Id is required', undefined));
        }

        if (proposalIdParam === null || proposalIdParam === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('proposal Id is required', undefined));
        }

        const proposalComment = await this.proposalCommentService.findOne({
            where: {
                id: idParam,
                proposalId: proposalIdParam,
            },
        });

        if (proposalComment !== null && proposalComment !== undefined) {
            if(proposalComment.approveUserId === null || proposalComment.approveUserId === undefined){
                return response.status(400).send(ResponceUtil.getErrorResponce('Proposal comment was not approved.', undefined));
            }

            proposalComment.approveUserId = null;
            proposalComment.approveUsername = null;
            proposalComment.approveDate = null;

            const data = await this.proposalCommentService.update(idParam, proposalComment);

            if (data !== null && data !== undefined) {
                this.addLog(proposalIdParam, PROPOSAL_COMMENT_LOG_ACTION.UNAPPROVE, JSON.stringify(proposalComment), moment().toDate(), request.user.id);

                return response.status(200).send(ResponceUtil.getSucessResponce('Success unapprove proposal Comment.', data));
            } else {
                return response.status(400).send(ResponceUtil.getErrorResponce('Cannot approve proposal comment.', undefined));
            }
        }

        return response.status(400).send(ResponceUtil.getErrorResponce('Cannot find proposal comment.', undefined));
    }

    private addLog(proposalId: number, action: string, detail: string, date: Date, userId: number): Promise<any> {
        const log = new ProposalLogs();
        log.date = date;
        log.detail = detail;
        log.proposalId = proposalId;
        log.action = action;
        log.userId = userId;

        return this.proposalLogService.create(log);
    }
}
