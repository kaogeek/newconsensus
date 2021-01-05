/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import 'reflect-metadata';
import {
    Post, Body, JsonController, Res, Get, Authorized, Put, Param, Req, Delete, QueryParam
} from 'routing-controllers';
import { IsNull, Not } from 'typeorm';
import { UpdateProposal } from './requests/UpdateProposalRequest';
import { ProposalService } from '../services/ProposalService';
import { RoomService } from '../services/RoomService';
import { PageUserService } from '../services/PageUserService';
import { ProposalSupporterService } from '../services/ProposalSupporterService';
import { ProposalHasDebateService } from '../services/ProposalHasDebateService';
import { DebateService } from '../services/DebateService';
import { Proposal } from '../models/Proposal';
import { ProposalLogs } from '../models/ProposalLogs';
import { SearchFilter } from './requests/SearchFilterRequest';
import { ResponceUtil } from '../../utils/ResponceUtil';
import { DecayFunctionUtil } from '../../utils/DecayFunctionUtil';
import { UpdatePageUserLikeProposal } from './requests/UpdatePageUserLikeProposal';
import { BadWordService } from '../services/BadWordService';
import { ConfigService } from '../services/ConfigService';
import { PROPOSAL_HOT_CONFIG_NAME, PROPOSAL_CONFIG_NAME, DEFAULT_PROPOSAL_CONFIG } from '../../Constants';
import { PageUserLikeProposalService } from '../services/PageUserLikeProposalService';
import { UserService } from '../services/UserService';
import { ProposalLogService } from '../services/ProposalLogService';
import moment = require('moment/moment');
import { UserExpStatementService } from '../services/UserExpStatementService';
import { CONTENT_TYPE, USER_EXP_STATEMENT } from '../../LogsStatus';
import { UserExpStatement } from '../models/UserExpStatement';

@JsonController('/proposal')
export class ProposalController {

    private DEFAULT_REQUEST_SUPPORTOR = 500;

    constructor(private proposalService: ProposalService,
        private roomService: RoomService, private debateService: DebateService,
        private pageUserService: PageUserService, private proposalHasDebateService: ProposalHasDebateService,
        private proposalSupporterService: ProposalSupporterService, private badWordService: BadWordService,
        private configService: ConfigService, private proposalLikeService: PageUserLikeProposalService,
        private userService: UserService, private proposalLogService: ProposalLogService,
        private userExpStmtService: UserExpStatementService) {
    }

    // Create Proposal API
    /**
     * @api {post} /api/proposal Create Proposal API
     * @apiGroup Proposal
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {number} roomId Room ID *
     * @apiParam (Request body) {string} title Proposal title *
     * @apiParam (Request body) {string} content Proposal Content *
     * @apiParam (Request body) {number} reqSupporter Proposal Request Suporter
     * @apiParam (Request body) {Date} endDate Date YYYY-MM-DD
     * @apiParam (Request body) {String[]} debateTag Debatetag [1,2,3,..]
     * @apiParamExample {json} Input
     * {
     *      "roomId" : "",
     *      "content" : "",
     *      "reqSupporter" : "",
     *      "approveUserId" : "",
     *      "approveDate" : "",
     *      "likeCount" : "",
     *      "dislikeCount" : "",
     *      "supporterCount" : "",
     *      "endDate" : "",
     * }
     * 
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "New Proposal is created successfully",
     *      "status": "1",
     *      "data": {
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
     * @apiSampleRequest /api/proposal
     * @apiErrorExample {json} Proposal error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/')
    @Authorized('customer')
    public async createProposalPage(@Body({ validate: true }) proposalParam: UpdateProposal, @Req() req: any, @Res() response: any): Promise<any> {

        const room = await this.roomService.findOne({

            where: {
                id: proposalParam.roomId,
            },
        });

        if (!room) {
            const errorRoomResponse: any = ResponceUtil.getErrorResponce('invalid room id', undefined);
            return response.status(400).send(errorRoomResponse);
        }

        let tag;
        try {
            if (proposalParam.debateTag !== null && proposalParam.debateTag !== undefined && proposalParam.debateTag.length > 0 && proposalParam.debateTag !== '') {
                tag = JSON.parse(proposalParam.debateTag);
            }

        } catch (error) {
            return response.status(400).send('farmat should be [1,2,3,..]', error);
        }

        if (proposalParam.reqSupporter === undefined || proposalParam.reqSupporter < 0) {
            proposalParam.reqSupporter = this.DEFAULT_REQUEST_SUPPORTOR;
        }

        let relateTags: string[] = [];

        if (proposalParam.relateTag !== undefined && proposalParam.relateTag.length > 0) {
            relateTags = proposalParam.relateTag;
        }

        const proposal = new Proposal();
        proposal.roomId = proposalParam.roomId;
        proposal.title = this.badWordService.clean(proposalParam.title);
        proposal.content = this.badWordService.clean(proposalParam.content);
        proposal.likeCount = 0;
        proposal.dislikeCount = 0;
        proposal.supporterCount = 0;
        proposal.reqSupporter = proposalParam.reqSupporter;
        proposal.endDate = proposalParam.endDate;
        proposal.videoUrl = proposalParam.videoUrl;
        proposal.imageUrl = proposalParam.imageUrl;
        proposal.createdBy = req.user.id;
        proposal.createdByUsername = req.user.username;

        const proposalSave = await this.proposalService.create(req.user, proposal, tag, relateTags);
        if (proposalSave !== undefined) {
            try {
                const user = await this.userService.findOne({
                    where: {
                        userId: req.user.id,
                    },
                });

                const proposalApproveAuto = await this.configService.getConfig(PROPOSAL_CONFIG_NAME.APPROVE_AUTO);

                const proposalApproveAutoUser = await this.configService.getConfig(PROPOSAL_CONFIG_NAME.APPROVE_AUTO_USER_ADMIN);

                let approveAuto: boolean = DEFAULT_PROPOSAL_CONFIG.APPROVE_AUTO;

                if (proposalApproveAuto && proposalApproveAuto.value) {
                    approveAuto = proposalApproveAuto.value === 'true';
                }

                let unameAdmin = undefined;
                if (proposalApproveAutoUser && proposalApproveAutoUser.value) {
                    unameAdmin = proposalApproveAutoUser.value;
                }
                let isAdmin = false;
                let admin = undefined;

                if (unameAdmin !== undefined) {
                    admin = await this.userService.findOne({
                        where: {
                            username: unameAdmin,
                            isActive: 1,
                            deleteFlag: 0
                        },
                    });

                    if (admin !== undefined) {
                        isAdmin = true;
                    }
                }

                if (approveAuto && isAdmin) {
                    proposalSave.approveUserId = admin.id;
                    proposalSave.approveUsername = admin.username;
                    proposalSave.approveDate = moment().toDate();

                    const proposalUpdate = await this.proposalService.update(req.user, proposal);

                    if (proposalUpdate) {
                        this.addLog(proposal.id, 'APPROVE', JSON.stringify(proposalUpdate), moment().toDate(), user.id);

                        // const successResponse: any = ResponceUtil.getSucessResponce('Successfully approve the proposal.', proposalUpdate);
                        return response.status(200).send(ResponceUtil.getSucessResponce('Successfully approve the proposal.', proposalUpdate));
                    }
                }

            } catch (error) {
                return response.status(400).send(ResponceUtil.getErrorResponce('error', error));
            }

            const successResponse: any = ResponceUtil.getSucessResponce('Successfully created a new proposal', proposalSave);
            return response.status(200).send(successResponse);
        } else {
            const errorResponse: any = ResponceUtil.getErrorResponce('unable to create proposal', proposalSave);
            return response.status(400).send(errorResponse);
        }
    }

    // Edit Proposal API
    /**
     * @api {put} /api/proposal/:id Edit Proposal API
     * @apiGroup Proposal
     * @apiParam (Request body) {number} roomId Room ID *
     * @apiParam (Request body) {string} title Proposal title *
     * @apiParam (Request body) {string} content Proposal content *
     * @apiParam (Request body) {number} reqSupporter Proposal Request Suporter
     * @apiParam (Request body) {string} endDate Date YYYY-MM-DD
     * @apiParam (Request body) {String[]} debateTag Debatetag
     * @apiHeader {String} Authorization
     * @apiParamExample {json} Input
     * {
     *      "roomId" : "",
     *      "title" : "",
     *      "content" : "",
     *      "reqSupporter" : "",
     *      "approveUserId" : "",
     *      "approveDate" : "",
     *      "likeCount" : "",
     *      "dislikeCount" : "",
     *      "supporterCount" : "",
     *      "endDate" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Proposal is updated successfully",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/proposal/:id
     * @apiErrorExample {json} updateProposal error
     * HTTP/1.1 500 Internal Server Error
     */
    @Put('/:id')
    @Authorized('customer')
    public async editProposalPage(@Param('id') idParam: number, @Body({ validate: true }) proposalParam: UpdateProposal, @Req() request: any, @Res() response: any): Promise<any> {
        const room = await this.roomService.findOne({

            where: {
                id: proposalParam.roomId,
            },
        });

        if (!room) {
            const errorResponse: any = ResponceUtil.getErrorResponce('invalid room id', undefined);
            return response.status(400).send(errorResponse);
        }

        const proposal = await this.proposalService.findOne({

            where: {
                id: idParam,
            },
        });

        if (!proposal) {
            const errorResponse: any = ResponceUtil.getErrorResponce('invalid proposal id', undefined);
            return response.status(400).send(errorResponse);
        }

        if (proposalParam.reqSupporter === undefined || proposalParam.reqSupporter < 0) {
            proposalParam.reqSupporter = this.DEFAULT_REQUEST_SUPPORTOR;
        }

        proposal.roomId = proposalParam.roomId;
        proposal.title = this.badWordService.clean(proposalParam.title);
        proposal.content = this.badWordService.clean(proposalParam.content);
        proposal.reqSupporter = proposalParam.reqSupporter;
        proposal.endDate = proposalParam.endDate;
        proposal.videoUrl = proposalParam.videoUrl;
        proposal.imageUrl = proposalParam.imageUrl;
        let tag = [];

        let relateTags: string[] = [];

        if (proposalParam.relateTag !== undefined && proposalParam.relateTag.length > 0) {
            relateTags = proposalParam.relateTag;
        }

        try {
            if (proposalParam.debateTag !== null && proposalParam.debateTag !== undefined && proposalParam.debateTag.length > 0 && proposalParam.debateTag !== '') {
                tag = JSON.parse(proposalParam.debateTag);
            }
        } catch (error) {
            return response.status(400).send('farmat should be [1,2,3,..]', error);
        }

        proposal.modifiedBy = request.user.id;
        proposal.modifiedByUsername = request.user.username;

        const proposalUpdate = await this.proposalService.update(request.user, proposal, tag, relateTags);

        if (proposalUpdate) {
            const successResponse: any = ResponceUtil.getSucessResponce('Successfully updated the proposal.', proposalUpdate);
            return response.status(200).send(successResponse);
        } else {
            const errorResponse: any = ResponceUtil.getSucessResponce('Invalid updated the proposal.', proposalUpdate);
            return response.status(400).send(errorResponse);
        }
    }

    // Get Proposal Find API
    /**
     * @api {get} /api/proposal/:id proposal Find API
     * @apiGroup Proposal
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     * "message": "Successfully get proposal Find",
     * "data":{
     * "name" : "",
     * "description" : "",
     * }
     * "status": "1"
     * }
     * @apiSampleRequest /api/proposal/:id
     * @apiErrorExample {json} proposal error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/:id')
    public async pageProposalFind(@Param('id') id: number, @QueryParam('user_like') userLikeId: number, @Res() response: any): Promise<any> {
        const condition = {
            where: {
                id
            },
            join: {
                alias: 'proposal',
                leftJoinAndSelect: {
                    pageuser: 'proposal.pageUser'
                }
            }
        };
        let proposal = await this.proposalService.findOne(condition);

        // search debate list
        const debateIdList = await this.proposalHasDebateService.findAll({
            proposalId: id
        });

        let debateList = [];
        if (debateIdList !== undefined && debateIdList.length > 0) {
            const debateCondition = {
                select: ['id', 'title'],
                where: []
            };
            for (const hasDebate of debateIdList) {
                debateCondition.where.push({
                    id: hasDebate.debateId
                });
            }
            debateList = await this.debateService.findAll(debateCondition);
        }

        proposal.debates = debateList;

        // search userIsLike
        if (userLikeId !== undefined && userLikeId !== null) {
            const pageUserLikeProposal = await this.proposalLikeService.findOne({
                where: { userId: userLikeId, proposalId: id }
            });
            if (pageUserLikeProposal) {
                proposal.isUserLike = pageUserLikeProposal.isLike;
            }
        }

        if (proposal) {
            proposal = this.proposalService.cleanPageUserField(proposal);
            const successResponse: any = ResponceUtil.getSucessResponce('Successfully get proposal Find.', proposal);
            return response.status(200).send(successResponse);
        } else {
            const errorResponse: any = ResponceUtil.getErrorResponce('Error get proposal Find.', proposal);
            return response.status(400).send(errorResponse);
        }
    }

    // Proposal Search API
    /**
     * @api {Post} /api/proposal/search Proposal Search API
     * @apiGroup Proposal
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
     *              "title" : "",
     *              "content" : "",
     *              "approveUserId" : "",
     *              "approveDate" : "",
     *              "likeCount" : "",
     *              "dislikeCount" : "",
     *              "supporterCount" : "",
     *              "endDate" : "",
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/proposal/search
     * @apiErrorExample {json} Page error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/search')
    public async propalList(@Body({ validate: true }) searchFilter: SearchFilter, @QueryParam('show_user') showUser: boolean, @QueryParam('show_comment') showComment: boolean,
        @QueryParam('approve_mode') approveMode: string, @QueryParam('show_debate') showDebate: boolean, @Res() response: any): Promise<any> {
        let searchOnlyApprove = true;
        // approve mode undefined will be approve searching
        if (approveMode) {
            if (approveMode.toLocaleLowerCase() === 'all') {
                searchOnlyApprove = undefined;
            } else if (approveMode.toLocaleLowerCase() === 'unapprove') {
                searchOnlyApprove = false;
            }
        }

        if (searchOnlyApprove !== undefined) {
            // search only approve proposal
            if (searchFilter.whereConditions !== undefined) {
                if (Array.isArray(searchFilter.whereConditions)) {
                    for (const condition of searchFilter.whereConditions) {
                        if (searchOnlyApprove) {
                            condition.approveUserId = Not(IsNull());
                        } else {
                            condition.approveUserId = IsNull();
                        }
                    }
                } else {
                    if (typeof searchFilter.whereConditions !== 'string') {
                        if (searchOnlyApprove) {
                            searchFilter.whereConditions.approveUserId = Not(IsNull());
                        } else {
                            searchFilter.whereConditions.approveUserId = IsNull();
                        }
                    }
                }
            } else {
                searchFilter.whereConditions = [{
                    approveUserId: searchOnlyApprove ? Not(IsNull()) : IsNull()
                }];
            }
        }

        const poposalList = await this.proposalService.searchMoreRelation(searchFilter, showComment, showUser, showDebate);
        if (poposalList) {
            const successRes: any = ResponceUtil.getSucessResponce('Successfully get proposal list.', poposalList);
            return response.status(200).send(successRes);
        } else {
            const errorResponse: any = ResponceUtil.getErrorResponce('Error get proposal list.', undefined);
            return response.status(400).send(errorResponse);
        }
    }

    // Proposal Like API
    /**
     * @api {post} /api/proposal/:id/like Like Proposal API
     * @apiGroup Proposal
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
     * @apiSampleRequest /api/proposal/:id/like
     * @apiErrorExample {json} Proposal Like error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/:id/like')
    @Authorized('customer')
    public async likeProposalPage(@Body({ validate: true }) param: UpdatePageUserLikeProposal, @Param('id') id: number, @Req() req: any, @Res() response: any): Promise<any> {

        if (id === null || id === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('undefined id', undefined));
        }

        if (param.isLike === null || param.isLike === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('undefined isLike', undefined));
        } 

        const like: any = (param.isLike === 'true');
        const user_id: any = req.user.id;

        try {
            const proposal = await this.proposalService.likeProposal(req.user, id, like);

            if (proposal !== null && proposal !== undefined) { 
                const userExp = await this.userExpStmtService.findOne({
                    where: [
                        {
                            contentId: proposal.id,
                            userId: user_id,
                            action: USER_EXP_STATEMENT.LIKE,
                            isFirst: true
                        },
                        {
                            contentId: proposal.id,
                            userId: user_id,
                            action: USER_EXP_STATEMENT.DISLIKE,
                            isFirst: true
                        },
                        {
                            contentId: proposal.id,
                            userId: user_id,
                            action: USER_EXP_STATEMENT.UNLIKE,
                            isFirst: true
                        },
                        {
                            contentId: proposal.id,
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
                    if (param.isLike !== 'true') {
                        userExpStmt.action = USER_EXP_STATEMENT.DISLIKE;
                    } else { 
                        userExpStmt.action = USER_EXP_STATEMENT.LIKE;
                    } 
                    userExpStmt.contentId = proposal.id.toString();
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
                    return response.status(200).send(ResponceUtil.getSucessResponce('success', proposal));
                }
            } else {
                return response.status(400).send(ResponceUtil.getErrorResponce('error', 'can not like'));
            }
        } catch (error) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', error));
        }
    }

    // Proposal Delete Like API
    /**
     * @api {Delete} /api/proposal/:id/like Delete Like Proposal API
     * @apiGroup Proposal
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
     * @apiSampleRequest /api/proposal/:id/like
     * @apiErrorExample {json} Proposal Like error
     * HTTP/1.1 500 Internal Server Error
     */
    @Delete('/:id/like')
    @Authorized('customer')
    public async deleteLikeProposalPage(@Param('id') id: number, @Req() req: any, @Res() response: any): Promise<any> {

        if (id === null || id === undefined) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
        }

        const user = req.user;
        const removeLike = await this.proposalService.deleteLikeProposal(user, id, true);

        if (removeLike) {
            const userExp = await this.userExpStmtService.findOne({
                where: {
                    contentId: removeLike.id,
                    userId: removeLike.createdBy,
                    action: USER_EXP_STATEMENT.DISLIKE,
                    isFirst: true
                }
            });
            const userExpStmt = new UserExpStatement();
            userExpStmt.contentType = CONTENT_TYPE.PROPOSAL;
            if (userExp === undefined) {
                userExpStmt.action = USER_EXP_STATEMENT.DISLIKE;
                userExpStmt.contentId = removeLike.id.toString();
                userExpStmt.userId = removeLike.createdBy.toString();
            } else {
                userExpStmt.action = USER_EXP_STATEMENT.DISLIKE;
                userExpStmt.contentId = userExp.contentId;
                userExpStmt.userId = userExp.userId;
                userExpStmt.isFirst = userExp.isFirst;
            }
            const dataUser = await this.userExpStmtService.createUserLikeDisLike(userExpStmt);
            const dataUserExpStmt = await this.userExpStmtService.create(dataUser);
            if (dataUserExpStmt) {
                return response.status(200).send(ResponceUtil.getSucessResponce('success', removeLike));
            }
        } else {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
        }
    }

    // Get Proposal HotTopic API
    /**
     * @api {get} /api/proposal/hot Proposal HotTopic API
     * @apiGroup Proposal
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully get proposal hottopic",
     *         "data":{
     *              "id" : "",
     *              "roomId" : "",
     *              "title" : "",
     *              "content" : "",
     *              "approveUserId" : "",
     *              "approveDate" : "",
     *              "likeCount" : "",
     *              "dislikeCount" : "",
     *              "supporterCount" : "",
     *              "endDate" : "",
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/proposal/hot
     * @apiErrorExample {json} Page error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/search/hot')
    public async proposalHotTopic(@QueryParam('room_id') roomId: number, @QueryParam('offset') offset: number, @QueryParam('limit') limit: number, @QueryParam('count') count: boolean, @Res() response: any): Promise<any> {
        try {
            const proposalRangeConfig = await this.configService.getConfig(PROPOSAL_HOT_CONFIG_NAME.DAY_RANGE);
            let proposalRange = 30;
            if (proposalRangeConfig && proposalRangeConfig.value) {
                proposalRange = parseFloat(proposalRangeConfig.value);
            }
            const range = DecayFunctionUtil.getBeforeTodayRange(proposalRange);
            const startDate = range[0];
            const endDate = range[1];

            const data: any = await this.proposalService.findHot(startDate, endDate, roomId, limit, true, offset, count);

            return response.status(200).send(ResponceUtil.getSucessResponce('success', data));
        } catch (error) {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', error));
        }
    }

    // Get Proposal Comment Count API
    /**
     * @api {get} /api/proposal/:id/count proposal count comment API
     * @apiGroup Proposal
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *       "status": "1",
     *      "message": "Successfully get proposal comment count",
     *         "data":
     * }
     * @apiSampleRequest /api/proposal/:id/count
     * @apiErrorExample {json} proposal count comment error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/:id/count')
    public async proposalCommentCount(@Param('id') id: number, @Res() response: any): Promise<any> {

        const proposal = await this.proposalService.findOne({

            where: {
                id,
            },
        });

        if (!proposal) {
            const errorResponse: any = ResponceUtil.getErrorResponce('invalid proposalComment id', undefined);
            return response.status(400).send(errorResponse);
        }

        const commentCount = await this.proposalService.findCommentCountById(id);
        return response.status(200).send(ResponceUtil.getSucessResponce('Successfully get proposal comment count.', commentCount));
    }

    // Proposal Proposal Supporter API
    /**
     * @api {post} /api/proposal/:id/support Proposal Spupporter API
     * @apiGroup Proposal
     * @apiHeader {String} Authorization
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
     * @apiSampleRequest /api/proposal/:id/support
     * @apiErrorExample {json} Proposal Like error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/:id/support')
    @Authorized('customer')
    public async supportProposal(@Param('id') id: number, @Req() req: any, @Res() response: any): Promise<any> {

        const user = await this.pageUserService.findOne(req.user.id);
        if (!user) {
            return response.status(400).send(ResponceUtil.getErrorResponce('user invalid.', undefined));
        }

        const user_id: any = user.id;
        const proposal = await this.proposalService.findOne({
            where: {
                id,
            },
        });

        if (!proposal) {
            const errorResponse: any = ResponceUtil.getErrorResponce('invalid proposal id', undefined);
            return response.status(400).send(errorResponse);
        }

        const proposalSupportUpdate = await this.proposalService.updateUserSupportProposal(user, proposal);

        if (proposalSupportUpdate !== undefined && proposalSupportUpdate !== null) {
            const userExp = await this.userExpStmtService.findOne({
                where: [
                    {
                        contentId: proposal.id,
                        userId: user_id,
                        action: USER_EXP_STATEMENT.SUPPORT,
                        isFirst: true
                    },
                    {
                        contentId: proposal.id,
                        userId: user_id,
                        action: USER_EXP_STATEMENT.UNSUPPORT,
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
                userExpStmt.action = USER_EXP_STATEMENT.SUPPORT;
                userExpStmt.contentId = proposal.id.toString();
                userExpStmt.userId = user_id.toString();
            } else {
                userExpStmt.contentId = userExp.contentId;
                userExpStmt.userId = userExp.userId;
                userExpStmt.isFirst = userExp.isFirst;
                if (userExp.action === USER_EXP_STATEMENT.UNSUPPORT) {
                    userExpStmt.action = USER_EXP_STATEMENT.SUPPORT;
                } else if (userExp.action === USER_EXP_STATEMENT.SUPPORT) {
                    userExpStmt.action = USER_EXP_STATEMENT.UNSUPPORT;
                }
            }

            const dataUser = await this.userExpStmtService.createUserSupport(userExpStmt, proposal.reqSupporter, proposalSupportUpdate.supporterCount);
            const dataUserExpStmt = this.userExpStmtService.create(dataUser);
            if (dataUserExpStmt) {
                return response.status(200).send(ResponceUtil.getSucessResponce('success', proposalSupportUpdate));
            }
        } else {
            return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
        }

    }

    @Get('/:id/support')
    @Authorized('customer')
    public async getSupportProposal(@Param('id') id: number, @Req() req: any, @Res() response: any): Promise<any> {

        const user = await this.pageUserService.findOne(req.user.id);
        if (!user) {
            return response.status(400).send(ResponceUtil.getErrorResponce('user invalid.', undefined));
        }

        const proposal = await this.proposalService.findOne({
            where: {
                id,
            },
        });

        if (!proposal) {
            const errorResponse: any = ResponceUtil.getErrorResponce('invalid proposal id', undefined);
            return response.status(400).send(errorResponse);
        }

        const proposalSupport = await this.proposalSupporterService.findOne({
            proposalId: id,
            userId: req.user.id
        });

        if (proposalSupport !== undefined && proposalSupport !== null) {
            return response.status(200).send(ResponceUtil.getSucessResponce('success', proposalSupport));
        } else {
            return response.status(400).send(ResponceUtil.getErrorResponce('Proposal Support Was not found', undefined));
        }
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
