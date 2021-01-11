/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import 'reflect-metadata';
import { Post, Get, Put, Delete, Param, QueryParam, Body, JsonController, Authorized, Res, Req } from 'routing-controllers';
import { Debate } from '../models/Debate';
import { SearchFilter } from './requests/SearchFilterRequest';
import { CreateDebate } from './requests/CreateDebateRequest';
import { UpdateDebate } from './requests/UpdateDebateRequest';
import { DebateService } from '../services/DebateService';
import { ResponceUtil } from '../../utils/ResponceUtil';
import { DecayFunctionUtil } from '../../utils/DecayFunctionUtil';
import { UpdatePageUserLikeDebate } from './requests/UpdatePageUserLikeDebateRequest';
import { DebateLogsService } from '../services/DebateLogsService';
import { DebateLogs } from '../models/DebateLogs';
import { DEBATE_LOG_ACTION, USER_EXP_STATEMENT, CONTENT_TYPE } from '../../LogsStatus';
import { BadWordService } from '../services/BadWordService';
import { ConfigService } from '../services/ConfigService';
import { DEBATE_HOT_CONFIG_NAME } from '../../Constants';
import { PageUserLikeDebateService } from '../services/PageUserLikeDebateService';
import { UserExpStatement } from '../models/UserExpStatement';
import { UserExpStatementService } from '../services/UserExpStatementService';

@JsonController('/debate')
export class DebateController {
    constructor(private debateService: DebateService, private debateLogsService: DebateLogsService,
        private puLikeDbService: PageUserLikeDebateService,
        private badWordService: BadWordService, 
        private configService: ConfigService,
        private userExpStmtService: UserExpStatementService) {
    }

    // Debate API
    // Find Debate API
    /**
     * @api {get} /api/debate/:id Find Debate
     * @apiGroup Debate
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Find Debate Successfully",
     *      "data":{
     *      "id" : "",
     *      "title" : "",
     *      "content" : "",
     *      "likeCount" : "",
     *      "dislikeCount" : "",
     *      "createdBy" : "",
     *      "createdDate" : "",
     *      "createdTime" : "",
     *      "modifiedDate" : "",
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/debate/:id
     * @apiErrorExample {json} debate error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/:id')
    public async findDebate(@Param('id') dbId: number, @QueryParam('user_like') userLikeId: number, @Res() response: any): Promise<any> {
        try {
            let debate = await this.debateService.findOne({
                where: { id: dbId },
                join: {
                    alias: 'debate',
                    leftJoinAndSelect: {
                        pageuser: 'debate.pageUser'
                    }
                }
            });
            
            if (userLikeId !== undefined && userLikeId !== null) {
                const pageUserLikeDebate = await this.puLikeDbService.findOne({
                    where: { userId: userLikeId, debateId: dbId }
                });
                if (pageUserLikeDebate) {
                    debate.isUserLike = pageUserLikeDebate.isLike;
                }
            }

            if (debate) {
                debate = this.debateService.cleanPageUserField(debate);
                return response.status(200).send(ResponceUtil.getSucessResponce('Successfully Got Debate', debate));
            } else {
                return response.status(400).send(ResponceUtil.getErrorResponce('Unable to find Debate', undefined));
            }
        } catch (error) {
            return response.status(400).send(error);
        }
    }

    // Find Hot Debate API
    /**
     * @api {get} /api/debate/search/hot Hot Debate
     * @apiGroup Debate
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Find Hot Debate Successfully",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/debate/search/hot
     * @apiErrorExample {json} debate error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/search/hot')
    public async findHotDebate(@QueryParam('offset') offset: number, @QueryParam('limit') limit: number, @QueryParam('count') count: boolean, @Res() response: any): Promise<any> {
        try {
            const debateRangeConfig = await this.configService.getConfig(DEBATE_HOT_CONFIG_NAME.DAY_RANGE);
            let debateRange = 30;
            if (debateRangeConfig && debateRangeConfig.value) {
                debateRange = parseFloat(debateRangeConfig.value);
            }
            const range = DecayFunctionUtil.getBeforeTodayRange(debateRange);
            const startDate = range[0];
            const endDate = range[1];

            const debate: any = await this.debateService.findHot(startDate, endDate, limit, offset, count);

            return response.status(200).send(ResponceUtil.getSucessResponce('Successfully Got Hot Debate', debate));
        } catch (error) {
            return response.status(400).send(error);
        }
    }

    // Debate Comment Count API
    /**
     * @api {get} /api/debate/:id/count Count Debate Comment
     * @apiGroup Debate
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Debate Comment Count Successfully",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/debate/:id/count
     * @apiErrorExample {json} debate error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/:id/count')
    public async findCommentCountById(@Param('id') id: number, @Res() response: any): Promise<any> {
        try {
            const debateCount: any = await this.debateService.findCommentCountById(id);

            return response.status(200).send(ResponceUtil.getSucessResponce('Successfully Count Debate Comment', debateCount));
        } catch (error) {
            return response.status(400).send(error);
        }
    }

    // Search Debate API
    /**
     * @api {post} /api/debate/search Search Debate
     * @apiGroup Debate
     * @apiParam (Request body) {number} limit limit
     * @apiParam (Request body) {number} offset offset
     * @apiParam (Request body) {String} select select
     * @apiParam (Request body) {String} relation relation
     * @apiParam (Request body) {String} whereConditions whereConditions
     * @apiParam (Request body) {boolean} count count (0=false, 1=true)
     * @apiParamExample {json} Input
     * {
     *      "id" : "",
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
     * @apiSampleRequest /api/debate/search
     * @apiErrorExample {json} Debate error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/search')
    public async searchDebate(@Body() filter: SearchFilter, @QueryParam('show_user') showUser: boolean, @QueryParam('show_comment') showComment: boolean, @Res() response: any): Promise<any> {
        try {
            const debate: any = await this.debateService.searchMoreRelation(filter, showComment, showUser);

            return response.status(200).send(ResponceUtil.getSucessResponce('Successfully Search Debate', debate));
        } catch (error) {
            return response.status(400).send(error);
        }
    }

    // Create Debate API
    /**
     * @api {post} /api/debate Add Debate
     * @apiGroup Debate
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {String} title title
     * @apiParam (Request body) {String} content content
     * @apiParamExample {json} Input
     * {
     *      "title" : "",
     *      "content" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "New Debate is created successfully",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/debate
     * @apiErrorExample {json} Debate error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/')
    @Authorized('customer')
    public async createDebate(@Body({ validate: true }) debateParam: CreateDebate, @Req() req: any, @Res() response: any): Promise<any> {
        try {
            const debate = new Debate();
            debate.title = this.badWordService.clean(debateParam.title);
            debate.content = this.badWordService.clean(debateParam.content);
            debate.likeCount = 0;
            debate.dislikeCount = 0;
            debate.createdBy = req.user.id;
            debate.createdByUsername = req.user.username;

            let relateTags: string[] = [];

            if(debateParam.relateTag !== undefined && debateParam.relateTag.length > 0) {
                relateTags = debateParam.relateTag;
            }

            const debateCreated = await this.debateService.create(debate, relateTags, req.user);

            if (debateCreated) {
                const debateLogs = new DebateLogs();
                debateLogs.userId = req.user.id;
                debateLogs.action = DEBATE_LOG_ACTION.CREATE;
                debateLogs.detail = JSON.stringify(debateCreated);

                const debateLogsCreated = await this.debateLogsService.create(debateLogs);

                if (debateLogsCreated) {
                    return response.status(200).send(ResponceUtil.getSucessResponce('Create Debate Successful', debateCreated));
                }
            } else {
                return response.status(400).send(ResponceUtil.getErrorResponce('Unable to Create Debate', undefined));
            }
        } catch (error) {
            return response.status(400).send(error);
        }
    }

    // Like Debate API
    /**
     * @api {post} /api/debate/:id/like Like Debate
     * @apiGroup Debate
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {boolean} isLike isLike
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Like Debate Successfully",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/debate/:id/like
     * @apiErrorExample {json} Debate error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/:id/like')
    @Authorized('customer')
    public async likeDebate(@Param('id') id: number, @Body({ validate: true }) param: UpdatePageUserLikeDebate, @Res() response: any, @Req() req: any): Promise<any> {
        try {
            if (id === null || id === undefined) {
                return response.status(400).send(ResponceUtil.getErrorResponce('error', 'Id is null'));
            }

            const user_id = req.user.id;

            const like: boolean = (param.isLike === 'true');

            const debate = await this.debateService.likeDebate(user_id, id, like);
            if(debate !== null && debate !== undefined){
                let dataAction: any;
                if (param.isLike !== 'true') {
                    dataAction = USER_EXP_STATEMENT.DISLIKE;
                } else {
                    dataAction = USER_EXP_STATEMENT.LIKE;
                }
                const userExp = await this.userExpStmtService.findOne({
                    // where: {
                    //     contentId: debate.id,
                    //     userId: debate.createdBy,
                    //     action: dataAction,
                    //     isFirst: true
                    // }
                    where: [
                        {
                            contentId: debate.id,
                            userId: user_id,
                            action: USER_EXP_STATEMENT.LIKE,
                            isFirst: true
                        },
                        {
                            contentId: debate.id,
                            userId: user_id,
                            action: USER_EXP_STATEMENT.DISLIKE,
                            isFirst: true
                        },
                        {
                            contentId: debate.id,
                            userId: user_id,
                            action: USER_EXP_STATEMENT.UNLIKE,
                            isFirst: true
                        },
                        {
                            contentId: debate.id,
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
                    if (dataAction === USER_EXP_STATEMENT.LIKE) {
                        userExpStmt.action = USER_EXP_STATEMENT.LIKE;
                    } else {
                        userExpStmt.action = USER_EXP_STATEMENT.DISLIKE;
                    }
                    userExpStmt.contentId = debate.id.toString();
                    userExpStmt.userId = user_id.toString();

                } else {
                    userExpStmt.contentId = userExp.contentId;
                    userExpStmt.userId = userExp.userId;
                    userExpStmt.isFirst = userExp.isFirst;
                    if (param.isLike !== 'true') {
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
                    return response.status(200).send(ResponceUtil.getSucessResponce('success', debate));
                }
            }
        } catch (error) {
            return response.status(400).send(error);
        }
    }

    // Update Debate API
    /**
     * @api {put} /api/debate/:id Update Debate
     * @apiGroup Debate
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {String} title Debate Title
     * @apiParam (Request body) {String} content Debate Content
     * @apiParamExample {json} Input
     * {
     *      "title" : "",
     *      "content" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully updated Debate.",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/debate/:id
     * @apiErrorExample {json} Debate error
     * HTTP/1.1 500 Internal Server Error
     */
    @Put('/:id')
    @Authorized('customer')
    public async updateDebate(@Body({ validate: true }) debate: UpdateDebate, @Param('id') debateId: number, @Res() response: any, @Req() req: any): Promise<any> {
        try {
            const debateUpdate = await this.debateService.findOne({
                where: {
                    id: debateId,
                },
            });

            if (!debateUpdate) {
                return response.status(400).send(ResponceUtil.getSucessResponce('Invalid Debate Id', debateUpdate));
            }

            if ((debateUpdate.createdBy !== null || debateUpdate.createdByUsername !== null) && (debateUpdate.createdBy !== undefined || debateUpdate.createdByUsername !== undefined) && (debateUpdate.createdBy === req.user.id || debateUpdate.createdByUsername === req.user.username)) {
                debateUpdate.title = this.badWordService.clean(debate.title);
                debateUpdate.content = this.badWordService.clean(debate.content);
                debateUpdate.modifiedBy = req.user.id;
                debateUpdate.modifiedByUsername = req.user.username;

                let relateTags: string[] = [];

                if(debate.relateTag !== undefined && debate.relateTag.length > 0) {
                    relateTags = debate.relateTag;
                }

                const debateSave = await this.debateService.update(debateId, debateUpdate, relateTags, req.user);

                if (debateSave) {
                    const debateLogs = new DebateLogs();
                    debateLogs.userId = req.user.id;
                    debateLogs.action = DEBATE_LOG_ACTION.EDIT;
                    debateLogs.detail = JSON.stringify(debateSave);

                    const debateLogsCreated = await this.debateLogsService.create(debateLogs);

                    if (debateLogsCreated) {
                        return response.status(200).send(ResponceUtil.getSucessResponce('Update Debate Successful', debateSave));
                    }
                } else {
                    return response.status(400).send(ResponceUtil.getErrorResponce('Cannot Update Debate', undefined));
                }
            }
        } catch (error) {
            return response.status(400).send(error);
        }
    }

    // Delete Like Debate API
    /**
     * @api {delete} /api/debate/:id/like Delete Like Debate
     * @apiGroup Debate
     * @apiHeader {String} Authorization
     * @apiParam {Boolean=true,false} deleteLike Delete Like
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Delete Like Debate Successfully",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/debate/:id/like
     * @apiErrorExample {json} debate error
     * HTTP/1.1 500 Internal Server Error
     */
    @Delete('/:id/like')
    @Authorized('customer')
    public async deleteLikeDebate(@Param('id') id: number, @Res() response: any, @Req() req: any): Promise<any> {
        try {
            if (id === null || id === undefined) {
                return response.status(400).send(ResponceUtil.getErrorResponce('Debate Id Not Found', undefined));
            }

            const userId = req.user.id;

            const debate = await this.debateService.deleteLikeDebate(userId, id, true);

            if (debate) {
                const debateLogs = new DebateLogs();
                debateLogs.userId = userId;
                debateLogs.action = DEBATE_LOG_ACTION.REMOVE_LIKE;
                debateLogs.detail = JSON.stringify(debate);

                const debateLogsCreated = await this.debateLogsService.create(debateLogs);

                if (debateLogsCreated) {
                    return response.status(200).send(ResponceUtil.getSucessResponce('success', debate));
                }
            } else {
                return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
            }
        } catch (error) {
            return response.status(400).send(error);
        }
    }
}
