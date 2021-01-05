import 'reflect-metadata';
import { Get, JsonController, Res, Param, Post, Body, Authorized, Delete, Put, Req } from 'routing-controllers';
// import { ResponceUtil } from '../../../utils/ResponceUtil';
import { ActivityNewsService } from '../../../api/services/ActivityNewsService';
import { SearchFilter } from '../requests/SearchFilterRequest';
import { ActivityNews } from '../../../api/models/ActivityNews';
import { ResponceUtil } from '../../../utils/ResponceUtil';
import { CreateActivityNewsRequest } from '../requests/CreateActivityNewsRequest';
import { UpdateActivityNewsRequest } from '../requests/UpdateActivityNewsRequest';

@JsonController('/admin/activity')
export class AdminActivityNewsController {
    constructor(private activityService: ActivityNewsService) {

    }
    /**
     * @api {post} /api/admin/activity/ Create activity API
     * @apiGroup Adminactivity
     * @apiParam (Request body) {String} coverImageUrl coverImageUrl
     * @apiParam (Request body) {String} coverVideoUrl coverVideoUrl
     * @apiParam (Request body) {String} title title
     * @apiParam (Request body) {Date} startDateTime startDateTime
     * @apiParam (Request body) {Date} endDateTime endDateTime
     * @apiParam (Request body) {number} latitude latitude
     * @apiParam (Request body) {number} longitude longitude
     * @apiParam (Request body) {String} placeName placeName
     * @apiParam (Request body) {String} content content
     * @apiParam (Request body) {String} description description
     * @apiHeader {String} Authorization
     * @apiParamExample {json} Input
     * {
     *      "coverImageUrl" : "",
     *      "coverVideoUrl" : "",
     *      "title" : "",
     *      "startDateTime" : "",
     *      "endDateTime" : "",
     *      "latitude" : "",
     *      "longitude" : "",
     *      "placeName" : "",
     *      "content" : "",
     *      "description" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "New activity is created successfully",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/activity/
     * @apiErrorExample {json} activity error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/')
    @Authorized()
    public async createActivity(@Body({ validate: true }) activity: CreateActivityNewsRequest, @Res() response: any, @Req() request: any): Promise<any> {
        const activityValue: any = new ActivityNews();

        const pattern = new RegExp('^(https?|http?)://');
        if (activity.coverImageUrl !== null && activity.coverImageUrl !== undefined && activity.coverImageUrl !== '') {
            if (!pattern.test(activity.coverImageUrl)) {
                return response.status(400).send(ResponceUtil.getErrorResponce('invalid pattern link image url', undefined));
            }
        }

        if (activity.coverVideoUrl !== null && activity.coverVideoUrl !== undefined && activity.coverVideoUrl !== '') {
            if (!pattern.test(activity.coverVideoUrl)) {
                return response.status(400).send(ResponceUtil.getErrorResponce('invalid pattern link cover image', undefined));
            }
        }
        activityValue.coverImageUrl = activity.coverImageUrl;
        activityValue.coverVideoUrl = activity.coverVideoUrl;
        activityValue.title = activity.title;
        activityValue.startDateTime = activity.startDateTime;
        activityValue.endDateTime = activity.endDateTime;
        activityValue.latitude = activity.latitude;
        activityValue.longitude = activity.longitude;
        activityValue.placeName = activity.placeName;
        activityValue.content = activity.content;
        activityValue.description = activity.description;
        activityValue.createdByUsername = request.user.username;
        activityValue.createdBy = request.user.id;

        const saveActivity = await this.activityService.create(activityValue);
        
        if (!saveActivity) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable to create activity', undefined);
            return response.status(400).send(errorResponse);
        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully create activity', saveActivity);
            return response.status(200).send(successResponse);
        }

    }
    /**
     * @api {put} /api/admin/activity/:id Edit activity API
     * @apiGroup Adminactivity
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {String} coverImageUrl coverImageUrl
     * @apiParam (Request body) {String} coverVideoUrl coverVideoUrl
     * @apiParam (Request body) {String} title title
     * @apiParam (Request body) {Date} startDateTime startDateTime
     * @apiParam (Request body) {Date} endDateTime endDateTime
     * @apiParam (Request body) {String} latitude latitude
     * @apiParam (Request body) {String} longitude longitude
     * @apiParam (Request body) {String} placeName placeName
     * @apiParam (Request body) {String} content content
     * @apiParam (Request body) {String} description description
     * @apiParamExample {json} Input
     * {
     *      "coverImageUrl" : "",
     *      "coverVideoUrl" : "",
     *      "startDateTime" : "",
     *      "endDateTime" : "",
     *      "latitude" : "",
     *      "longitude" : "",
     *      "placeName" : "",
     *      "content" : "",
     *      "description" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully edit activity.",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/activity/:id
     * @apiErrorExample {json} activity error
     * HTTP/1.1 500 Internal Server Error
     */
    @Put('/:id')
    @Authorized()
    public async editAcitivity(@Body({ validate: true }) activityEdits: UpdateActivityNewsRequest, @Param('id') Id: number, @Res() response: any, @Req() request: any): Promise<any> {
        const activityEdit = await this.activityService.findOne({
            where: {
                id: Id,
            },
        });
        if (!activityEdit) {
            const errorResponse = ResponceUtil.getErrorResponce('invalid activityid', activityEdit);
            return response.status(400).send(errorResponse);

        }
        activityEdit.coverImageUrl = activityEdits.coverImageUrl;
        activityEdit.coverVideoUrl = activityEdits.coverVideoUrl;
        activityEdit.title = activityEdits.title;
        activityEdit.startDateTime = activityEdits.startDateTime;
        activityEdit.endDateTime = activityEdits.endDateTime;
        activityEdit.latitude = activityEdits.latitude;
        activityEdit.longitude = activityEdits.longitude;
        activityEdit.placeName = activityEdits.placeName;
        activityEdit.content = activityEdits.content;
        activityEdit.description = activityEdits.description;
        activityEdit.modifiedByUsername = request.user.username;
        activityEdit.modifiedBy = request.user.id;

        const activitySave = await this.activityService.create(activityEdit);

        if (!activitySave) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable to edit activity', undefined);
            return response.status(400).send(errorResponse);

        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully edit activity', activitySave);
            return response.status(200).send(successResponse);
        }

    }
    /**
     * @api {delete} /api/admin/activity/:id Delete activity API
     * @apiGroup Adminactivity
     * @apiHeader {String} Authorization
     * @apiParamExample {json} Input
     * {
     *      "id" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     * "message": "Successfully deleted activity.",
     * "status": "1"
     * }
     * @apiSampleRequest /api/admin/activity/:id
     * @apiErrorExample {json} activityDelete error
     * HTTP/1.1 500 Internal Server Error
     */
    @Delete('/:id')
    @Authorized()
    public async deleteActivity(@Param('id') Id: any, @Res() response: any, @Req() request: any): Promise<any> {
        const activity = await this.activityService.findOne({
            where: {
                id: Id,
            },
        });
        if (!activity) {
            const errorResponse = ResponceUtil.getErrorResponce('invalid activityid', activity);
            return response.status(400).send(errorResponse);
        }
        const deleteActivity = await this.activityService.delete(Id);
        if (!deleteActivity) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable to delete activity', undefined);
            return response.status(400).send(errorResponse);

        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully delete activity', Id);
            return response.status(200).send(successResponse);
        }
    }
    /**
     * @api {get} /api/admin/activity/:id  Find activity API
     * @apiGroup Adminactivity
     * @apiHeader {String} Authorization
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully get activity Details",
     *      "data":{
     *      "coverImageUrl" : "",
     *      "coverVideoUrl" : "",
     *      "startDate" : "",
     *      "startTime" : "",
     *      "endDate" : "",
     *      "endTime" : "",
     *      "latitude" : "",
     *      "longitude" : "",
     *      "placeName" : "",
     *      "content" : "",
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/activity/:id
     * @apiErrorExample {json} activity error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/:id')
    @Authorized()
    public async activityDetails(@Param('id') Id: number, @Res() response: any): Promise<any> {

        const activitySearch = await this.activityService.findOne({
            where: { id: Id },
        });

        if (!activitySearch) {
            const errorResponse = ResponceUtil.getErrorResponce('invalid activityid', activitySearch);
            return response.status(400).send(errorResponse);
        }
        if (!activitySearch) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable to got activity', undefined);
            return response.status(400).send(errorResponse);

        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully got activity', activitySearch);
            return response.status(200).send(successResponse);
        }
    }
    /**
     * @api {post} /api/admin/activity/search Search activity API
     * @apiGroup Adminactivity
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
     *    "message": "Successfully get activity search",
     *    "data":{
     *     }
     *    "status": "1"
     *  }
     * @apiSampleRequest /api/admin/activity/search
     * @apiErrorExample {json} activity error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/search')
    @Authorized()
    public async activitySearch(@Body({ validate: true }) filter: SearchFilter, @Res() response: any): Promise<any> {
        const activityLists: any = await this.activityService.search(filter.limit, filter.offset, filter.select, filter.relation, filter.whereConditions, filter.orderBy, filter.count);

        if (!activityLists) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable to search activity', undefined);
            return response.status(400).send(errorResponse);

        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully search activity', activityLists);
            return response.status(200).send(successResponse);
        }
    }
}
