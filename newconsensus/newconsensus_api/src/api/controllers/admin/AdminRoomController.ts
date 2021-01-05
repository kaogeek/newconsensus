import 'reflect-metadata';
import { Get, JsonController, Res, Post, Body, Authorized, Put, Param, Req, Delete } from 'routing-controllers';
import { RoomService } from '../../services/RoomService';
import { CreateRoomRequest } from '../requests/CreateRoomRequest';
import { Room } from '../../../api/models/Room';
import { UpdateRoomRequest } from '../requests/UpdateRoomRequest';
import { SearchFilter } from '../requests/SearchFilterRequest';
import { ResponceUtil } from '../../../utils/ResponceUtil';
@JsonController('/admin/room')
export class AdminRoomController {
    constructor(private roomService: RoomService) {
    }
    /**
     * @api {post} /api/admin/room/ Create Room API
     * @apiGroup AdminRoom
     * @apiParam (Request body) {String} name name
     * @apiParam (Request body) {String} description description
     * @apiParam (Request body) {String} color color
     * @apiHeader {String} Authorization
     * @apiParamExample {json} Input
     * {
     *      "name" : "",
     *      "description" : "",
     *      "color" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "New Room is created successfully",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/room/
     * @apiErrorExample {json} room error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/')
    @Authorized()
    public async createRoom(@Body({ validate: true }) rooms: CreateRoomRequest, @Res() response: any, @Req() request: any): Promise<any> {
        const roomValue: any = new Room();
        roomValue.name = rooms.name;
        roomValue.description = rooms.description;
        roomValue.color = rooms.color;
        roomValue.createdByUsername = request.user.username;
        roomValue.createdBy = request.user.id;

        const data = await this.roomService.findOne({
            where : {
                name: rooms.name
            },
        });
        if (data) {
            const errorResponse = ResponceUtil.getErrorResponce('duplicate roomname', data);
            return response.status(400).send(errorResponse);
        }
        const saveTag = await this.roomService.create(roomValue);
    
        if (!saveTag) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable create room', undefined);
            return response.status(400).send(errorResponse);

        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully create room', saveTag);
            return response.status(200).send(successResponse);
        }

    }
    /**
     * @api {put} /api/admin/room/:id Edit Room API
     * @apiGroup AdminRoom
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {String} name Room name
     * @apiParam (Request body) {String} description description
     * @apiParam (Request body) {String} color color
     * @apiParamExample {json} Input
     * {
     *      "name" : "",
     *      "description" : "",
     *      "color" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully edit room.",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/room/:id
     * @apiErrorExample {json} room error
     * HTTP/1.1 500 Internal Server Error
     */
    @Put('/:id')
    @Authorized()
    public async editRoom(@Body({ validate: true }) roomStatus: UpdateRoomRequest, @Param('id') Id: number, @Res() response: any, @Req() request: any): Promise<any> {
        const editRoom = await this.roomService.findOne({
            where: {
                id: Id,
            },
        });
        if (!editRoom) {
            const errorResponse = ResponceUtil.getErrorResponce('invalid roomid', editRoom);
            return response.status(400).send(errorResponse);

        }
        editRoom.name = roomStatus.name;
        editRoom.description = roomStatus.description;
        editRoom.color = roomStatus.color;
        editRoom.modifiedByUsername = request.user.username;
        editRoom.modifiedBy = request.user.id;

        const roomSave = await this.roomService.create(editRoom);
        if (!roomSave) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable edit room', undefined);
            return response.status(400).send(errorResponse);

        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully edit room', roomSave);
            return response.status(200).send(successResponse);
        }
    }
    /**
     * @api {delete} /api/admin/room/:id Delete Room API
     * @apiGroup AdminRoom
     * @apiHeader {String} Authorization
     * @apiParamExample {json} Input
     * {
     *      "id" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     * "message": "Successfully deleted Room.",
     * "status": "1"
     * }
     * @apiSampleRequest /api/admin/room/:id
     * @apiErrorExample {json} roomDelete error
     * HTTP/1.1 500 Internal Server Error
     */
    @Delete('/:id')
    @Authorized()
    public async deleteRoom(@Param('id') Id: number, @Res() response: any, @Req() request: any): Promise<any> {
        const room = await this.roomService.findOne({
            where: {
                id: Id,
            },
        });
        if (!room) {
            const errorResponse = ResponceUtil.getErrorResponce('invalid roomid', room);
            return response.status(400).send(errorResponse);
        }
        const deleteTag = await this.roomService.delete(Id);

        if (deleteTag) {
            const successResponse = ResponceUtil.getSucessResponce('Successfully delete room', Id);
            return response.status(200).send(successResponse);

        } else {
            const errorResponse = ResponceUtil.getErrorResponce('Unable to delete room', undefined);
            return response.status(400).send(errorResponse);
        }
    }
    /**
     * @api {get} /api/admin/room/:id  Find Room API
     * @apiGroup AdminRoom
     * @apiHeader {String} Authorization
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     *      {
     *      "message": "Successfully get room Details",
     *      "data":{
     *      "name" : "",
     *      "description" : "",
     *      }
     *      "status": "1"
     *      }
     * @apiSampleRequest /api/admin/room/:id
     * @apiErrorExample {json} room error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/:id')
    @Authorized()
    public async roomDetails(@Param('id') Id: number, @Res() response: any): Promise<any> {
        const room = await this.roomService.findOne({
            where: {
                id: Id,
            },
        });
        if (!room) {
            const errorResponse = ResponceUtil.getErrorResponce('invalid roomid', room);
            return response.status(400).send(errorResponse);

        }
        if (!room) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable to find room', undefined);
            return response.status(400).send(errorResponse);

        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully find room', room);
            return response.status(200).send(successResponse);
        }
    }

    /**
     * @api {post} /api/admin/room/search Search Room API
     * @apiGroup AdminRoom
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
     *    "message": "Successfully get room search",
     *    "data":{
     *    "name" : "",
     *    "description": "",
     *     }
     *    "status": "1"
     *  }
     * @apiSampleRequest /api/admin/room/search
     * @apiErrorExample {json} room error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/search')
    @Authorized()
    public async roomSearch(@Body({validate:true}) filter: SearchFilter, @Res() response: any): Promise<any> {
        const roomLists: any = await this.roomService.search(filter.limit, filter.offset, filter.select, filter.relation, filter.whereConditions, filter.orderBy, filter.count);

        if (!roomLists) {
            const successResponse = ResponceUtil.getSucessResponce('Successfully search room', []);
            return response.status(200).send(successResponse);
        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully search room', roomLists);
            return response.status(200).send(successResponse);
        }
        
    }
}
