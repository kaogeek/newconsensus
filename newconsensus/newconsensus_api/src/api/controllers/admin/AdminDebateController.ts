/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import 'reflect-metadata';
import { Post, Get, Delete, Param, Body, JsonController, Authorized, Res, Req, QueryParam } from 'routing-controllers';
import { SearchFilter } from '../requests/SearchFilterRequest';
import { DebateService } from '../../services/DebateService';
import { ResponceUtil } from '../../../utils/ResponceUtil';
import { DebateLogs } from '../../models/DebateLogs';
import { DEBATE_LOG_ACTION, CONTENT_TYPE, USER_EXP_STATEMENT } from '../../../LogsStatus';
import { DebateLogsService } from '../../services/DebateLogsService';
import { UserService } from '../../services/UserService';
import { CreatePinDebate } from '../requests/CreatePinDebateRequest';
import { Debate } from '../../models/Debate';
import moment = require('moment/moment');
import { UserExpStatement } from '../../models/UserExpStatement';
import { UserExpStatementService } from '../../services/UserExpStatementService';

@JsonController('/admin/debate')
export class AdminDebateController {
    constructor(private debateService: DebateService, private debateLogsService: DebateLogsService, private userService: UserService,
        private userExpStmtService: UserExpStatementService) {
    }

    // Admin Debate API
    // Find Admin Debate API
    /**
     * @api {get} /api/admin/debate/:id Find Admin Debate
     * @apiGroup AdminDebate
     * @apiHeader {String} Authorization
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Find Admin Debate Successfully",
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
     * @apiSampleRequest /api/admin/debate/:id
     * @apiErrorExample {json} Admin debate error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/:id')
    @Authorized()
    public async findDebate(@Param('id') debateId: number, @Res() response: any): Promise<any> {
        const debate = await this.debateService.findOne({
            where: {
                id: debateId,
            },
        });

        if (debate) {
            return response.status(200).send(ResponceUtil.getSucessResponce('Successfully Got Debate', debate));
        } else {
            return response.status(400).send(ResponceUtil.getErrorResponce('Invalid Debate Id', undefined));
        }
    }

    // Pin Debate API
    /**
     * @api {post} /api/admin/debate/pin Pin Debate
     * @apiGroup AdminDebate
     * @apiParam (Request body) {String} data {debateId, pinOrdering}
     * @apiParamExample {json} Input
     * {
     *      "data" :
     *          [
     *              {
     *                  "debateId" : "",
     *                  "pinOrdering" : "",
     *              },
     *              {
     *                  "debateId" : "",
     *                  "pinOrdering" : "",
     *              },
     *          ]
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Pin Debate Successfully",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/debate/pin
     * @apiErrorExample {json} Debate error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/pin')
    @Authorized()
    public async pinDebate(@Body() pinDebate: CreatePinDebate, @QueryParam('overide') isOveride: boolean, @Res() response: any, @Req() request: any): Promise<any> {
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

            const data = pinDebate.data;

            if (data !== null && data !== undefined && data.length > 0) {

                const debateOrderingMap: any = {};
                let idStmt = '';

                const searchFilterSetNull = new SearchFilter();
                searchFilterSetNull.whereConditions = 'pin_ordering is not null';
                const debateSetNulls: Debate[] = await this.debateService.search(searchFilterSetNull);

                for (let item of debateSetNulls) {
                    item.pinOrdering = null;
                    item.modifiedBy = request.user.id;
                    item.modifiedByUsername = request.user.username;
                    item.modifiedDate = moment().toDate();

                    item = await this.debateService.update(item.id, item);
                }

                for (let i = 0; i < data.length; i++) {
                    const debateId: string = data[i].debateId;
                    const ordering: number = data[i].pinOrdering;

                    if (debateId === undefined || debateId === '') {
                        continue;
                    }

                    if (ordering === undefined) {
                        continue;
                    }

                    idStmt += '' + debateId + ', ';

                    debateOrderingMap[debateId] = ordering;
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

                const searchFilter = new SearchFilter();
                searchFilter.whereConditions = whereConditions;

                const debates: Debate[] = await this.debateService.search(searchFilter);
                const debatePinResult: Debate[] = [];

                for (let item of debates) {
                    const id: string = item.id + '';

                    if (debateOrderingMap[id] !== undefined) {
                        const ordering: number = debateOrderingMap[id];
                        item.pinOrdering = ordering;
                        item.modifiedBy = request.user.id;
                        item.modifiedByUsername = request.user.username;
                        item.modifiedDate = moment().toDate();

                        item = await this.debateService.update(item.id, item);

                        debatePinResult.push(item);
                    } else {
                        item.pinOrdering = null;
                        item.modifiedBy = request.user.id;
                        item.modifiedByUsername = request.user.username;
                        item.modifiedDate = moment().toDate();

                        await this.debateService.update(item.id, item);
                        const userExpStmt = new UserExpStatement();
                        userExpStmt.contentType = CONTENT_TYPE.PROPOSAL;
                        userExpStmt.action = USER_EXP_STATEMENT.RECOMMEND;
                        userExpStmt.contentId = item.id.toString();
                        userExpStmt.userId = item.createdBy.toString();

                        const dataUser = await this.userExpStmtService.createUserPin(userExpStmt);
                        this.userExpStmtService.create(dataUser);
                    }
                }

                return response.status(200).send(ResponceUtil.getSucessResponce('Pin Debate Success', debatePinResult));
            } else {
                if (isOveride !== undefined && isOveride) {
                    if (data && data.length <= 0) {
                        const debatePinResult: Debate[] = [];
                        const whereConditions = 'pin_ordering is not null';
                        const searchFilter = new SearchFilter();
                        searchFilter.whereConditions = whereConditions;
                        const debates: Debate[] = await this.debateService.search(searchFilter);

                        for (let item of debates) {
                            item.pinOrdering = null;
                            item.modifiedBy = request.user.id;
                            item.modifiedByUsername = request.user.username;
                            item.modifiedDate = moment().toDate();

                            item = await this.debateService.update(item.id, item);
                            debatePinResult.push(item);
                        }

                        return response.status(200).send(ResponceUtil.getSucessResponce('UnPin all Debate Success', debatePinResult));
                    }
                }

                return response.status(400).send(ResponceUtil.getErrorResponce('No Debate Found', undefined));
            }
        } catch (error) {
            return response.status(400).send(error);
        }
    }

    // Search Debate API
    /**
     * @api {post} /api/admin/debate/search Search Debate
     * @apiGroup AdminDebate
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {number} limit limit
     * @apiParam (Request body) {number} offset offset
     * @apiParam (Request body) {String} select select
     * @apiParam (Request body) {String} relation relation
     * @apiParam (Request body) {String} whereConditions whereConditions
     * @apiParam (Request body) {boolean} isCount isCount (0=false, 1=true)
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
     *      "message": "Search Admin Debate Successfully",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/debate/search
     * @apiErrorExample {json} Debate error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/search')
    @Authorized()
    public async searchDebate(@Body() filter: SearchFilter, @Res() response: any): Promise<any> {
        // const debate: any = await this.debateService.search(filter);
        const debate: any = await this.debateService.searchMoreRelation(filter, true, false, false);

        if (debate) {
            return response.status(200).send(ResponceUtil.getSucessResponce('Search Debate Successful', debate));
        } else {
            return response.status(400).send(ResponceUtil.getErrorResponce('Unable to Search Debate', undefined));
        }
    }

    // Delete Debate API
    /**
     * @api {delete} /api/admin/debate/:id Delete Admin Debate
     * @apiGroup AdminDebate
     * @apiHeader {String} Authorization
     * @apiParamExample {json} Input
     * {
     *      "id" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully deleted Admin Debate.",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/debate/:id
     * @apiErrorExample {json} Admin Debate error
     * HTTP/1.1 500 Internal Server Error
     */
    @Delete('/:id')
    @Authorized()
    public async deleteDebate(@Param('id') debateId: number, @Res() response: any, @Req() req: any): Promise<any> {
        const uId = req.user.id;

        const debate = await this.debateService.findOne({
            where: {
                id: debateId,
            },
        });

        const deleteDebateResult = [];

        if (!debate) {
            deleteDebateResult.push(
                {
                    id: debateId,
                    result: false,
                }
            );

            return response.status(400).send(ResponceUtil.getErrorResponce('Invalid Debate Id', undefined));
        }

        const deleteDebate: any = await this.debateService.delete(debateId);

        if (deleteDebate) {
            deleteDebateResult.push(
                {
                    id: debateId,
                    result: true,
                }
            );

            const debateLogs = new DebateLogs();
            debateLogs.userId = uId;
            debateLogs.action = DEBATE_LOG_ACTION.DELETE;
            debateLogs.detail = JSON.stringify(deleteDebate);

            const debateLogsCreated = await this.debateLogsService.create(debateLogs);

            if (debateLogsCreated) {
                return response.status(200).send(ResponceUtil.getSucessResponce('Delete Debate Success', deleteDebateResult));
            }
        } else {
            deleteDebateResult.push(
                {
                    id: debateId,
                    result: false,
                }
            );

            return response.status(400).send(ResponceUtil.getErrorResponce('Unable to Delete Debate', undefined));
        }
    }

    // Log debate API
    /**
     * @api {post} /api/admin/debate/log/search Search debate log
     * @apiGroup AdminDebate
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
     *      "message": "Successfully get debate list",
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
     * @apiSampleRequest /api/admin/debate/log/search
     * @apiErrorExample {json} Page error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/log/search')
    @Authorized()
    public async logDebate(@Body({ validate: true }) searchFilter: SearchFilter, @Res() response: any): Promise<any> {
        
        const debateLogList = await this.debateLogsService.search(searchFilter);
        if (debateLogList) {
            const successRes: any = ResponceUtil.getSucessResponce('Successfully got debate log.', debateLogList);
            return response.status(200).send(successRes);
        } else {
            const errorResponse: any = ResponceUtil.getErrorResponce('Error get debate log list.', undefined);
            return response.status(400).send(errorResponse);
        }
    }
}
