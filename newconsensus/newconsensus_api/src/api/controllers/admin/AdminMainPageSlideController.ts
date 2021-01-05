import 'reflect-metadata';
import { Get, JsonController, Res, Param, Post, Body, Authorized, Delete, Put, Req } from 'routing-controllers';
import { SearchFilter } from '../requests/SearchFilterRequest';
import { ResponceUtil } from '../../../utils/ResponceUtil';
import { MainPageSlideService } from '../../services/MainPageSlideService';
import { CreateMainPageSlide } from '../requests/CreateMainPageSlideRequest';
import { MainPageSlide } from '../../models/MainPageSlide';
import { MainPageSlideLogs } from '../../models/MainPageSlideLogs';
import { MAINPAGE_SLIDE_LOG_ACTION } from '../../../LogsStatus';
import { MainPageSlideLogsService } from '../../services/MainPageSlideLogsService';
import { UpdateMainPageSlide } from '../requests/UpdateMainPageSlide';
import { UserService } from '../../services/UserService';
import { OrderingMainPageSlide } from '../requests/OrderingMainPageSlide';
import moment = require('moment/moment');

@JsonController('/admin/pageslide')
export class AdminMainPageSlideController {
    constructor(private pageSlideService: MainPageSlideService, private mpSlideLogsService: MainPageSlideLogsService, private userService: UserService) {

    }

    // Create MainPageSlide API
    /**
     * @api {post} /api/admin/pageslide Create MainPageSlide
     * @apiGroup AdminMainPageSlide
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {String} videoUrl videoUrl
     * @apiParam (Request body) {String} imageUrl imageUrl
     * @apiParam (Request body) {String} ordering ordering
     * @apiParam (Request body) {String} delayMilisec delayMilisec
     * @apiParam (Request body) {boolean} isAutoPlay isAutoPlay
     * @apiParamExample {json} Input
     * {
     *      "videoUrl" : "",
     *      "imageUrl" : "",
     *      "ordering" : "",
     *      "delayMilisec" : "",
     *      "isAutoPlay" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "New MainPageSlide is created successfully",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/pageslide
     * @apiErrorExample {json} MainPageSlide error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/')
    @Authorized()
    public async createPageSlide(@Body({ validate: true }) mpSlideParam: CreateMainPageSlide, @Req() req: any, @Res() response: any): Promise<any> {
        const mpSlide = new MainPageSlide();
        mpSlide.videoUrl = mpSlideParam.videoUrl;
        mpSlide.imageUrl = mpSlideParam.imageUrl;
        mpSlide.ordering = mpSlideParam.ordering;
        mpSlide.delayMiliSec = mpSlideParam.delayMilisec;
        mpSlide.isAutoPlay = mpSlideParam.isAutoPlay;
        mpSlide.createdBy = req.user.id;
        mpSlide.createdByUsername = req.user.username;

        const mpSlideCreated = await this.pageSlideService.create(mpSlide);
        if (mpSlideCreated) {
            const mpSlideLogs = new MainPageSlideLogs();
            mpSlideLogs.userId = req.user.id;
            mpSlideLogs.action = MAINPAGE_SLIDE_LOG_ACTION.CREATE;
            mpSlideLogs.detail = JSON.stringify(mpSlideCreated);

            const pageSlideLogs = await this.mpSlideLogsService.create(mpSlideLogs);

            if (pageSlideLogs) {
                return response.status(200).send(ResponceUtil.getSucessResponce('Create MainPageSlide Successful', mpSlideCreated));
            }
        } else {
            return response.status(400).send(ResponceUtil.getErrorResponce('Cannot Create MainPageSlide', undefined));
        }
    }

    /**
     * @api {put} /api/admin/pageslide/:id EditMainPageSlide
     * @apiGroup AdminMainPageSlide
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {String} videoUrl videoUrl
     * @apiParam (Request body) {String} imageUrl imageUrl
     * @apiParam (Request body) {String} ordering ordering
     * @apiParam (Request body) {String} delayMilisec delayMilisec
     * @apiParam (Request body) {boolean} isAutoPlay isAutoPlay
     * @apiParamExample {json} Input
     * {
     *      "videoUrl" : "",
     *      "imageUrl" : "",
     *      "ordering" : "",
     *      "delayMilisec" : "",
     *      "isAutoPlay" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully edit Page Slide.",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/pageslide/:id
     * @apiErrorExample {json} Page Slide error
     * HTTP/1.1 500 Internal Server Error
     */
    @Put('/:id')
    @Authorized()
    public async editPageSlide(@Body({ validate: true }) pageSlideEdit: UpdateMainPageSlide, @Param('id') Id: number, @Res() response: any, @Req() req: any): Promise<any> {
        const data = await this.pageSlideService.findOne({
            where: {
                id: Id,
            },
        });

        if (!data) {
            return response.status(400).send(ResponceUtil.getErrorResponce('invalid Page Slide id', undefined));
        }

        data.videoUrl = pageSlideEdit.videoUrl;
        data.imageUrl = pageSlideEdit.imageUrl;
        data.ordering = pageSlideEdit.ordering;
        data.delayMilliSec = pageSlideEdit.delayMiliSec;
        data.isAutoPlay = pageSlideEdit.isAutoPlay;
        data.modifiedByUsername = req.user.username;
        data.modifiedBy = req.user.id;

        const pageSlideEdited = await this.pageSlideService.create(data);

        if (!pageSlideEdited) {
            return response.status(400).send(ResponceUtil.getErrorResponce('Unable to edit Page Slide', undefined));
        } else {
            const mpSlideLogs = new MainPageSlideLogs();
            mpSlideLogs.userId = req.user.id;
            mpSlideLogs.action = MAINPAGE_SLIDE_LOG_ACTION.EDIT;
            mpSlideLogs.detail = JSON.stringify(pageSlideEdited);

            const pageSlideLogs = await this.mpSlideLogsService.create(mpSlideLogs);

            if (pageSlideLogs) {
                return response.status(200).send(ResponceUtil.getSucessResponce('Create MainPageSlide Successful', pageSlideEdited));
            }
        }
    }

    /**
     * @api {put} /api/admin/pageslide/ordering orderingPageSlide
     * @apiGroup AdminMainPageSlide
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {String} videoUrl videoUrl
     * @apiParam (Request body) {String} imageUrl imageUrl
     * @apiParam (Request body) {String} ordering ordering
     * @apiParam (Request body) {String} delayMilisec delayMilisec
     * @apiParam (Request body) {boolean} isAutoPlay isAutoPlay
     * @apiParamExample {json} Input
     * {
     *      "videoUrl" : "",
     *      "imageUrl" : "",
     *      "ordering" : "",
     *      "delayMilisec" : "",
     *      "isAutoPlay" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully edit Page Slide.",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/pageslide/ordering orderingPageSlide
     * @apiErrorExample {json} Page Slide error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/ordering')
    @Authorized()
    public async orderingPageSlide(@Body() orderingPageSlide: OrderingMainPageSlide, @Res() response: any, @Req() request: any): Promise<any> {
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

            const data = orderingPageSlide.data;

            if (data !== null && data !== undefined && data.length > 0) {

                const pageSlideOrderingMap: any = {};
                let idStmt = '';

                const searchFilterSetNull = new SearchFilter();
                searchFilterSetNull.whereConditions = 'ordering is not null';
                const pageSlideSetNulls: MainPageSlide[] = await this.pageSlideService.search(searchFilterSetNull);

                for (let item of pageSlideSetNulls) {
                    item.ordering = null;
                    item.modifiedBy = request.user.id;
                    item.modifiedByUsername = request.user.username;
                    item.modifiedDate = moment().toDate();

                    item = await this.pageSlideService.update(item.id, item);
                }

                for (let i = 0; i < data.length; i++) {
                    const pageSlideId: string = data[i].id;
                    const ordering: number = data[i].ordering;

                    if (pageSlideId === undefined || pageSlideId === '') {
                        continue;
                    }

                    if (ordering === undefined) {
                        continue;
                    }

                    idStmt += '' + pageSlideId + ', ';

                    pageSlideOrderingMap[pageSlideId] = ordering;
                }

                if (idStmt !== '') {
                    idStmt = 'id in(' + idStmt.substr(0, idStmt.length - 2) + ')';
                }

                const searchFilter = new SearchFilter();
                searchFilter.whereConditions = idStmt;

                const pageSlides: MainPageSlide[] = await this.pageSlideService.search(searchFilter);
                const pageSlideResult: MainPageSlide[] = [];

                for (let item of pageSlides) {
                    const id: string = item.id + '';

                    if (pageSlideOrderingMap[id] !== undefined) {
                        const ordering: number = pageSlideOrderingMap[id];
                        item.ordering = ordering;
                        item.modifiedBy = request.user.id;
                        item.modifiedByUsername = request.user.username;
                        item.modifiedDate = moment().toDate();

                        item = await this.pageSlideService.update(item.id, item);

                        pageSlideResult.push(item);
                    } else {
                        item.ordering = null;
                        item.modifiedBy = request.user.id;
                        item.modifiedByUsername = request.user.username;
                        item.modifiedDate = moment().toDate();

                        await this.pageSlideService.update(item.id, item);
                    }
                }
                return response.status(200).send(ResponceUtil.getSucessResponce('Ordering Page Slide  Success', pageSlideResult));
            } else {
                if (data && data.length <= 0) {
                    const pageSlideResult: MainPageSlide[] = [];
                    const whereConditions = 'ordering is not null';
                    const searchFilter = new SearchFilter();
                    searchFilter.whereConditions = whereConditions;
                    const pageSlides: MainPageSlide[] = await this.pageSlideService.search(searchFilter);

                    for (let item of pageSlides) {
                        item.ordering = null;
                        item.modifiedBy = request.user.id;
                        item.modifiedByUsername = request.user.username;
                        item.modifiedDate = moment().toDate();

                        item = await this.pageSlideService.update(item.id, item);
                        pageSlideResult.push(item);
                    }

                    return response.status(200).send(ResponceUtil.getSucessResponce('UnOrdering all Page Slide Success', pageSlideResult));
                } else {
                    return response.status(400).send(ResponceUtil.getErrorResponce('No Page Slide Found', undefined));
                }
            }
        } catch (error) {
            return response.status(400).send(error);
        }
    }

    /**
     * @api {delete} /api/admin/pageslide/:id DeleteMainPageSlide
     * @apiGroup AdminMainPageSlide
     * @apiHeader {String} Authorization
     * @apiParamExample {json} Input
     * {
     *      "id" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     * "message": "Successfully deleted Page Slide.",
     * "status": "1"
     * }
     * @apiSampleRequest /api/admin/pageslide/:id
     * @apiErrorExample {json} pageSlideDelete error
     * HTTP/1.1 500 Internal Server Error
     */
    @Delete('/:id')
    @Authorized()
    public async deletePageSlide(@Param('id') Id: any, @Res() response: any, @Req() req: any): Promise<any> {
        const pageSlide = await this.pageSlideService.findOne({
            where: {
                id: Id,
            },
        });

        if (!pageSlide) {
            return response.status(400).send(ResponceUtil.getErrorResponce('Invalid MainPageSlide Id', undefined));
        }

        const deleteSlide = await this.pageSlideService.delete(Id);
        if (!deleteSlide) {
            return response.status(400).send(ResponceUtil.getErrorResponce('Unable to Delete MainPageSlide', undefined));
        } else {
            const mpSlideLogs = new MainPageSlideLogs();
            mpSlideLogs.userId = req.user.id;
            mpSlideLogs.action = MAINPAGE_SLIDE_LOG_ACTION.DELETE;
            mpSlideLogs.detail = JSON.stringify(deleteSlide);

            const pageSlideLogs = await this.mpSlideLogsService.create(mpSlideLogs);

            if (pageSlideLogs) {
                return response.status(200).send(ResponceUtil.getSucessResponce('Delete MainPageSlide Successful', deleteSlide));
            }
        }
    }

    /**
     * @api {get} /api/admin/pageslide/:id  FindMainPageSlide
     * @apiGroup AdminMainPageSlide
     * @apiHeader {String} Authorization
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully get Page Slide Details",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/pageslide/:id
     * @apiErrorExample {json} Page Slide error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/:id')
    @Authorized()
    public async pageSlideDetails(@Param('id') Id: number, @Res() response: any): Promise<any> {
        const pageSlideSearch = await this.pageSlideService.findOne({
            where: { id: Id },
        });

        if (!pageSlideSearch) {
            const errorResponse = ResponceUtil.getErrorResponce('invalid Page Slide id', pageSlideSearch);
            return response.status(400).send(errorResponse);
        }

        if (!pageSlideSearch) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable to got Page Slide', undefined);
            return response.status(400).send(errorResponse);

        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully got Page Slide', pageSlideSearch);
            return response.status(200).send(successResponse);
        }
    }

    /**
     * @api {post} /api/admin/pageslide/search SearchMainPageSlide
     * @apiGroup AdminMainPageSlide
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
     *    "message": "Successfully get Page Slide search",
     *    "data":{
     *     }
     *    "status": "1"
     *  }
     * @apiSampleRequest /api/admin/pageslide/search
     * @apiErrorExample {json} Page Slide error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/search')
    @Authorized()
    public async pageSlideSearch(@Body({ validate: true }) filter: SearchFilter, @Res() response: any): Promise<any> {
        const pageSlideLists: any = await this.pageSlideService.search(filter);

        if (!pageSlideLists) {
            return response.status(400).send(ResponceUtil.getErrorResponce('Unable to search Page Slide', undefined));
        } else {
            return response.status(200).send(ResponceUtil.getSucessResponce('Successfully search Page Slide', pageSlideLists));
        }
    }

    // Log pageslide API
    /**
     * @api {post} /api/admin/pageslide/log/search SearchMainPageSlideLog
     * @apiGroup AdminMainPageSlide
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
     *      "message": "Successfully get pageslide list",
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
     * @apiSampleRequest /api/admin/pageslide/log/search
     * @apiErrorExample {json} Page error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/log/search')
    @Authorized()
    public async logDebate(@Body({ validate: true }) searchFilter: SearchFilter, @Res() response: any): Promise<any> {

        const pageslideLogList = await this.mpSlideLogsService.search(searchFilter);
        if (pageslideLogList) {
            const successRes: any = ResponceUtil.getSucessResponce('Successfully got pageslide log.', pageslideLogList);
            return response.status(200).send(successRes);
        } else {
            const errorResponse: any = ResponceUtil.getErrorResponce('Error get pageslide log list.', undefined);
            return response.status(400).send(errorResponse);
        }
    }
}
