import { JsonController, Authorized, Get, Res, Post, Body, Param, Put, Delete, Req } from 'routing-controllers';
import { TagService } from '../../services/TagService';
import { CreateTagRequest } from '../requests/CreateTagRequest';
import { Tag } from '../../models/Tag';
import { UpdateTagRequest } from '../requests/UpdateTagRequest';
import { SearchFilter } from '../requests/SearchFilterRequest';
// import { classToPlain } from 'class-transformer';
import { ResponceUtil } from '../../../utils/ResponceUtil';

@JsonController('/admin/tag')
export class AdminTagController {
    constructor(private tagService: TagService) {

    }
    /**
     * @api {post} /api/admin/tag/ Create Tag API
     * @apiGroup AdminTag
     * @apiParam (Request body) {String} name name
     * @apiParam (Request body) {String} description description
     * @apiHeader {String} Authorization
     * @apiParamExample {json} Input
     * {
     *      "name" : "",
     *      "description" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "New Tag is created successfully",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/tag/
     * @apiErrorExample {json} tag error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/')
    @Authorized()
    public async createTags(@Body({ validate: true }) tags: CreateTagRequest, @Res() response: any, @Req() request: any): Promise<any> {
        const tagValue = new Tag();
       
        const tagname = await this.tagService.findOne({
            where: {
                name: tags.name,
            },
        });
        if (tagname) {
            const errorResponse = ResponceUtil.getErrorResponce('Duplicate tag name', tagname);
            return response.status(400).send(errorResponse);

        }
        tagValue.name = tags.name;
        tagValue.description = tags.description;
        tagValue.createdByUsername = request.user.username;
        tagValue.createdBy = request.user.id;

        const saveTag = await this.tagService.create(tagValue);
        if (!saveTag) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable to create tag', undefined);
            return response.status(400).send(errorResponse);
        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully create tag', saveTag);
            return response.status(200).send(successResponse);
        }

    }
    /**
     * @api {put} /api/admin/tag/:id Edit Tag API
     * @apiGroup AdminTag
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {String} name Tag name
     * @apiParam (Request body) {String} description description
     * @apiParamExample {json} Input
     * {
     *      "name" : "",
     *      "description" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully edit tag.",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/tag/:id
     * @apiErrorExample {json} tag error
     * HTTP/1.1 500 Internal Server Error
     */
    @Put('/:id')
    @Authorized()
    public async editTag(@Body({ validate: true }) tagStatus: UpdateTagRequest, @Param('id') Id: number, @Res() response: any, @Req() request: any): Promise<any> {
        const tagEdit = await this.tagService.findOne({
            where: {
                id: Id,
            },
        });
        if (!tagEdit) {
            const errorResponse = ResponceUtil.getErrorResponce('invalid tagid', tagEdit);
            return response.status(400).send(errorResponse);

        }
        tagEdit.name = tagStatus.name;
        tagEdit.description = tagStatus.description;

        tagEdit.modifiedByUsername = request.user.username;
        tagEdit.modifiedBy = request.user.id;

        const tagSave = await this.tagService.create(tagEdit);
        if (!tagSave) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable to edit tag', undefined);
            return response.status(400).send(errorResponse);

        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully edit tag', tagSave);
            return response.status(200).send(successResponse);
        }

    }
    /**
     * @api {delete} /api/admin/tag/:id Delete Tag API
     * @apiGroup AdminTag
     * @apiHeader {String} Authorization
     * @apiParamExample {json} Input
     * {
     *      "id" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     * "message": "Successfully deleted tag.",
     * "status": "1"
     * }
     * @apiSampleRequest /api/admin/tag/:id
     * @apiErrorExample {json} tagDelete error
     * HTTP/1.1 500 Internal Server Error
     */
    @Delete('/:id')
    @Authorized()
    public async deleteTag(@Param('id') Id: any, @Res() response: any, @Req() request: any): Promise<any> {
        const tag = await this.tagService.findOne({
            where: {
                id: Id,
            },
        });
        if (!tag) {
            const errorResponse = ResponceUtil.getErrorResponce('invalid tagid', tag);
            return response.status(400).send(errorResponse);
        }
        const deleteTag = await this.tagService.delete(Id);
        if (!deleteTag) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable to delete tag', undefined);
            return response.status(400).send(errorResponse);

        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully delete tag', Id);
            return response.status(200).send(successResponse);
        }
    }
    /**
     * @api {get} /api/admin/tag/:id  Find Tag API
     * @apiGroup AdminTag
     * @apiHeader {String} Authorization
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     * "message": "Successfully get Tag Details",
     * "data":{
     * "name" : "",
     * "description" : "",
     * }
     * "status": "1"
     * }
     * @apiSampleRequest /api/admin/tag/:id
     * @apiErrorExample {json} tag error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/:id')
    @Authorized()
    public async tagDetails(@Param('id') Id: number, @Res() response: any): Promise<any> {

        const tagSearch = await this.tagService.findOne({
            where: { id: Id },
        });
        if (!tagSearch) {
            const errorResponse = ResponceUtil.getErrorResponce('invalid tagid', tagSearch);
            return response.status(400).send(errorResponse);
        }
        if (!tagSearch) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable to got tag', undefined);
            return response.status(400).send(errorResponse);

        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully got tag', tagSearch);
            return response.status(200).send(successResponse);
        }
    }
    /**
     * @api {post} /api/admin/tag/search Search Tag API
     * @apiGroup AdminTag
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
    public async tagSearch(@Body({ validate: true }) filter: SearchFilter, @Res() response: any): Promise<any> {
        const tagLists: any = await this.tagService.search(filter.limit, filter.offset, filter.select, filter.relation, filter.whereConditions, filter.orderBy, filter.count);

        if (!tagLists) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable to search tag', undefined);
            return response.status(400).send(errorResponse);

        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully search tag', tagLists);
            return response.status(200).send(successResponse);
        }
    }
}
