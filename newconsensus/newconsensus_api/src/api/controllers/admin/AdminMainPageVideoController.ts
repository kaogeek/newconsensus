/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import 'reflect-metadata';
import { Get, JsonController, Res, Param, Post, Body, Authorized, Delete, Put, Req } from 'routing-controllers';
// import { ResponceUtil } from '../../../utils/ResponceUtil';
import { SearchFilter } from '../requests/SearchFilterRequest';
import { ResponceUtil } from '../../../utils/ResponceUtil';
import { MainPageVideoService } from '../../../api/services/MainPageVideoService';
import { CreateMainPageVideo } from '../requests/CreateMainPageVideoRequest';
import { MainPageVideo } from '../../../api/models/MainPageVideo';
import { UpdateMainPageVideo } from '../requests/UpdateMainPageVideo';
import { MainPageVideoLogsService } from '../../services/MainPageVideoLogsService';
import { MainPageVideoLogs } from '../../models/MainPageVideoLogs';
import { MAINPAGE_VIDEO_LOG_ACTION } from '../../../LogsStatus';

@JsonController('/admin/pagevideo')
export class AdminMainPageVideoController {
    constructor(private pageVideoService: MainPageVideoService, private mpVideoLogsService: MainPageVideoLogsService) {

    }
    /**
     * @api {post} /api/admin/pagevideo/ Create pagevideo API
     * @apiGroup AdminMainPageVideo
     * @apiParam (Request body) {String} url url
     * @apiParam (Request body) {String} tagline tagline
     * @apiParam (Request body) {number} ordering ordering
     * @apiHeader {String} Authorization
     * @apiParamExample {json} Input
     * {
     *      "url" : "",
     *      "tagline" : "",
     *      "ordering" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "New pagevideo is created successfully",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/pagevideo/
     * @apiErrorExample {json} pagevideo error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/')
    @Authorized()
    public async createPageVideo(@Body({ validate: true }) pageVideo: CreateMainPageVideo, @Res() response: any, @Req() request: any): Promise<any> {
        const data: any = new MainPageVideo();

        // const pattern = new RegExp('^(https?|http?)://');
        // if (!pattern.test(pageVideo.url) && !pattern.test(pageVideo.url)) {
        //     return response.status(400).send(ResponceUtil.getErrorResponce('invalid pattern link cover image url', undefined));
        // }

        data.url = pageVideo.url;
        data.tagline = pageVideo.tagline;
        data.ordering = pageVideo.ordering;
        data.createdByUsername = request.user.username;
        data.createdBy = request.user.id;

        const mpVideoCreated = await this.pageVideoService.create(data);
        if (mpVideoCreated) {
            const mpVideoLogs = new MainPageVideoLogs();
            mpVideoLogs.userId = request.user.id;
            mpVideoLogs.action = MAINPAGE_VIDEO_LOG_ACTION.CREATE;
            mpVideoLogs.detail = JSON.stringify(mpVideoCreated);

            const pageVideoLogs = await this.mpVideoLogsService.create(mpVideoLogs);

            if (pageVideoLogs) {
                return response.status(200).send(ResponceUtil.getSucessResponce('Create MainPageVideo Successful', mpVideoCreated));
            }
        } else {
            const errorResponse = ResponceUtil.getErrorResponce('Unable to create pageVideo', undefined);
            return response.status(400).send(errorResponse);
        }

    }
    /**
     * @api {put} /api/admin/pagevideo/:id Edit pagevideo API
     * @apiGroup AdminMainPageVideo
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {String} url url
     * @apiParam (Request body) {String} tagline tagline
     * @apiParam (Request body) {number} ordering ordering
     * @apiParamExample {json} Input
     * {
     *      "url" : "",
     *      "tagline" : "",
     *      "ordering" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully edit pagevideo.",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/pagevideo/:id
     * @apiErrorExample {json} pagevideo error
     * HTTP/1.1 500 Internal Server Error
     */
    @Put('/:id')
    @Authorized()
    public async editPageVideo(@Body({ validate: true }) pageVideoEdit: UpdateMainPageVideo, @Param('id') Id: number, @Res() response: any, @Req() request: any): Promise<any> {
        const data = await this.pageVideoService.findOne({
            where: {
                id: Id,
            },
        });
        if (!data) {
            const errorResponse = ResponceUtil.getErrorResponce('invalid pagevideo id', data);
            return response.status(400).send(errorResponse);

        }
        data.url = pageVideoEdit.url;
        data.tagline = pageVideoEdit.tagline;
        data.ordering = pageVideoEdit.ordering;
        data.modifiedByUsername = request.user.username;
        data.modifiedBy = request.user.id;

        const pageVideoSave = await this.pageVideoService.create(data);

        if (!pageVideoSave) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable to edit pagevideo', undefined);
            return response.status(400).send(errorResponse);

        } else { 
            const mpVideoLogs = new MainPageVideoLogs();
            mpVideoLogs.userId = request.user.id;
            mpVideoLogs.action = MAINPAGE_VIDEO_LOG_ACTION.EDIT;
            mpVideoLogs.detail = JSON.stringify(pageVideoSave);

            const pageVideoLogs = await this.mpVideoLogsService.create(mpVideoLogs);

            if (pageVideoLogs) {
                const successResponse = ResponceUtil.getSucessResponce('Successfully edit pagevideo', pageVideoSave);
                return response.status(200).send(successResponse);
            }
        }

    }
    /**
     * @api {delete} /api/admin/pagevideo/:id Delete pagevideo API
     * @apiGroup AdminMainPageVideo
     * @apiHeader {String} Authorization
     * @apiParamExample {json} Input
     * {
     *      "id" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     * "message": "Successfully deleted pagevideo.",
     * "status": "1"
     * }
     * @apiSampleRequest /api/admin/pagevideo/:id
     * @apiErrorExample {json} pagevideoDelete error
     * HTTP/1.1 500 Internal Server Error
     */
    @Delete('/:id')
    @Authorized()
    public async deletePageVideo(@Param('id') Id: any, @Res() response: any, @Req() request: any): Promise<any> {
        const pageVideo = await this.pageVideoService.findOne({
            where: {
                id: Id,
            },
        });
        if (!pageVideo) {
            const errorResponse = ResponceUtil.getErrorResponce('invalid pagevideo id', pageVideo);
            return response.status(400).send(errorResponse);
        } 

        const deleteVideo = await this.pageVideoService.delete(Id);
        if (!deleteVideo) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable to delete pagevideo', undefined);
            return response.status(400).send(errorResponse); 
        } else {
            const mpVideoLogs = new MainPageVideoLogs();
            mpVideoLogs.userId = request.user.id;
            mpVideoLogs.action = MAINPAGE_VIDEO_LOG_ACTION.DELETE;
            mpVideoLogs.detail = JSON.stringify(deleteVideo);

            const pageVideoLogs = await this.mpVideoLogsService.create(mpVideoLogs);

            if (pageVideoLogs) {
                const successResponse = ResponceUtil.getSucessResponce('Successfully delete pagevideo', Id);
                return response.status(200).send(successResponse);
            }
        }
    }
    /**
     * @api {get} /api/admin/pagevideo/:id  Find pagevideo API
     * @apiGroup AdminMainPageVideo
     * @apiHeader {String} Authorization
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully get pagevideo Details",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/pagevideo/:id
     * @apiErrorExample {json} pagevideo error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/:id')
    @Authorized()
    public async pageVideoDetails(@Param('id') Id: number, @Res() response: any): Promise<any> {

        const pageVideoSearch = await this.pageVideoService.findOne({
            where: { id: Id },
        });

        if (!pageVideoSearch) {
            const errorResponse = ResponceUtil.getErrorResponce('invalid pagevideo id', pageVideoSearch);
            return response.status(400).send(errorResponse);
        }
        if (!pageVideoSearch) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable to got pagevideo', undefined);
            return response.status(400).send(errorResponse);

        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully got pagevideo', pageVideoSearch);
            return response.status(200).send(successResponse);
        }
    }

    /**
     * @api {post} /api/admin/pagevideo/search Search pagevideo API
     * @apiGroup AdminMainPageVideo
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
     *    "message": "Successfully get pagevideo search",
     *    "data":{
     *     }
     *    "status": "1"
     *  }
     * @apiSampleRequest /api/admin/pagevideo/search
     * @apiErrorExample {json} pagevideo error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/search')
    @Authorized()
    public async pageVideoSearch(@Body({ validate: true }) filter: SearchFilter, @Res() response: any): Promise<any> {
        const pageVideoLists: any = await this.pageVideoService.search(filter);

        if (!pageVideoLists) {        
            const errorResponse = ResponceUtil.getErrorResponce('Unable to search pagevideo', pageVideoLists);
            return response.status(400).send(errorResponse);

        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully search pagevideo', pageVideoLists);
            return response.status(200).send(successResponse);
        }
    }

    // Log pagevideo API
    /**
     * @api {post} /api/admin/pagevideo/log/search Search pagevideo log api
     * @apiGroup AdminMainPageVideo
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
     *      "message": "Successfully get pagevideo list",
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
     * @apiSampleRequest /api/admin/pagevideo/log/search
     * @apiErrorExample {json} Page error
     * HTTP/1.1 500 Internal Server Error
     */
     @Post('/log/search')
    @Authorized()
    public async logDebate(@Body({ validate: true }) searchFilter: SearchFilter, @Res() response: any): Promise<any> {
        
        const pagevideoLogList = await this.mpVideoLogsService.search(searchFilter);
        if (pagevideoLogList) {
            const successRes: any = ResponceUtil.getSucessResponce('Successfully got pagevideo log.', pagevideoLogList);
            return response.status(200).send(successRes);
        } else {
            const errorResponse: any = ResponceUtil.getErrorResponce('Error get pagevideo log list.', undefined);
            return response.status(400).send(errorResponse);
        }
    }
}
