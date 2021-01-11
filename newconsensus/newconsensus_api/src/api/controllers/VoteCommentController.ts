/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import 'reflect-metadata';
import { Get, Post, JsonController, Res, Body, Authorized, Put, Delete, Req, Param, QueryParam } from 'routing-controllers';
import { VoteCommentService } from '../services/VoteCommentService';
import { ResponceUtil } from '../../utils/ResponceUtil';
import { VoteComment } from '../models/VoteComment';
import { CreateVoteComment } from './requests/CreateVoteCommentRequest';
import { UpdateVoteComment } from './requests/UpdateVoteCommentRequest';
import { SearchFilter } from './requests/SearchFilterRequest';
import { UpdatePageUserLikeVoteComment } from './requests/UpdatePageUserLikeVoteCommentRequest';
import { VoteService } from '../services/VoteService';
import { ConfigService } from '../services/ConfigService';
import { BadWordService } from '../services/BadWordService';
import { VOTE_COMMENT_APPROVE_REQUIRED_CONFIG } from '../../Constants';
import { UserExpStatement } from '../models/UserExpStatement';
import { CONTENT_TYPE, USER_EXP_STATEMENT } from '../../LogsStatus';
import { UserExpStatementService } from '../services/UserExpStatementService';

@JsonController('/vote')
export class VoteCommentController {

    constructor(private voteService: VoteService, private voteCommentService: VoteCommentService, private configService: ConfigService,
        private badWordService: BadWordService, private userExpStmtService: UserExpStatementService) {
    }

    // VoteComment API
    // Find API
    /**
     * @api {get} /api/vote/:vote_id/comment/:id Find API
     * @apiGroup VoteComment
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Find VoteComment Successfully",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/vote/:vote_id/comment/:id
     * @apiErrorExample {json} voteComment error
     * HTTP/1.1 500 Internal Server Error
     */

    @Get('/:vote_id/comment/:id')
    public async find(@Param('vote_id') pVoteId: number, @Param('id') pId: number, @Res() response: any): Promise<any> {
        if (pId === null || pId === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', 'Id is null'));
        }

        if (pVoteId === null || pVoteId === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', 'VoteId is null'));
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

    // VoteComment API
    // Create API
    /**
     * @api {post} /api/vote/:vote_id/comment Create API
     * @apiGroup VoteComment
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {String} comment Comment
     * @apiParam (Request body) {number {..1}=1,0,-1} value Value
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Create VoteComment Successfully",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/vote/:vote_id/comment
     * @apiErrorExample {json} voteComment error
     * HTTP/1.1 500 Internal Server Error
     */

    @Post('/:vote_id/comment')
    @Authorized('customer')
    public async create(@Body({ validate: true }) param: CreateVoteComment, @Param('vote_id') pVoteId: number, @Req() request: any, @Res() response: any): Promise<any> {
        if (pVoteId === null || pVoteId === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', 'VoteId is null'));
        }

        if (request.user === null || request.user === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', 'User is null'));
        }

        const voteComment = new VoteComment();

        voteComment.comment = this.badWordService.clean(param.comment);
        voteComment.voteId = pVoteId;

        if (param.value === null || param.value === undefined || (param.value !== '1' && param.value !== '0' && param.value !== '-1')) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', 'can not create'));
        }

        // check if already exist lock not to create more that one voteComment
        const filter = new SearchFilter();
        filter.whereConditions = [{
            voteId: pVoteId,
            createdBy: request.user.id
        }];
        const oldSearch: any[] = await this.voteCommentService.search(filter);

        voteComment.value = +param.value;

        let data = undefined;
        if (oldSearch !== undefined && oldSearch.length > 0) {
            data = await this.voteCommentService.update(oldSearch[0].id, voteComment);
        } else {
            data = await this.voteCommentService.create(request.user, voteComment);
        }

        if (data !== null && data !== undefined) {
            return response.status(200).send(ResponceUtil.getSucessResponce('success', data));
        } else {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', 'can not create'));
        }
    }

    // VoteComment API
    // Update API
    /**
     * @api {put} /api/vote/:vote_id/comment/:id Update API
     * @apiGroup VoteComment
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {String} comment Comment
     * @apiParam (Request body) {number {..1}=1,0,-1} value Value
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Update VoteComment Successfully",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/vote/:vote_id/comment/:id
     * @apiErrorExample {json} voteComment error
     * HTTP/1.1 500 Internal Server Error
     */

    @Put('/:vote_id/comment/:id')
    @Authorized('customer')
    public async update(@Param('vote_id') pVoteId: number, @Param('id') pId: number, @Body({ validate: true }) param: UpdateVoteComment, @Req() request: any, @Res() response: any): Promise<any> {
        if (pVoteId === null || pVoteId === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', 'VoteId is null'));
        }

        if (pId === null || pId === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', 'Id is null'));
        }

        if (request.user === null || request.user === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', 'user is null'));
        }

        const voteComment: VoteComment = await this.voteCommentService.findOne({
            where: {
                voteId: pVoteId,
                id: pId,
            },
        });

        if (voteComment !== null && voteComment !== undefined) {
            // validate user
            if (voteComment.createdBy !== null && voteComment.createdBy !== undefined) {
                if (voteComment.createdBy !== request.user.id) {
                    return response.status(400).send(ResponceUtil.getErrorResponce('error', 'user can not edit'));
                }
            }

            voteComment.comment = this.badWordService.clean(param.comment);
            if (param.value === null || param.value === undefined || (param.value !== '1' && param.value !== '0' && param.value !== '-1')) {
                return response.status(400).send(ResponceUtil.getErrorResponce('error', 'value is Invalid'));
            }

            // reset like
            if ((voteComment.value + '') !== param.value) {
                voteComment.likeCount = 0;
                voteComment.dislikeCount = 0;
            }

            voteComment.value = +param.value;

            const config = await this.configService.getConfig(VOTE_COMMENT_APPROVE_REQUIRED_CONFIG);

            if (config && config.value && config.value !== '') {
                if (config.value === 'true') {
                    voteComment.approveDate = null;
                    voteComment.approveUserId = null;
                    voteComment.approveUsername = null;
                }
            }

            const data = await this.voteCommentService.update(pId, voteComment);

            if (data !== null && data !== undefined) {
                return response.status(200).send(ResponceUtil.getSucessResponce('success', data));
            } else {
                return response.status(400).send(ResponceUtil.getErrorResponce('error', 'can not update'));
            }
        }

        return response.status(400).send(ResponceUtil.getErrorResponce('error', 'Can not update, Vote comment was not fount'));
    }

    // VoteComment API
    // Delete API
    /**
     * @api {delete} /api/vote/:vote_id/comment/:id Delete API
     * @apiGroup VoteComment
     * @apiHeader {String} Authorization
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Delete Vote Successfully",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/vote/:vote_id/comment/:id
     * @apiErrorExample {json} vote error
     * HTTP/1.1 500 Internal Server Error
     */

    @Delete('/:vote_id/comment/:id')
    @Authorized('customer')
    public async delete(@Param('vote_id') pVoteId: number, @Param('id') pId: number, @Req() request: any, @Res() response: any): Promise<any> {
        if (pVoteId === null || pVoteId === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', 'VoteId is null'));
        }

        if (pId === null || pId === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', 'Id is null'));
        }

        const data = await this.voteCommentService.deleteVoteComment({ voteId: pVoteId, id: pId }, request.user);

        if (data !== null && data !== undefined) {
            return response.status(200).send(ResponceUtil.getSucessResponce('success', data));
        } else {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', 'can not delete'));
        }
    }

    // VoteComment API
    // Search API
    /**
     * @api {post} /api/vote/:vote_id/comment/search Search API
     * @apiGroup VoteComment
     * @apiParam (Request body) {number} limit limit
     * @apiParam (Request body) {number} offset offset
     * @apiParam (Request body) {String} select select
     * @apiParam (Request body) {String} relation relation
     * @apiParam (Request body) {String} whereConditions whereConditions
     * @apiParam (Request body) {boolean} isCount isCount (0=false, 1=true)
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Search VoteComment Successfully",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/vote/:vote_id/comment/search
     * @apiErrorExample {json} voteComment error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/:vote_id/comment/search')
    public async search(@Body() filter: SearchFilter, @Param('vote_id') pVoteId: number, @QueryParam('show_user') showUser: boolean, @QueryParam('user_like') userLikeId: number, @Res() response: any): Promise<any> {
        try {
            if (filter === null || filter === undefined) {
                return response.status(400).send(ResponceUtil.getErrorResponce('Invalid Search', undefined));
            }

            if (pVoteId === null || pVoteId === undefined) {
                return response.status(400).send(ResponceUtil.getErrorResponce('Invalid Vote Id', undefined));
            }

            let join: any = undefined;
            if (showUser) {
                join = {
                    alias: 'voteComment',
                    leftJoinAndSelect: {
                        pageuser: 'voteComment.pageUser'
                    }
                };
            }

            let data: any[] = await this.voteCommentService.search(filter, join);

            data = this.voteService.cleanVotesPageUser(data);

            if (data !== null && data !== undefined) {
                return response.status(200).send(ResponceUtil.getSucessResponce('Search Vote Comment Successfull', data));
            } else {
                return response.status(200).send(ResponceUtil.getSucessResponce('Search Vote Comment Successfull', []));
            }
        } catch (error) {
            return response.status(400).send(ResponceUtil.getErrorResponce('Cannot Search Vote Comment', error));
        }
    }

    // VoteComment API
    // Like API
    /**
     * @api {post} /api/vote/:vote_id/comment/:id/like Like API
     * @apiGroup VoteComment
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {boolean} isLike Like
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Like VoteComment Successfully",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/vote/:vote_id/comment/:id/like
     * @apiErrorExample {json} voteComment error
     * HTTP/1.1 500 Internal Server Error
     */

    @Post('/:vote_id/comment/:id/like')
    @Authorized('customer')
    public async like(@Body({ validate: true }) param: UpdatePageUserLikeVoteComment, @Param('vote_id') pVoteId: number, @Param('id') pId: number, @Res() response: any, @Req() request: any): Promise<any> {
        if (pId === null || pId === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', 'Id is null'));
        }

        const user_id = request.user.id;

        const like: any = (param.isLike === 'true');

        const vote = await this.voteCommentService.like(user_id, pVoteId, pId, like);

        if (vote !== null && vote !== undefined) {
            const userExp = await this.userExpStmtService.findOne({
                where: [
                    {
                        contentId: vote.id,
                        userId: user_id,
                        action: USER_EXP_STATEMENT.LIKE,
                        isFirst: true
                    },
                    {
                        contentId: vote.id,
                        userId: user_id,
                        action: USER_EXP_STATEMENT.DISLIKE,
                        isFirst: true
                    },
                    {
                        contentId: vote.id,
                        userId: user_id,
                        action: USER_EXP_STATEMENT.UNLIKE,
                        isFirst: true
                    },
                    {
                        contentId: vote.id,
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
            userExpStmt.contentType = CONTENT_TYPE.VOTE;
            if (userExp === undefined) {
                userExpStmt.action = USER_EXP_STATEMENT.LIKE;
                userExpStmt.contentId = vote.id.toString();
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
                return response.status(200).send(ResponceUtil.getSucessResponce('success', vote));
            } else {
                return response.status(400).send(ResponceUtil.getErrorResponce('error', 'can not like'));
            }
        } else {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', 'can not like'));
        }
    }

    // VoteComment API
    // Delete Like API
    /**
     * @api {delete} /api/vote/:vote_id/comment/:id/like Delete Like API
     * @apiGroup VoteComment
     * @apiHeader {String} Authorization
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Like VoteComment Successfully",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/vote/:vote_id/comment/:id/like
     * @apiErrorExample {json} voteComment error
     * HTTP/1.1 500 Internal Server Error
     */

    @Delete('/:vote_id/comment/:id/like')
    @Authorized('customer')
    public async deleteLike(@Param('vote_id') pVoteId: number, @Param('id') pId: number, @Res() response: any, @Req() request: any): Promise<any> {

        if (pId === null || pId === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', 'Id is null'));
        }

        const userId = request.user.id;

        const vote = await this.voteCommentService.deleteLike(userId, pVoteId, pId, true);

        if (vote !== null && vote !== undefined) {
            return response.status(200).send(ResponceUtil.getSucessResponce('success', vote));
        } else {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', 'can not delete like'));
        }
    }
}
