/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import 'reflect-metadata';
import { JsonController, Res, Post, Body, Get, Param, QueryParam } from 'routing-controllers';
// import { Room } from '../models/Room';
// import { CreateRoomRequest } from './requests/CreateRoomRequest';
import { RoomService } from '../services/RoomService';
// import { UpdateRoomRequest } from './requests/UpdateRoomRequest';
import { SearchFilter } from './requests/SearchFilterRequest';
// import { classToPlain } from 'class-transformer';
import { ResponceUtil } from '../../utils/ResponceUtil';
import { ProposalService } from '../services/ProposalService';
import { VoteService } from '../services/VoteService';
import { SearchUtil } from '../../utils/SearchUtil';

@JsonController('/room')
export class RoomController {
    constructor(private roomService: RoomService, private proposalService: ProposalService, private voteService: VoteService) {
    }
    /**
     * @api {get} /api/room/:id  Pageuser Find Room API
     * @apiGroup Room
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     * "message": "Successfully get room Details",
     * "data":{
     * "name" : "",
     * "description" : "",
     * }
     * "status": "1"
     * }
     * @apiSampleRequest /api/room/:id
     * @apiErrorExample {json} room error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/:id')
    public async roomDetails(@Param('id') Id: number, @Res() response: any): Promise<any> {
        const room = await this.roomService.findOne({
            where: {
                id: Id,
            },
        });

        if (!room) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable got room', undefined);
            return response.status(400).send(errorResponse);

        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully got room', room);
            return response.status(200).send(successResponse);
        }
    }
    /**
     * @api {post} /api/room/search Pageuser Search Room API
     * @apiGroup Room
     * @apiParam (Request body) {number} limit limit
     * @apiParam (Request body) {number} offset offset
     * @apiParam (Request body) {String} select select
     * @apiParam (Request body) {String} relation relation
     * @apiParam (Request body) {String} whereConditions whereConditions
     * @apiParam (Request body) {boolean} count count (0=false, 1=true)
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *    "message": "Successfully get room search",
     *    "data":{
     *    "name" : "",
     *    "description": "",
     *     }
     *    "status": "1"
     *  }
     * @apiSampleRequest /api/room/search
     * @apiErrorExample {json} room error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/search')
    public async roomSearch(@Body() filter: SearchFilter, @Res() response: any): Promise<any> {
        const roomLists: any = await this.roomService.search(filter.limit, filter.offset, filter.select, filter.relation, filter.whereConditions, filter.orderBy, filter.count);

        if (!roomLists) {
            const successResponse = ResponceUtil.getSucessResponce('Successfully got room', []);
            return response.status(200).send(successResponse);

        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully got room', roomLists);
            return response.status(200).send(successResponse);
        }
    }
    /**
     * @api {get} /api/room/:id/proposal  Pageuser list proposal Room API
     * @apiGroup Room
     * @apiParam {Number} limit limit
     * @apiParam {Number} offset offset
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully get proposal Details",
     *      "data":{
     *      "id" : "",
     *      "room_id" : "",
     *      "content" : "",
     *      "req_supporter" : "",
     *      "approve_user_id" : "",
     *      "approve_date" : "",
     *      "like_count" : "",
     *      "dislike_count" : "",
     *      "end_date" : "",
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/room/:id/proposal
     * @apiErrorExample {json} room error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/:id/proposal')
    public async listProposal(@Param('id') proposalId: any, @QueryParam('limit') limlt:any , @QueryParam('offset') offsets:any, @Res() response: any): Promise<any> {
        const limlts = SearchUtil.getSearchLimit(limlt);
        const dataProposal = await this.proposalService.findAll({
            where: {
                roomId: proposalId,
            },
            take: limlts,
            skip: offsets,
        });
        if (!dataProposal) {
            const errorResponse = ResponceUtil.getErrorResponce('Invaild proposalid', dataProposal);
            return response.status(400).send(errorResponse);

        }
        if (!dataProposal) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable got room prososal', undefined);
            return response.status(400).send(errorResponse);

        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully got room prososal', dataProposal);
            return response.status(200).send(successResponse);
        }
    }
    /**
     * @api {get} /api/room/:id/vote Pageuser list vote Room API
     * @apiGroup Room
     * @apiParam {Number} limit limit
     * @apiParam {Number} offset offset
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully get vote Details",
     *      "data":{
     *      "id" : "",
     *      "proposal_id" : "",
     *      "room_id" : "",
     *      "content" : "",
     *      "vote_count" : "",
     *      "is_active" : "",
     *      "like_count" : "",
     *      "dislike_count" : "",
     *      "end_date" : "",
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/room/:id/vote
     * @apiErrorExample {json} room error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/:id/vote')
    public async listVote(@Param('id') voteId: any,@QueryParam('limit') limlt:any , @QueryParam('offset') offsets:any, @Res() response: any): Promise<any> {
        const limlts = SearchUtil.getSearchLimit(limlt);
        const dataVote = await this.voteService.find({
            where: {
                roomId: voteId,
            },
            take: limlts,
            skip: offsets,
        });
        if (!dataVote) {
            const errorResponse = ResponceUtil.getErrorResponce('Invaild voteid', dataVote);
            return response.status(400).send(errorResponse);

        }
        if (!dataVote) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable got room vote', undefined);
            return response.status(400).send(errorResponse);

        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully got room vote', dataVote);
            return response.status(200).send(successResponse);
        }
    }
}
