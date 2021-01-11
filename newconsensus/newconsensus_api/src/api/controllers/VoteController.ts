/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import 'reflect-metadata';
import { Get, Post, Param, JsonController, Res, Body, Authorized, Req, Delete, QueryParam } from 'routing-controllers';
import { VoteService } from '../services/VoteService';
import { SearchFilter } from './requests/SearchFilterRequest';
import { ResponceUtil } from '../../utils/ResponceUtil';
import { DecayFunctionUtil } from '../../utils/DecayFunctionUtil';
import { UpdatePageUserLikeVote } from './requests/UpdatePageUserLikeVoteRequest';
import { PageUserLikeVoteService } from '../services/PageUserLikeVoteService';
import { USER_EXP_STATEMENT, CONTENT_TYPE } from '../../LogsStatus';
import { UserExpStatementService } from '../services/UserExpStatementService';
import { UserExpStatement } from '../models/UserExpStatement';

@JsonController('/vote')
export class VoteController {

    constructor(private voteService: VoteService, private puLikeVoteService: PageUserLikeVoteService, private userExpStmtService: UserExpStatementService) {
    }
    
    // Vote API
    // Find API
    /**
     * @api {get} /api/vote/:id Find API
     * @apiGroup Vote
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Find Vote Successfully",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/vote/:id
     * @apiErrorExample {json} vote error
     * HTTP/1.1 500 Internal Server Error
     */

    @Get('/:id')
    public async find(@Param('id') voteid: number, @QueryParam('user_like') userLikeId: number, @Res() response: any): Promise<any> {
        try {
            const vote: any = await this.voteService.findId(voteid, userLikeId);
            if (userLikeId !== undefined && userLikeId !== null) {
                const pageUserLikeVote = await this.puLikeVoteService.findOne({
                    where: { userId: userLikeId, voteId: voteid }
                });
                if (pageUserLikeVote) {
                    vote.isUserLike = pageUserLikeVote.isLike;
                }
            }
            if (vote) {
                vote.vote = this.voteService.cleanUserField(vote.vote); 
                return response.status(200).send(ResponceUtil.getSucessResponce('Successfully Got Vote', vote));
            } else {
                return response.status(400).send(ResponceUtil.getErrorResponce('Unable to find Vote', undefined));
            }
        } catch (error) {
            return response.status(400).send(error);
        }
    }

    // Vote API
    // Hot API
    /**
     * @api {get} /api/vote/search/hot Hot API
     * @apiGroup Vote
     * @apiHeader {String} Authorization
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "FindHot Vote Successfully",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/vote/search/hot
     * @apiErrorExample {json} vote error
     * HTTP/1.1 500 Internal Server Error
     */

    @Get('/search/hot')
    public async findHot(@QueryParam('room_id') roomId: number, @QueryParam('limit') limit: number, @Res() response: any): Promise<any> {
        try {
            const range = DecayFunctionUtil.getBeforeTodayRange(30);
            const startDate = range[0];
            const endDate = range[1];

            const data: any = await this.voteService.findHot(startDate, endDate, roomId, limit);

            return response.status(200).send(ResponceUtil.getSucessResponce('success', data));
        } catch (error) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', error));
        }
    }

    // Vote API
    // CommentCount API
    /**
     * @api {get} /api/vote/:id/count CommentCount API
     * @apiGroup Vote
     * @apiHeader {String} Authorization
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "CommentCount Vote Successfully",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/vote/:id/count
     * @apiErrorExample {json} vote error
     * HTTP/1.1 500 Internal Server Error
     */

    @Get('/:id/count')
    @Authorized('customer')
    public async findCommentCountById(@Param('id') id: number, @Res() response: any): Promise<any> {
        try {
            const data: any = await this.voteService.findCommentCountById(id);

            return response.status(200).send(ResponceUtil.getSucessResponce('success', data));
        } catch (error) {
            return response.status(400).send(ResponceUtil.getErrorResponce(undefined, error));
        }
    }

    // Vote API
    // Search API
    /**
     * @api {post} /api/vote/search Search API
     * @apiGroup Vote
     * @apiParam (Request body) {number} limit limit
     * @apiParam (Request body) {number} offset offset
     * @apiParam (Request body) {String} select select
     * @apiParam (Request body) {String} relation relation
     * @apiParam (Request body) {String} whereConditions whereConditions
     * @apiParam (Request body) {boolean} isCount isCount (0=false, 1=true)
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Search Vote Successfully",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/vote/search
     * @apiErrorExample {json} vote error
     * HTTP/1.1 500 Internal Server Error
     */

    @Post('/search')
    public async search(@Body() filter: SearchFilter, @Req() request: any, @Res() response: any): Promise<any> {
        if (filter === null || filter === undefined) {
            filter = new SearchFilter();
        }

        // search only active true
        if (filter.whereConditions !== undefined) {
            if (Array.isArray(filter.whereConditions)) {
                for (const condition of filter.whereConditions) {
                    condition.isActive = true;
                }
            } else {
                if (typeof filter.whereConditions !== 'string') {
                    filter.whereConditions.isActive = true;
                }
            }
        } else {
            filter.whereConditions = [{
                isActive: true
            }];
        }

        try {
            const votes: any[] = await this.voteService.search(filter);

            if (votes !== null && votes !== undefined) {
                return response.status(200).send(ResponceUtil.getSucessResponce('success', votes));
            } else {
                return response.status(400).send(ResponceUtil.getErrorResponce('error', 'can not search'));
            }
        } catch (error) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', error));
        }
    }

    // Vote API
    // Like API
    /**
     * @api {post} /api/vote/:id/like Like API
     * @apiGroup Vote
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {boolean} isLike Like
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Like Vote Successfully",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/vote/:id/like
     * @apiErrorExample {json} vote error
     * HTTP/1.1 500 Internal Server Error
     */

    @Post('/:id/like')
    @Authorized('customer')
    public async like(@Body({ validate: true }) param: UpdatePageUserLikeVote, @Param('id') id: number, @Res() response: any, @Req() request: any): Promise<any> {
        if (id === null || id === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', 'Id is null'));
        }

        const user_id = request.user.id;
        const like: any = (param.isLike === 'true');

        try {
            // console.log('like',like);
            const vote = await this.voteService.likeVote(user_id, id, like);

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
        } catch (error) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', error));
        }
    }

    // Vote API
    // Delete Like API
    /**
     * @api {delete} /api/vote/:id/like Delete Like API
     * @apiGroup Vote
     * @apiHeader {String} Authorization
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Like Vote Successfully",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/vote/:id/like
     * @apiErrorExample {json} vote error
     * HTTP/1.1 500 Internal Server Error
     */

    @Delete('/:id/like')
    @Authorized('customer')
    public async deleteLike(@Param('id') id: number, @Res() response: any, @Req() request: any): Promise<any> {
        if (id === null || id === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', 'Id is null'));
        }

        const userId = request.user.id;

        try {
            const vote = await this.voteService.deleteLikeVote(userId, id, true);

            if (vote !== null && vote !== undefined) {
                return response.status(200).send(ResponceUtil.getSucessResponce('success', vote));
            } else {
                return response.status(400).send(ResponceUtil.getErrorResponce('error', 'can not delete like'));
            }
        } catch (error) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', error));
        }
    }
}
