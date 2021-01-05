/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import 'reflect-metadata';
import {
    Post, Body, JsonController, Res, Get, Authorized, Put, Param, Delete, Req, QueryParam
} from 'routing-controllers';
// import { IsNull, Not } from 'typeorm';
import { UpdateProposal as updateProposal } from '.././requests/UpdateProposalRequest';
import { ProposalService } from '../../services/ProposalService';
import { Proposal } from '../../models/Proposal';
import { ProposalLogs } from '../../models/ProposalLogs';
import { VoteService } from '../../services/VoteService';
import { SearchFilter } from '.././requests/SearchFilterRequest';
import { ResponceUtil } from '../../../utils/ResponceUtil';
import { UserService } from '../../services/UserService';
import { RoomService } from '../../services/RoomService';
import { ProposalLogService } from '../../services/ProposalLogService';
import { CreatePinProposal } from '../requests/CreatePinProposalRequest';
import moment = require('moment/moment');
import { UserExpStatement } from '../../models/UserExpStatement';
import { UserExpStatementService } from '../../services/UserExpStatementService';
// import { ConfigService } from '../../services/ConfigService';
// import { USER_EXP_VALUE_CONFIG_NAME } from '../../../Constants';
import { USER_EXP_STATEMENT, CONTENT_TYPE } from '../../../LogsStatus';

@JsonController('/admin/proposal')
export class AdminProposalController {

    private DEFAULT_REQUEST_SUPPORTOR = 500;

    constructor(private proposalService: ProposalService,
        private voteService: VoteService,
        private userService: UserService,
        private roomService: RoomService,
        private proposalLogService: ProposalLogService,
        private userExpStmtService: UserExpStatementService,
    ) {
    }

    // Admin Create Proposal API
    /**
     * @api {post} /api/admin/proposal Admin Create Proposal API
     * @apiGroup AdminProposal
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {number} roomId Room ID *
     * @apiParam (Request body) {string} title Proposal title *
     * @apiParam (Request body) {string} content Proposal Content *
     * @apiParam (Request body) {string} endDate Date YYYY-MM-DD
     * @apiParam (Request body) {string} debateTag Debatetag
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
     *      "endDate" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "New Proposal is created successfully",
     *      "status": "1"
     *      "data": {
     *              "roomId" : "",
     *              "title" : "",
     *              "content" : "",
     *              "reqSupporter" : "",
     *              "approveUserId" : "",
     *              "approveDate" : "",
     *              "likeCount" : "",
     *              "dislikeCount" : "",
     *              "endDate" : "",
     *      }
     * }
     * @apiSampleRequest /api/admin/proposal
     * @apiErrorExample {json} Proposal error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/')
    @Authorized()
    public async createProposalPage(@Body({ validate: true }) proposalParam: updateProposal, @Req() req: any, @Res() response: any): Promise<any> {

        const room = await this.roomService.findOne({

            where: {
                roomId: proposalParam.roomId,
            },
        });

        if (!room) {
            const errorResponse: any = ResponceUtil.getErrorResponce('invalid room id', undefined);
            return response.status(400).send(errorResponse);
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

        const proposal = new Proposal();
        proposal.roomId = proposalParam.roomId;
        proposal.title = proposalParam.title;
        proposal.content = proposalParam.content;
        proposal.likeCount = 0;
        proposal.dislikeCount = 0;
        proposal.supporterCount = 0;
        proposal.reqSupporter = proposalParam.reqSupporter;
        proposal.endDate = proposalParam.endDate;
        proposal.createdBy = req.user.id.toString();
        proposal.createdByUsername = req.user.username;

        const proposalSave = await this.proposalService.create(req.user, proposal, tag);
        if (proposalSave !== undefined) {
            const successResponse: any = ResponceUtil.getSucessResponce('Successfully created a new proposal', proposalSave);
            return response.status(200).send(successResponse);
        } else {
            const errorResponse: any = ResponceUtil.getErrorResponce('unable to create proposal', proposalSave);
            return response.status(400).send(errorResponse);
        }
    }

    // Admin Edit Proposal API
    /**
     * @api {put} /api/admin/proposal/:id Admin Edit Proposal API
     * @apiGroup AdminProposal
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {number} roomId Room ID *
     * @apiParam (Request body) {string} title Proposal title *
     * @apiParam (Request body) {string} content Proposal content *
     * @apiParam (Request body) {string} endDate Date YYYY-MM-DD
     * @apiParam (Request body) {string} debateTag Debatetag
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
     *      "endDate" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Proposal is updated successfully",
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
     *              "endDate" : "",
     *      }
     * }
     * @apiSampleRequest /api/admin/proposal/:id
     * @apiErrorExample {json} updateProposal error
     * HTTP/1.1 500 Internal Server Error
     */
    @Put('/:id')
    @Authorized()
    public async editProposalPage(@Param('id') id: number, @Body({ validate: true }) proposalParam: updateProposal, @Req() request: any, @Res() response: any): Promise<any> {

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
                id,
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
        proposal.title = proposalParam.title;
        proposal.content = proposalParam.content;
        proposal.reqSupporter = proposalParam.reqSupporter;
        proposal.endDate = proposalParam.endDate;

        let tag;

        try {
            if (proposalParam.debateTag !== null && proposalParam.debateTag !== undefined && proposalParam.debateTag.length > 0 && proposalParam.debateTag !== '') {
                tag = JSON.parse(proposalParam.debateTag);
            }

        } catch (error) {
            return response.status(400).send('farmat should be [1,2,3,..]', error);
        }

        proposal.modifiedBy = request.user.id.toString();
        proposal.modifiedByUsername = request.user.username;

        const proposalUpdate = await this.proposalService.update(request.user, proposal, tag);
        if (proposalUpdate) {
            const successResponse: any = ResponceUtil.getSucessResponce('Successfully updated the proposal.', proposalUpdate);
            return response.status(200).send(successResponse);

        } else {
            const errorResponse: any = ResponceUtil.getSucessResponce('Invalid updated the proposal.', proposalUpdate);
            return response.status(400).send(errorResponse);
        }
    }

    // Admin Delete Proposal API
    /**
     * @api {delete} /api/admin/proposal/:id Admin Delete Proposal
     * @apiGroup AdminProposal
     * @apiHeader {String} Authorization
     *  * @apiParamExample {json} Input
     * {
     *      "proposalId" : "",
     *      "roomId" : "",
     *      "title" : "",
     *      "content" : "",
     *      "reqSupporter" : "",
     *      "approveUserId" : "",
     *      "approveDate" : "",
     *      "likeCount" : "",
     *      "dislikeCount" : "",
     *      "endDate" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "User is deleted successfully",
     *       "status": "1"
     * }
     * @apiSampleRequest /api/admin/proposal/:id
     * @apiErrorExample {json} deleteProposal error
     * HTTP/1.1 500 Internal Server Error
     */
    @Delete('/:id')
    @Authorized()
    public async remove(@Param('id') id: number, @Req() request: any, @Res() response: any): Promise<any> {
        const proposal = await this.proposalService.findOne({
            where: {
                id,
            },
        });
        if (!proposal) {
            const errorResponse: any = ResponceUtil.getErrorResponce('Invalid proposal Id.', proposal);
            return response.status(400).send(errorResponse);
        }

        const filter = new SearchFilter();
        filter.whereConditions = [
            {
                proposalId: id
            }
        ];
        filter.count = false;

        // set vote that has proposal id to null
        const voteResult = await this.voteService.search(filter);
        if (voteResult !== undefined && voteResult.length > 0) {
            for (const vote of voteResult) {
                vote.proposalId = null;
                this.voteService.update(request.user, vote);
            }
        }

        const deletePage = await this.proposalService.delete(request.user, proposal.id);
        if (deletePage) {
            const successResponse: any = ResponceUtil.getSucessResponce('Successfully deleted the proposal.', deletePage);
            return response.status(200).send(successResponse);
        } else {
            const errorResponse: any = ResponceUtil.getErrorResponce('unable to delete proposal.', deletePage);
            return response.status(400).send(errorResponse);
        }
    }

    // Admin Get Proposal Find API
    /**
     * @api {get} /api/admin/proposal/:id Admin proposal Find API
     * @apiGroup AdminProposal
     * @apiHeader {String} Authorization
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
     * @apiSampleRequest /api/admin/proposal/:id
     * @apiErrorExample {json} proposal error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/:id')
    public async pageProposalFind(@Param('id') id: number, @Res() response: any): Promise<any> {

        const proposal = await this.proposalService.findOne(id);

        if (proposal) {
            const successResponse: any = ResponceUtil.getSucessResponce('proposalId.', proposal);
            return response.status(200).send(successResponse);
        } else {
            const errorResponse: any = ResponceUtil.getErrorResponce('errorResponse proposalId.', proposal);
            return response.status(400).send(errorResponse);
        }
    }

    // Admin Proposal Search API
    /**
     * @api {Post} /api/admin/proposal/search Admin Proposal Search API
     * @apiGroup AdminProposal
     * @apiHeader {String} Authorization
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
     *         "data":{
     *                  "id" : "",
     *                  "title" : "",
     *                  "title" : "",
     *                  "content" : "",
     *                  "approveUserId" : "",
     *                  "approveDate" : "",
     *                  "likeCount" : "",
     *                  "dislikeCount" : "",
     *                  "endDate" : "",
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/proposal/search
     * @apiErrorExample {json} Page error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/search')
    @Authorized()
    public async propalList(@Body({ validate: true }) searchFilter: SearchFilter, @Res() response: any): Promise<any> {
        // const poposalList = await this.proposalService.search(searchFilter.limit, searchFilter.offset, searchFilter.select, searchFilter.relation, searchFilter.whereConditions, searchFilter.orderBy, searchFilter.count);
        const poposalList = await this.proposalService.searchMoreRelation(searchFilter, true, false, false, false);
        if (poposalList) {
            const successRes: any = ResponceUtil.getSucessResponce('Successfully got poposal.', poposalList);
            return response.status(200).send(successRes);
        } else {
            const errorResponse: any = ResponceUtil.getErrorResponce('Error get proposal list.', undefined);
            return response.status(400).send(errorResponse);
        }
    }

    // Admin Approve Proposal API
    /**
     * @api {Put} /api/admin/proposal/:id/approve Admin Approve Proposal API
     * @apiGroup AdminProposal
     * @apiHeader {String} Authorization
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * { 
     *      "message": "Proposal is approve successfully",
     *       "status": "1"
     *        "data" : {
     *              "roomId" : "",
     *              "title" : "",
     *              "content" : "",
     *              "reqSupporter" : "",
     *              "approveUserId" : "",
     *              "approveDate" : "",
     *              "likeCount" : "",
     *              "dislikeCount" : "",
     *              "endDate" : "",
     *      }
     * }
     * @apiSampleRequest /api/admin/proposal/:id/approve
     * @apiErrorExample {json} approveProposal error
     * HTTP/1.1 500 Internal Server Error
     */
    @Put('/:id/approve')
    @Authorized()
    public async approveProposalPage(@Param('id') id: number, @Req() request: any, @Res() response: any): Promise<any> {

        const user = await this.userService.findOne({
            where: {
                userId: request.user.id,
            },
        });
        if (!user) {
            const errResponse: any = ResponceUtil.getErrorResponce('Invalid userId.', undefined);
            return response.status(400).send(errResponse);
        }

        const proposal = await this.proposalService.findOne({

            where: {
                id,
            },
        });

        if (!proposal) {
            const errorResponse: any = ResponceUtil.getErrorResponce('invalid proposal id.', undefined);
            return response.status(400).send(errorResponse);
        }

        if ((proposal.approveUserId !== undefined && proposal.approveUserId !== null) || (proposal.approveDate !== undefined && proposal.approveDate !== null)) {
            const errorResponse: any = ResponceUtil.getErrorResponce('This Proposal Approved.', undefined);
            return response.status(400).send(errorResponse);
        }

        proposal.approveUserId = user.id;
        proposal.approveUsername = user.username;
        proposal.approveDate = moment().toDate();

        const proposalUpdate = await this.proposalService.update(request.user, proposal);

        if (proposalUpdate) {
            this.addLog(proposal.id, 'APPROVE', JSON.stringify(proposalUpdate), moment().toDate(), user.id);

            const userExpStmt = new UserExpStatement();
            userExpStmt.contentType = CONTENT_TYPE.PROPOSAL;
            userExpStmt.action = USER_EXP_STATEMENT.CREATE;
            userExpStmt.contentId = proposal.id.toString();
            userExpStmt.userId = proposal.createdBy.toString();
    
            const dataUser = await this.userExpStmtService.createUserExpStmt(userExpStmt);
            const dataUserExpStmt = this.userExpStmtService.create(dataUser);
            if (dataUserExpStmt) {
                const successResponse: any = ResponceUtil.getSucessResponce('Successfully approve the proposal.', proposalUpdate);
                return response.status(200).send(successResponse);
            }

        } else {
            this.addLog(proposal.id, 'APPROVE', 'Approve Error', moment().toDate(), user.id);

            const errorResponse: any = ResponceUtil.getErrorResponce('unable to approve proposal.', proposalUpdate);
            return response.status(400).send(errorResponse);
        }
    }

    // Admin unapprove Proposal API
    /**
     * @api {Put} /api/admin/proposal/:id/unapprove Admin unapprove Proposal API
     * @apiGroup AdminProposal
     * @apiHeader {String} Authorization
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Proposal is approve successfully",
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
     *              "endDate" : "",
     *      }
     * }
     * @apiSampleRequest /api/admin/proposal/:id/unapprove
     * @apiErrorExample {json} approveProposal error
     * HTTP/1.1 500 Internal Server Error
     */
    @Put('/:id/unapprove')
    @Authorized()
    public async unApproveProposalPage(@Param('id') id: number, @Req() request: any, @Res() response: any): Promise<any> {

        const user = await this.userService.findOne({
            where: {
                userId: request.user.id,
            },
        });

        if (!user) {
            const errResponse: any = ResponceUtil.getErrorResponce('Invalid userId.', undefined);
            return response.status(400).send(errResponse);
        }

        const proposal = await this.proposalService.findOne({

            where: {
                id,
            },
        });

        if (!proposal) {
            const errorResponse: any = ResponceUtil.getErrorResponce('invalid proposal id.', undefined);
            return response.status(400).send(errorResponse);
        }

        if ((proposal.approveUserId === undefined && proposal.approveUserId === null) || (proposal.approveDate === undefined && proposal.approveDate === null)) {
            const errorResponse: any = ResponceUtil.getErrorResponce('This Proposal Not yet Approve.', undefined);
            return response.status(400).send(errorResponse);
        }

        proposal.approveUserId = null;
        proposal.approveUsername = null;
        proposal.approveDate = null;

        const proposalUpdate = await this.proposalService.update(request.user, proposal);
        if (proposalUpdate) {
            this.addLog(proposal.id, 'UNAPPROVE', JSON.stringify(proposalUpdate), moment().toDate(), user.id);

            const successResponse: any = ResponceUtil.getSucessResponce('Successfully unapprove the proposal.', proposalUpdate);
            return response.status(200).send(successResponse);
        } else {
            this.addLog(proposal.id, 'APPROVE', 'Approve Error', moment().toDate(), user.id);

            const errorResponse: any = ResponceUtil.getErrorResponce('unable to approve proposal.', undefined);
            return response.status(400).send(errorResponse);
        }
    }

    // Pin Proposal API
    /**
     * @api {post} /api/admin/proposal/pin Pin Proposal
     * @apiGroup AdminProposal
     * @apiParam (Request body) {String} data {proposalId, pinOrdering}
     * @apiParamExample {json} Input
     * {
     *      "data" :
     *          [
     *              {
     *                  "proposalId" : "",
     *                  "pinOrdering" : "",
     *              },
     *              {
     *                  "proposalId" : "",
     *                  "pinOrdering" : "",
     *              },
     *          ]
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Pin Proposal Successfully",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/proposal/pin
     * @apiErrorExample {json} Proposal error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/pin')
    @Authorized()
    public async pinProposal(@Body() pinProposal: CreatePinProposal, @QueryParam('overide') isOveride: boolean, @Res() response: any, @Req() request: any): Promise<any> {
        try {
            const user = await this.userService.findOne({
                where: {
                    userId: request.user.id,
                },
            });

            if (!user) {
                const errResponse: any = ResponceUtil.getErrorResponce('Invalid userId.', undefined);
                return response.status(400).send(errResponse);
            }

            const data = pinProposal.data;

            if (data !== null && data !== undefined && data.length > 0) {

                const proposalOrderingMap: any = {};
                let idStmt = '';

                const whereConditionSetNulls = 'pin_ordering is not null';
                const proposalSetNulls: Proposal[] = await this.proposalService.search(undefined, undefined, undefined, undefined, whereConditionSetNulls, undefined, false);

                for (let item of proposalSetNulls) {
                    item.pinOrdering = null;
                    item.modifiedBy = request.user.id;
                    item.modifiedByUsername = request.user.username;
                    item.modifiedDate = moment().toDate();

                    item = await this.proposalService.update(item.id, item);
                }

                for (let i = 0; i < data.length; i++) {
                    const proposalId: string = data[i].proposalId;
                    const ordering: number = data[i].pinOrdering;

                    if (proposalId === undefined || proposalId === '') {
                        continue;
                    }

                    if (ordering === undefined) {
                        continue;
                    }

                    idStmt += '' + proposalId + ', ';

                    proposalOrderingMap[proposalId] = ordering;
                }

                if (idStmt !== '') {
                    idStmt = 'id in(' + idStmt.substr(0, idStmt.length - 2) + ')';
                }

                let pinStmt = '';
                if (isOveride !== undefined && isOveride) {
                    // get pin ordering to set null
                    pinStmt = 'pin_ordering is not null';

                    if (idStmt !== '') {
                        pinStmt = ' or ' + pinStmt;
                    }
                }

                const whereConditions = idStmt + pinStmt;

                const proposals: Proposal[] = await this.proposalService.search(undefined, undefined, undefined, undefined, whereConditions, undefined, false);
                const proposalPinResult: Proposal[] = [];

                for (let item of proposals) {
                    const id: string = item.id + '';

                    if (proposalOrderingMap[id] !== undefined) {
                        const ordering: number = proposalOrderingMap[id];
                        item.pinOrdering = ordering;

                        item = await this.proposalService.update(user, item);

                        proposalPinResult.push(item);
                    } else {
                        item.pinOrdering = null;
                        await this.proposalService.update(user, item);
                        const userExpStmt = new UserExpStatement();
                        userExpStmt.contentType = CONTENT_TYPE.PROPOSAL;
                        userExpStmt.action = USER_EXP_STATEMENT.RECOMMEND;
                        userExpStmt.contentId = item.id.toString();
                        userExpStmt.userId = item.createdBy.toString();

                        const dataUser = await this.userExpStmtService.createUserPin(userExpStmt);
                        this.userExpStmtService.create(dataUser);
                    }
                }

                return response.status(200).send(ResponceUtil.getSucessResponce('Pin Proposal Success', proposalPinResult));
            } else {
                if (isOveride !== undefined && isOveride) {
                    if (data && data.length <= 0) {
                        const proposalPinResult: Proposal[] = [];
                        const whereConditions = 'pin_ordering is not null';
                        const proposals: Proposal[] = await this.proposalService.search(undefined, undefined, undefined, undefined, whereConditions, undefined, false);
                        for (let item of proposals) {
                            item.pinOrdering = null;
                            item = await this.proposalService.update(user, item);
                            proposalPinResult.push(item);
                        }

                        return response.status(200).send(ResponceUtil.getSucessResponce('UnPin all Proposal Success', proposalPinResult));
                    }
                }

                return response.status(400).send(ResponceUtil.getErrorResponce('No Proposal Found', undefined));
            }
        } catch (error) {
            return response.status(400).send(error);
        }
    }

    // Log Proposal API
    /**
     * @api {post} /api/admin/proposal/log/search Admin Proposal Search API
     * @apiGroup AdminProposal
     * @apiHeader {String} Authorization
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
     *         "data":{
     *                  "id" : "",
     *                  "title" : "",
     *                  "title" : "",
     *                  "content" : "",
     *                  "approveUserId" : "",
     *                  "approveDate" : "",
     *                  "likeCount" : "",
     *                  "dislikeCount" : "",
     *                  "endDate" : "",
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/proposal/log/search
     * @apiErrorExample {json} Page error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/log/search')
    @Authorized()
    public async logProposal(@Body({ validate: true }) searchFilter: SearchFilter, @Res() response: any): Promise<any> {

        const poposalLogList = await this.proposalLogService.search(searchFilter.limit, searchFilter.offset, searchFilter.select, searchFilter.relation, searchFilter.whereConditions, searchFilter.orderBy, searchFilter.count);
        if (poposalLogList) {
            const successRes: any = ResponceUtil.getSucessResponce('Successfully got poposal log.', poposalLogList);
            return response.status(200).send(successRes);
        } else {
            const errorResponse: any = ResponceUtil.getErrorResponce('Error get proposal log list.', undefined);
            return response.status(400).send(errorResponse);
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
