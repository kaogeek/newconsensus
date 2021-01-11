/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import 'reflect-metadata';
import {
    Post, Body, JsonController, Res, Get, Authorized, Put, Param, Req, Delete, QueryParam
} from 'routing-controllers';
import { CreateProposalComment } from './requests/CreateProposalCommentRequest';
import { UpdateProposalComment } from './requests/UpdateProposalCommentRequest';
import { ProposalCommentService } from '../services/ProposalCommentService';
import { PageUserLikeProposalCommentService } from '../services/PageUserLikeProposalCommentService';
import { ProposalComments } from '../models/ProposalComments';
import { ProposalService } from '../services/ProposalService';
import { SearchFilter } from './requests/SearchFilterRequest';
import { ResponceUtil } from '../../utils/ResponceUtil';
import { BadWordService } from '../services/BadWordService';
import { UserExpStatementService } from '../services/UserExpStatementService';
import { UserExpStatement } from '../models/UserExpStatement';
import { USER_EXP_STATEMENT, CONTENT_TYPE } from '../../LogsStatus';

@JsonController('/proposal')
export class ProposalCommentController {

    constructor(private proposalCommentService: ProposalCommentService,
        private proposalService: ProposalService, private pplikeCommentService: PageUserLikeProposalCommentService,
        private badWordService: BadWordService, private userExpStmtService: UserExpStatementService) {
    }

    // Create Proposal Comment API
    /**
     * @api {post} /api/proposal/:proposal_id/comment Create Proposal Comment API
     * @apiGroup Proposal Comment
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {string} comment Proposal Comment
     * @apiParamExample {json} Input
     * {
     *      "comment" : "",
     *      "likeCount" : "",
     *      "dislikeCount" : "",
     * }
     * 
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "New Proposal Comment is created successfully",
     *      "status": "1",
     *      "data": {
     *              "proposalId" : "",
     *              "comment" : "",
     *              "likeCount" : "",
     *              "dislikeCount" : "",
     *      }
     * }
     * @apiSampleRequest /api/proposal/:proposal_id/comment
     * @apiErrorExample {json} Proposal Comment error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/:proposal_id/comment')
    @Authorized('customer')
    public async createProposalCommentPage(@Param('proposal_id') proposalId: number, @Body({ validate: true }) proposalCommentParam: CreateProposalComment, @Req() req: any, @Res() response: any): Promise<any> {

        const proposal = await this.proposalService.findOne({

            where: {
                id: proposalId,
            },
        });

        if (!proposal) {
            const errorproposalResponse: any = ResponceUtil.getErrorResponce('invalid proposal id', undefined);
            return response.status(400).send(errorproposalResponse);
        }

        const proposalComment = new ProposalComments();
        proposalComment.proposalId = proposalId;
        proposalComment.comment = this.badWordService.clean(proposalCommentParam.comment);
        proposalComment.likeCount = 0;
        proposalComment.dislikeCount = 0;
        proposalComment.createdBy = req.user.id.toString();
        proposalComment.createdByUsername = req.user.username;

        const proposalCommentSave = await this.proposalCommentService.create(proposalComment);
        if (proposalCommentSave !== undefined) {
            const successResponse: any = ResponceUtil.getSucessResponce('Successfully created a new proposalComment.', proposalCommentSave);
            return response.status(200).send(successResponse);
        } else {
            const errorResponse: any = ResponceUtil.getErrorResponce('unable to create proposalComment.', undefined);
            return response.status(400).send(errorResponse);
        }
    }

    // Edit Proposal Comment API
    /**
     * @api {put} /api/proposal/:proposal_id/comment/:id Edit Proposal Comment API
     * @apiGroup Proposal Comment
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {string} comment Prposal comment
     * @apiParamExample {json} Input
     * {
     *      "proposalId" : "",
     *      "comment" : "",
     *      "likeCount" : "",
     *      "dislikeCount" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Proposal is updated successfully",
     *      "status": "1"
     *      "data": {
     *               "proposalId" : "",
     *               "comment" : "",
     *               "likeCount" : "",
     *               "dislikeCount" : "",
     *      }
     * }
     * @apiSampleRequest /api/proposal/:proposal_id/comment/:id
     * @apiErrorExample {json} updateProposal error
     * HTTP/1.1 500 Internal Server Error
     */
    @Put('/:proposal_id/comment/:id')
    @Authorized('customer')
    public async editProposalPage(@Param('proposal_id') proposalIdParam: number, @Param('id') commentId: number, @Body({ validate: true }) proposalCommentParam: UpdateProposalComment, @Req() request: any, @Res() response: any): Promise<any> {

        const proposal = await this.proposalService.findOne({

            where: {
                id: proposalIdParam,
            },
        });

        if (!proposal) {
            const errorproposalResponse: any = ResponceUtil.getErrorResponce('invalid proposal id', undefined);
            return response.status(400).send(errorproposalResponse);
        }

        const proposalComment = await this.proposalCommentService.findOne({

            where: {
                id: commentId,
                proposalId: proposalIdParam,
            },
        });

        if (!proposalComment) {
            const errorResponse: any = ResponceUtil.getErrorResponce('invalid proposal comment id', undefined);
            return response.status(400).send(errorResponse);
        }

        proposalComment.comment = this.badWordService.clean(proposalCommentParam.comment);
        proposalComment.modifiedBy = request.user.id;
        proposalComment.modifiedByUsername = request.user.username;

        const proposalUpdate = await this.proposalCommentService.update(commentId, proposalComment);
        if (proposalUpdate) {
            const successResponse: any = ResponceUtil.getSucessResponce('Successfully updated the proposal comment.', proposalUpdate);
            return response.status(200).send(successResponse);
        } else {
            const errorResponse: any = ResponceUtil.getErrorResponce('unable to update proposal comment', undefined);
            return response.status(400).send(errorResponse);
        }
    }

    // Delete Proposal Comment API
    /**
     * @api {delete} /api/proposal/:proposal_id/comment/:id Delete Proposal Comment API
     * @apiGroup Proposal Comment
     * @apiHeader {String} Authorization
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Delete VoteComment Successfully",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/proposal/:proposal_id/comment/:id
     * @apiErrorExample {json} vote error
     * HTTP/1.1 500 Internal Server Error
     */

    @Delete('/:proposal_id/comment/:id')
    @Authorized('customer')
    public async deleteProposalComment(@Param('proposal_id') proposalIdParam: number, @Param('id') idParam: number, @Req() request: any, @Res() response: any): Promise<any> {

        if (idParam === null || idParam === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error comment id', undefined));
        }

        if (proposalIdParam === null || proposalIdParam === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error proposal id', undefined));
        }

        const poposal = await this.proposalService.findOne({
            where: {
                id: proposalIdParam,
            },
        });
        if (poposal === null || poposal === undefined) {

            return response.status(400).send(ResponceUtil.getErrorResponce('error Proposal was not found', undefined));
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

    // Get Proposal Comment Find API
    /**
     * @api {get} /api/proposal/:proposal_id/comment/:id proposal comment Find API
     * @apiGroup Proposal Comment
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     * "status": "1"
     * "message": "Successfully get proposal Find",
     * "data":{
     *          "proposalId" : "",
     *          "comment" : "",
     *          "likeCount" : "",
     *          "dislikeCount" : "",
     * }
     * }
     * @apiSampleRequest /api/proposal/:proposal_id/comment/:id
     * @apiErrorExample {json} proposal error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/:proposal_id/comment/:id')
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

    // Proposal Commemt Search API
    /**
     * @api {Post} /api/proposal/:proposal_id/comment/search Proposal Comment Search API
     * @apiGroup Proposal Comment
     * @apiParam (Request body) {number} limit limit
     * @apiParam (Request body) {number} offset offset
     * @apiParam (Request body) {String} select select
     * @apiParam (Request body) {String} relation relation
     * @apiParam (Request body) {String} whereConditions whereConditions
     * @apiParam (Request body) {boolean} isCount isCount (0=false, 1=true)   
     * @apiParam {boolean} show_user flag that will make data return user
     * @apiParam {number} userLike user's id fetch data user like
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "status": "1"
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
     * }
     * @apiSampleRequest /api/proposal/:proposal_id/comment/search
     * @apiErrorExample {json} Page error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/:proposal_id/comment/search')
    public async propalList(@Body({ validate: true }) filter: SearchFilter, @Param('proposal_id') proposalIdParam: number, @QueryParam('show_user') showUser: boolean, @QueryParam('user_like') userLikeId: number, @Res() response: any): Promise<any> {

        if (filter === null || filter === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
        }

        if (proposalIdParam === null || proposalIdParam === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
        }

        if (filter.whereConditions !== null && filter.whereConditions !== undefined) {
            if (filter.whereConditions.length > 0) {
                if (Array.isArray(filter.whereConditions)) {
                    for (const con of filter.whereConditions) {
                        con.proposalId = proposalIdParam;
                    }
                } else {
                    filter.whereConditions = 'proposal_id = ' + proposalIdParam + ' and ' + filter.whereConditions;
                }
            } else {
                filter.whereConditions = [{ proposalId: proposalIdParam }];
            }
        } else {
            filter.whereConditions = [{ proposalId: proposalIdParam }];
        }

        try {
            let join: any = undefined;
            if (showUser) {
                join = {
                    alias: 'pcomment',
                    leftJoinAndSelect: {
                        pageuser: 'pcomment.pageUser'
                    }
                };
            }

            let data: any[] = await this.proposalCommentService.search(filter.limit, filter.offset, filter.select, filter.relation, filter.whereConditions, filter.orderBy, filter.count, join);

            const clearResult: any[] = [];
            const whereConditions: any[] = [];
            const commentItemMap = {};
            if (data !== undefined && data !== null) {
                for (let item of data) {
                    const key: string = item.id;
                    item = this.proposalService.cleanPageUserField(item);
                    clearResult.push(item);
                    // add to map
                    commentItemMap[key] = item;

                    const likeFilter = { proposalCommentId: item.id, userId: userLikeId };
                    whereConditions.push(likeFilter);
                }
            }

            data = clearResult;

            if (userLikeId !== undefined) {
                // search like
                const likeFilter = new SearchFilter();
                likeFilter.whereConditions = whereConditions;

                const likeResult = await this.pplikeCommentService.search(likeFilter.limit, likeFilter.offset, likeFilter.select, likeFilter.relation, likeFilter.whereConditions, likeFilter.orderBy, likeFilter.count);

                if (likeResult.length > 0) {
                    for (const item of likeResult) {
                        const key: string = item.proposalCommentId;

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
        } catch (error) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', error));
        }
    }

    // Proposal Like Comment API
    /**
     * @api {post} /api/proposal/:proposal_id/comment/like Like Proposal Comment API
     * @apiGroup Proposal Comment
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {boolean} isLike boolean 0,1
     * @apiParamExample {json} Input
     * {
     *      "approveUserId" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Proposal is like successfully",
     *      "status": "1"
     *      "data" : {
     *              "roomId" : "",
     *              "title" : "",
     *              "content" : "",
     *              "reqSupporter" : "",
     *              "approveUserId" : "",
     *              "approveDate" : "",
     *              "likeCount" : "",
     *              "dislikeCount" : "",
     *              "supporterCount" : "",
     *              "endDate" : "",
     *      }
     * }
     * @apiSampleRequest /api/proposal/:proposal_id/comment/:id/like
     * @apiErrorExample {json} Proposal Like error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/:proposal_id/comment/:id/like')
    @Authorized('customer')
    public async likeProposalPage(@Body({ validate: true }) param: UpdateProposalComment, @Param('proposal_id') proposalIdParam: number, @Param('id') id: number, @Req() req: any, @Res() response: any): Promise<any> {

        if (id === null || id === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('undefined id', undefined));
        }

        if (param.isLike === null || param.isLike === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('undefined isLike', undefined));
        } 

        const user_id = req.user.id;
        const like = await this.proposalCommentService.likeProposalComment(req.user, proposalIdParam, id, param.isLike);
        
        if (like) { 
            const userExp = await this.userExpStmtService.findOne({ 
                where: [
                    {
                        contentId: like.id,
                        userId: user_id,
                        action: USER_EXP_STATEMENT.LIKE,
                        isFirst: true
                    },
                    {
                        contentId: like.id,
                        userId: user_id,
                        action: USER_EXP_STATEMENT.DISLIKE,
                        isFirst: true
                    },
                    {
                        contentId: like.id,
                        userId: user_id,
                        action: USER_EXP_STATEMENT.UNLIKE,
                        isFirst: true
                    },
                    {
                        contentId: like.id,
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
            userExpStmt.contentType = CONTENT_TYPE.PROPOSAL; 
            if (userExp === undefined) {
                userExpStmt.action = USER_EXP_STATEMENT.LIKE;
                userExpStmt.contentId = like.id.toString();
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
                return response.status(200).send(ResponceUtil.getSucessResponce('success', like));
            }
        } else {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
        }
    }

    // Proposal Delete Like API
    /**
     * @api {Delete} /api/proposal/:proposal_id/comment/:id/like Delete Like Proposal API
     * @apiGroup Proposal Comment
     * @apiHeader {String} Authorization
     * @apiParamExample {json} Input
     * {
     *      "approveUserId" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Proposal is delete like successfully",
     *      "status": "1"
     *      "data" : {
     *              "roomId" : "",
     *              "title" : "",
     *              "content" : "",
     *              "reqSupporter" : "",
     *              "approveUserId" : "",
     *              "approveDate" : "",
     *              "likeCount" : "",
     *              "dislikeCount" : "",
     *              "supporterCount" : "",
     *              "endDate" : "",
     *      }
     * }
     * @apiSampleRequest /api/proposal/:proposal_id/comment/:id/like
     * @apiErrorExample {json} Proposal Like error
     * HTTP/1.1 500 Internal Server Error
     */
    @Delete('/:proposal_id/comment/:id/like')
    @Authorized('customer')
    public async deleteProposalPage(@Param('proposal_id') proposalIdParam: number, @Param('id') id: number, @Req() req: any, @Res() response: any): Promise<any> {

        if (id === null || id === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
        }

        if (proposalIdParam === null || proposalIdParam === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error proposal_id', undefined));
        }

        const user = req.user;
        const removeLike = await this.proposalCommentService.deleteLikeProposalComment(user, proposalIdParam, id);

        if (removeLike) {
            return response.status(200).send(ResponceUtil.getSucessResponce('success', removeLike));
        } else {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
        }
    }

}
