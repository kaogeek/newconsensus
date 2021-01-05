import { PageContentService } from '../../services/PageContentService';
import { Get, Res, Post, Body, Authorized, Put, Param, JsonController, Req, Delete } from 'routing-controllers';
import { CreatePageContentRequest } from '../requests/CreatePageContentRequest';
import { PageContent } from '../../models/PageContent';
import { UpdatePageContent } from '../requests/UpdatePageContentRequest';
import { SearchFilter } from '../requests/SearchFilterRequest';
import { ResponceUtil } from '../../../utils/ResponceUtil';
import { PageContentImage } from '../../../api/models/PageContentImage';

@JsonController('/admin/content')
export class AdminPageContentController {
    constructor(private pageService: PageContentService) {
    }
    /**
     * @api {post} /api/admin/content/ Create PageContent API
     * @apiGroup AdminPageContent
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {String} title title
     * @apiParam (Request body) {String} content content
     * @apiParam (Request body) {String} metaTagContent metaTagContent
     * @apiParam (Request body) {String} metaTagKeyword metaTagKeyword
     * @apiParam (Request body) {String} metaTagTitle metaTagTitle
     * @apiParam (Request body) {boolean} isDraft isDraft (0=false, 1=true)
     * @apiParam (Request body) {String} coverImage coverImage
     * @apiParam (Request body) {String} videoUrl videoUrl
     * @apiParam (Request body) {String} link link
     * @apiParam (Request body) {String[]} tagId tagId
     * @apiParam (Request body) {String} imageUrl imageUrl
     * @apiParam (Request body) {String} description description
     * @apiHeader {String} Authorization
     * @apiParamExample {json} Input
     * {
     *      "title" : "",
     *      "content" : "",
     *      "metaTagContent" : "",
     *      "metaTagKeyword" : "",
     *      "metaTagTitle" : "",
     *      "coverImage" : "",
     *      "videoUrl" : "",
     *      "link" : "",
     *      "tagId" : "",
     *      "imageUrl" : "",
     *      "description" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "New Content is created successfully",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/content/
     * @apiErrorExample {json} pageContent error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/')
    @Authorized()
    public async createPageContent(@Body({ validate: true }) pages: CreatePageContentRequest, @Res() response: any, @Req() request: any): Promise<any> {
        const pageValue: any = new PageContent();
        const getValue = this.pageService.getCheckIsDraft(pages.isDraft);
        const pattern = new RegExp('^(https?|http?)://');

        if (pages.imageUrl !== null && pages.imageUrl !== undefined && pages.imageUrl !== '') {
            if (!pattern.test(pages.imageUrl)) {
                return response.status(400).send(ResponceUtil.getErrorResponce('invalid pattern link image url', undefined));
            }
        }

        if (pages.coverImage !== null && pages.coverImage !== undefined && pages.imageUrl !== '') {
            if (!pattern.test(pages.coverImage)) {
                return response.status(400).send(ResponceUtil.getErrorResponce('invalid pattern link cover image', undefined));
            }
        }
        let tag;
        pageValue.title = pages.title;
        pageValue.content = pages.content;
        pageValue.metaTagContent = pages.metaTagContent;
        pageValue.metaTagKeyword = pages.metaTagKeyword;
        pageValue.metaTagTitle = pages.metaTagTitle;
        pageValue.isDraft = getValue;
        pageValue.coverImage = pages.coverImage;
        pageValue.videoUrl = pages.videoUrl;
        pageValue.link = pages.link;
        pageValue.description = pages.description;
        pageValue.createdByUsername = request.user.username;
        pageValue.createdBy = request.user.id;
        pageValue.viewCount = 0;
        tag = this.pageService.getCheckTagId(pages.tagId);

        tag = JSON.parse(tag);

        const newPageContentImages: any = new PageContentImage();
        // newPageContentImages.pageId = savePage.id;
        newPageContentImages.imageUrl = pages.imageUrl;

        const savePage = await this.pageService.create(request.user, pageValue, tag, newPageContentImages);

        if (!savePage) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable to create pagecontent', undefined);
            return response.status(400).send(errorResponse);

        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully create pagecontent', savePage);
            return response.status(200).send(successResponse);
        }
    }
    /**
     * @api {put} /api/admin/content/:id Edit PageContent API
     * @apiGroup AdminPageContent
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {String} title PageContent title
     * @apiParam (Request body) {String} content content
     * @apiParam (Request body) {String} metaTagContent metaTagContent
     * @apiParam (Request body) {String} metaTagKeyword metaTagKeyword
     * @apiParam (Request body) {String} metaTagTitle metaTagTitle
     * @apiParam (Request body) {boolean} isDraft isDraft (0=false, 1=true)
     * @apiParam (Request body) {String} coverImage coverImage
     * @apiParam (Request body) {String} videoUrl videoUrl
     * @apiParam (Request body) {String[]} tagId tagId
     * @apiParam (Request body) {String} link link
     * @apiParam (Request body) {String} imageUrl imageUrl
     * @apiParam (Request body) {String} description description
     * @apiParamExample {json} Input
     * {
     *      "title" : "",
     *      "content" : "",
     *      "metaTagContent" : "",
     *      "metaTagKeyword" : "",
     *      "metaTagTitle" : "",
     *      "isDraft" : "",
     *      "coverImage" : "",
     *      "videoUrl" : "",
     *      "tagId" : "",
     *      "link" : "",
     *      "imageUrl" : "",
     *      "description" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully edit room.",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin/content/:id
     * @apiErrorExample {json} pageContent error
     * HTTP/1.1 500 Internal Server Error
     */
    @Put('/:id')
    @Authorized()
    public async editContent(@Body({ validate: true }) page: UpdatePageContent, @Param('id') pageId: number, @Res() response: any, @Req() request: any): Promise<any> {

        const pageEdit = await this.pageService.findOne({
            relations: ['pageHasTag', 'pageImages'],
            where: {
                id: pageId,
            },
        });
        if (!pageEdit) {
            const errorResponse = ResponceUtil.getErrorResponce('invalid pagecontentid', pageEdit);
            return response.status(400).send(errorResponse);
        }
        const pattern = new RegExp('^(https?|http?)://');

        if (page.imageUrl !== null && page.imageUrl !== undefined && page.imageUrl !== '') {
            if (!pattern.test(page.imageUrl)) {
                return response.status(400).send(ResponceUtil.getErrorResponce('invalid pattern link image url', undefined));
            }
        }

        if (page.coverImage !== null && page.coverImage !== undefined && page.coverImage !== '') {
            if (!pattern.test(page.coverImage)) {
                return response.status(400).send(ResponceUtil.getErrorResponce('invalid pattern link cover image', undefined));
            }
        }
        let tag;
        pageEdit.title = page.title;
        pageEdit.content = page.content;
        pageEdit.metaTagContent = page.metaTagContent;
        pageEdit.metaTagKeyword = page.metaTagKeyword;
        pageEdit.metaTagTitle = page.metaTagTitle;
        pageEdit.coverImage = page.coverImage;
        pageEdit.videoUrl = page.videoUrl;
        pageEdit.link = page.link;
        pageEdit.description = page.description;
        pageEdit.modifiedByUsername = request.user.username;
        pageEdit.modifiedBy = request.user.id;
        tag = await this.pageService.getCheckTagId(page.tagId);
        tag = JSON.parse(tag);
        const pageSave = await this.pageService.update(request.user, pageEdit ,tag,page);
        delete pageSave.user;

        if (!pageSave) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable to edit pagecontent', undefined);
            return response.status(400).send(errorResponse);

        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully edit pagecontent', pageSave);
            return response.status(200).send(successResponse);
        }
    }
    /**
     * @api {delete} /api/admin/content/:id Delete PageContent  API
     * @apiGroup AdminPageContent
     * @apiHeader {String} Authorization
     * @apiParamExample {json} Input
     * {
     *      "id" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     *      {
     *      "message": "Successfully deleted content.",
     *      "status": "1"
     *      }
     * @apiSampleRequest /api/admin/content/:id
     * @apiErrorExample {json} contentDelete error
     * HTTP/1.1 500 Internal Server Error
     */
    @Delete('/:id')
    @Authorized()
    public async deleteTag(@Param('id') Id: number, @Res() response: any, @Req() request: any): Promise<any> {
        const content = await this.pageService.findOne({
            where: {
                id: Id,
            },

        });
        if (!content) {
            const errorResponse = ResponceUtil.getErrorResponce('invalid contentid', content);
            return response.status(400).send(errorResponse);
        }
        const deleteTag = await this.pageService.delete(Id);
        if (!deleteTag) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable to delete content', undefined);
            return response.status(400).send(errorResponse);

        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully delete content', Id);
            return response.status(200).send(successResponse);
        }
    }
    /**
     * @api {get} /api/admin/content/:id Find PageContent API
     * @apiGroup AdminPageContent
     * @apiHeader {String} Authorization
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     * "message": "Successfully get pageContent Details",
     * "data":{
     * "name" : "",
     * "description" : "",
     * }
     * "status": "1"
     * }
     * @apiSampleRequest /api/admin/content/:id
     * @apiErrorExample {json} content error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/:id')
    @Authorized()
    public async pageContentDetails(@Param('id') Id: number, @Res() response: any): Promise<any> {

        const pageGet = await this.pageService.findOne({
            relations: ['pageImages'],
            where: {
                id: Id,
            },
        });
        if (!pageGet) {
            const errorResponse = ResponceUtil.getErrorResponce('invalid pagecontentid', pageGet);
            return response.status(400).send(errorResponse);
        }
        if (!pageGet) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable to find pagecontent', undefined);
            return response.status(400).send(errorResponse);

        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully find pagecontent', pageGet);
            return response.status(200).send(successResponse);
        }

    }
    /**
     * @api {post} /api/admin/content/search Search content API
     * @apiGroup AdminPageContent
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
     *    "message": "Successfully get pageContent search",
     *    "data":{
     *     }
     *    "status": "1"
     *  }
     * @apiSampleRequest /api/admin/content/search
     * @apiErrorExample {json} pageContent error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/search')
    @Authorized()
    public async pageSearch(@Body({ validate: true }) filter: SearchFilter, @Res() response: any): Promise<any> {
        const content: any = await this.pageService.search(filter.limit, filter.offset, filter.select, filter.relation, filter.whereConditions, filter.orderBy, filter.count);

        if (!content) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable to search pagecontent', undefined);
            return response.status(400).send(errorResponse);

        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully search pagecontent', content);
            return response.status(200).send(successResponse);
        }
    }
}
