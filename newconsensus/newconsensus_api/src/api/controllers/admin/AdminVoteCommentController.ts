import 'reflect-metadata';
import { Get, Post, JsonController, Res, Body, Param, Authorized, Delete, Req, Put } from 'routing-controllers';
import { VoteCommentService } from '../../services/VoteCommentService';
import { SearchFilter } from '../requests/SearchFilterRequest';
import { ResponceUtil } from '../../../utils/ResponceUtil';
import moment = require('moment/moment');
import { UserExpStatementService } from '../../services/UserExpStatementService';
import { UserExpStatement } from '../../models/UserExpStatement';
import { USER_EXP_STATEMENT, CONTENT_TYPE } from '../../../LogsStatus';

@JsonController('/admin/vote')
export class AdminVoteController {

    constructor(private voteCommentService: VoteCommentService, private userExpStmtService: UserExpStatementService) {
    }

    // Admin VoteComment API
    // Find API
    /**
     * @api {get} /api/admin/vote/:vote_id/comment/:id Find API
     * @apiGroup Admin VoteComment
     * @apiHeader {String} Authorization
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Find VoteComment Successfully",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/vote/:vote_id/comment/:id
     * @apiErrorExample {json} vote error
     * HTTP/1.1 500 Internal Server Error
     */

    @Get('/:vote_id/comment/:id')
    @Authorized()
    public async find(@Param('vote_id') pVoteId: number, @Param('id') pId: number, @Req() request: any, @Res() response: any): Promise<any> {
        if (pId === null || pId === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
        }

        if (pVoteId === null || pVoteId === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
        }

        try {
            const data: any = await this.voteCommentService.findOne({
                where: {
                    voteId: pVoteId,
                    id: pId,
                },
            });

            if (data === null || data === undefined) {
                return response.status(400).send(ResponceUtil.getErrorResponce('Vote Comment was not Found.', data));
            }

            return response.status(200).send(ResponceUtil.getSucessResponce('success', data));
        } catch (error) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', error));
        }
    }

    // Admin VoteComment API
    // Search API
    /**
     * @api {post}/api/admin/vote/:voteId/comment/search Search API
     * @apiGroup Admin VoteComment
     * @apiParam (Request body) {number} limit limit
     * @apiParam (Request body) {number} offset offset
     * @apiParam (Request body) {String} select select
     * @apiParam (Request body) {String} relation relation
     * @apiParam (Request body) {String} whereConditions whereConditions
     * @apiParam (Request body) {boolean} isCount isCount (0=false, 1=true)
     * @apiHeader {String} Authorization
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Search VoteComment Successfully",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/vote/:vote_id/comment/search
     * @apiErrorExample {json} vote error
     * HTTP/1.1 500 Internal Server Error
     */

    @Post('/:voteId/comment/search')
    @Authorized()
    public async search(@Body() filter: SearchFilter, @Param('voteId') _voteId: number, @Req() request: any, @Res() response: any): Promise<any> {
        try {
            if (filter === null || filter === undefined) {
                return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
            }

            if (_voteId === null || _voteId === undefined) {
                return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
            }

            filter.whereConditions = [{ voteId: _voteId }];

            const data: any[] = await this.voteCommentService.search(filter);

            if (data.length > 0) {
                return response.status(200).send(ResponceUtil.getSucessResponce('Search Vote Comment Successful', data));
            } else {
                return response.status(400).send(ResponceUtil.getErrorResponce('Vote Comment Not Found', undefined));
            }
        } catch (error) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', error));
        }
    }

    // Admin VoteComment API
    // Delete API
    /**
     * @api {delete} /api/admin/vote/:vote_id/comment/:id Delete API
     * @apiGroup Admin VoteComment
     * @apiHeader {String} Authorization
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Delete VoteComment Successfully",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/vote/:vote_id/comment/:id
     * @apiErrorExample {json} vote error
     * HTTP/1.1 500 Internal Server Error
     */

    @Delete('/:vote_id/comment/:id')
    @Authorized()
    public async deleteVoteComment(@Param('vote_id') pVoteId: number, @Param('id') pId: number, @Req() request: any, @Res() response: any): Promise<any> {
        if (pVoteId === null || pVoteId === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
        }

        if (pId === null || pId === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
        }

        const data = await this.voteCommentService.deleteVoteComment({ voteId: pVoteId, id: pId });

        if (data !== null && data !== undefined) {
            return response.status(200).send(ResponceUtil.getSucessResponce('success', data));
        } else {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
        }
    }

    // Admin VoteComment API
    // Approve Vote Comment API
    /**
     * @api {put} /api/admin/vote/:vote_id/comment/:id/approve Approve Vote Comment API
     * @apiGroup Admin VoteComment
     * @apiHeader {String} Authorization
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Approve VoteComment Successfully",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/vote/:vote_id/comment/:id/approve
     * @apiErrorExample {json} vote error
     * HTTP/1.1 500 Internal Server Error
     */

    @Put('/:vote_id/comment/:id/approve')
    @Authorized()
    public async approveVoteComment(@Param('vote_id') pVoteId: number, @Param('id') pId: number, @Req() request: any, @Res() response: any): Promise<any> {
        if (pVoteId === null || pVoteId === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
        }

        if (pId === null || pId === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
        }

        const voteComment = await this.voteCommentService.findOne({
            where: {
                voteId: pVoteId,
                id: pId,
            },
        });

        if (voteComment !== null && voteComment !== undefined) {
            if (voteComment.approveUserId && voteComment.approveUserId !== '') {
                return response.status(400).send(ResponceUtil.getErrorResponce('Vote comment was approved.', undefined));
            }

            voteComment.approveUserId = request.user.id;
            voteComment.approveUsername = request.user.username;
            voteComment.approveDate = moment().toDate();

            const data = await this.voteCommentService.update(pId, voteComment);

            if (data !== null && data !== undefined) {
                const userExpStmt = new UserExpStatement();
                userExpStmt.contentType = CONTENT_TYPE.VOTE;
                userExpStmt.action = USER_EXP_STATEMENT.CREATE_COMMENT_VOTE;
                userExpStmt.contentId = voteComment.id.toString();
                userExpStmt.userId = voteComment.createdBy.toString();
        
                const dataUser = await this.userExpStmtService.createUserExpStmt(userExpStmt);
                const dataUserExpStmt = this.userExpStmtService.create(dataUser);
                
                if (dataUserExpStmt) {
                    return response.status(200).send(ResponceUtil.getSucessResponce('Success approve vote Comment.', data));
                }

            } else {
                return response.status(400).send(ResponceUtil.getErrorResponce('Cannot approve vote comment.', undefined));
            }
        }

        return response.status(400).send(ResponceUtil.getErrorResponce('Cannot find vote comment.', undefined));
    }

    // Admin VoteComment API
    // UnApprove Vote Comment API
    /**
     * @api {put} /api/admin/vote/:vote_id/comment/:id/unapprove UnApprove Vote Comment API
     * @apiGroup Admin VoteComment
     * @apiHeader {String} Authorization
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "UnApprove VoteComment Successfully",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/vote/:vote_id/comment/:id/unapprove
     * @apiErrorExample {json} vote error
     * HTTP/1.1 500 Internal Server Error
     */

    @Put('/:vote_id/comment/:id/unapprove')
    @Authorized()
    public async unapproveVoteComment(@Param('vote_id') pVoteId: number, @Param('id') pId: number, @Req() request: any, @Res() response: any): Promise<any> {
        if (pVoteId === null || pVoteId === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
        }

        if (pId === null || pId === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
        }

        const voteComment = await this.voteCommentService.findOne({
            where: {
                voteId: pVoteId,
                id: pId,
            },
        });

        if (voteComment !== null && voteComment !== undefined) {
            if (voteComment.approveUserId === null || voteComment.approveUserId === undefined) {
                return response.status(400).send(ResponceUtil.getErrorResponce('Vote comment was not approved.', undefined));
            }

            voteComment.approveUserId = null;
            voteComment.approveUsername = null;
            voteComment.approveDate = null;

            const data = await this.voteCommentService.update(pId, voteComment);

            if (data !== null && data !== undefined) {
                return response.status(200).send(ResponceUtil.getSucessResponce('Success approve vote Comment.', data));
            } else {
                return response.status(400).send(ResponceUtil.getErrorResponce('Cannot approve vote comment.', undefined));
            }
        }

        return response.status(400).send(ResponceUtil.getErrorResponce('Cannot find vote comment.', undefined));
    }
}
