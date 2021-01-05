/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import 'reflect-metadata';
import {JsonController, Res, Req, Body , Post} from 'routing-controllers';
import {MAILService} from '../../../auth/mail.services';
// import {classToPlain} from 'class-transformer';
// import arrayToTree from 'array-to-tree';
import {ContactService} from '../../services/ContactService';
import {ContactRequest} from './requests/ContactRequest';
import {EmailTemplateService} from '../../services/EmailTemplateService';
import {UserService} from '../../services/UserService';
import { Contact } from '../../models/Contact';

@JsonController('/list')
export class CommonListController {
    constructor(private contactService: ContactService,
                private emailTemplateService: EmailTemplateService,
                private userService: UserService
                 ) {
    }

    // Category List Tree API
    /**
     * @api {get} /api/list/category-list Category List Tree API
     * @apiGroup Store List
     * @apiParam (Request body) {Number} limit Limit
     * @apiParam (Request body) {Number} offset Offset
     * @apiParam (Request body) {String} keyword keyword
     * @apiParam (Request body) {Number} sortOrder sortOrder
     * @apiParam (Request body) {Number} count count in number or boolean
     * @apiParamExample {json} Input
     * {
     *      "limit" : "",
     *      "offset": "",
     *      "keyorder": "",
     *      "sortOrder": "",
     *      "count": "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "category list shown successfully..!",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/list/category-list
     * @apiErrorExample {json} Category List error
     * HTTP/1.1 500 Internal Server Error
     */
    // Category List Function
    // @Get('/category-list')
    // public async ParentCategoryList(@QueryParam('limit') limit: number, @QueryParam('offset') offset: number, @QueryParam('keyword') keyword: string, @QueryParam('sortOrder') sortOrder: number, @QueryParam('count') count: number | boolean, @Req() request: any, @Res() response: any): Promise<any> {
    //     const select = ['categoryId', 'name', 'parentInt', 'sortOrder', 'metaTagTitle', 'metaTagDescription', 'metaTagKeyword', 'isActive'];
    //     const search = [
    //         {
    //             name: 'name',
    //             op: 'like',
    //             value: keyword,
    //         }, {
    //             name: 'isActive',
    //             op: 'where',
    //             value: 1,
    //         },  {
    //             name: 'parentInt',
    //             op: 'where',
    //             value: 0,
    //         },
    //     ];
    //     const WhereConditions = [];
    //     const categoryData = await this.categoryService.list(limit, offset, select, search, WhereConditions, sortOrder, count);
    //     if (count) {
    //         const successResponse: any = {
    //             status: 1,
    //             message: 'Successfully get All category List',
    //             data: categoryData,
    //         };
    //         return response.status(200).send(successResponse);
    //     } else {
    //         const category = categoryData.map(async ( value: any) => {
    //             const tempVal: any = value;
    //             const child = await this.categoryService.find({where: { parentInt : value.categoryId, isActive : 1},
    //                 select: ['categoryId', 'name',  'parentInt', 'sortOrder', 'metaTagTitle', 'metaTagDescription', 'metaTagKeyword', 'isActive']});
    //             const children = child.map(async ( val: any) => {
    //                 const data: any = val;
    //                 const subChild = await this.categoryService.find({where: { parentInt : val.categoryId, isActive : 1},
    //                     select: ['categoryId', 'name', 'parentInt', 'sortOrder', 'metaTagTitle', 'metaTagDescription', 'metaTagKeyword', 'isActive']});
    //                 if (subChild.length > 0) {
    //                     data.children = subChild;
    //                     return data;
    //                 }
    //                 return data;
    //             });
    //             const childrenData = await Promise.all(children);
    //             tempVal.children = childrenData;
    //             return tempVal;
    //         });
    //         const result = await Promise.all(category);
    //         console.log(result);
    //         if (result) {
    //             const successResponse: any = {
    //                 status: 1,
    //                 message: 'Successfully got the list of categories.',
    //                 data: result,
    //             };
    //             return response.status(200).send(successResponse);
    //         }
    //     }
    // }

    // Product List API
    /**
     * @api {get} /api/list/productlist Product List API
     * @apiGroup Store List
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {Number} limit limit
     * @apiParam (Request body) {Number} offset offset
     * @apiParam (Request body) {String} manufacturerId manufacturerId
     * @apiParam (Request body) {String} categoryId categoryId
     * @apiParam (Request body) {Number} priceFrom price from you want to list
     * @apiParam (Request body) {Number} priceTo price to you want to list
     * @apiParam (Request body) {Number} price orderBy 0->desc 1->asc
     * @apiParam (Request body) {Number} condition  1->new 2->used
     * @apiParam (Request body) {String} keyword keyword
     * @apiParam (Request body) {String} count count in boolean or number
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "status": "1"
     *      "message": "Successfully get product list",
     *      "data":"{}"
     * }
     * @apiSampleRequest /api/list/productlist
     * @apiErrorExample {json} productList error
     * HTTP/1.1 500 Internal Server Error
     */
    // @Get('/productlist')
    // public async productList(@QueryParam('limit') limit: number, @QueryParam('offset') offset: number, @QueryParam('keyword') keyword: string,
    //                          @QueryParam('manufacturerId') manufacturerId: string, @QueryParam('categoryId') categoryId: string, @QueryParam('priceFrom') priceFrom: string,
    //                          @QueryParam('priceTo') priceTo: string, @QueryParam('price') price: number, @QueryParam('condition') condition: number, @QueryParam('count') count: number | boolean, @Req() request: any, @Res() response: any): Promise<any> {
    //     console.log(manufacturerId);
    //     const select = ['product.productId', 'product.sku', 'product.name', 'product.quantity', 'product.description', 'product.price',
    //         'product.isActive AS isActive', 'product.manufacturerId AS manufacturerId', 'product.location AS location', 'product.minimumQuantity AS minimumQuantity',
    //         'product.subtractStock', 'product.stockStatusId', 'product.shipping', 'product.sortOrder', 'product.condition',
    //         'product.dateAvailable', 'product.amount', 'product.metaTagTitle', 'product.metaTagDescription', 'product.metaTagKeyword', 'product.discount'];

    //     const searchConditions = [
    //         {
    //             name: 'product.isActive',
    //             op: 'where',
    //             value: 1,
    //         },
    //         {
    //             name: 'product.manufacturerId',
    //             op: 'and',
    //             value: manufacturerId,
    //         },
    //         {
    //             name: 'product.name',
    //             op: 'and',
    //             value: keyword,
    //         },
    //         {
    //             name: 'product.condition',
    //             op: 'andWhere',
    //             value: condition,
    //         },
    //     ];

    //     const whereConditions: any = [{
    //         name: 'product.productId',
    //         op: 'inraw',
    //         value: categoryId,
    //     }];

    //     const productList: any = await this.productService.productList(limit, offset, select, searchConditions, whereConditions, categoryId, priceFrom, priceTo, price, count);
    //     if (count) {
    //         const Response: any = {
    //             status: 1,
    //             message: 'Successfully got Products count',
    //             data: productList,
    //         };
    //         return response.status(200).send(Response);
    //     }
    //     const promises = productList.map(async (result: any) => {
    //         const productToCategory = await this.productToCategoryService.findAll({
    //             select: ['categoryId', 'productId'],
    //             where: {productId: result.productId},
    //         }).then((val) => {
    //             const category = val.map(async (value: any) => {
    //                 const categoryNames = await this.categoryService.findOne({categoryId: value.categoryId});
    //                 const tempValue: any = value;
    //                 tempValue.categoryName = categoryNames.name;
    //                 return tempValue;
    //             });
    //             const results = Promise.all(category);
    //             return results;
    //         });
    //         const productImage = await this.productImageService.findOne({
    //             select: ['productId', 'image', 'containerName', 'defaultImage'],
    //             where: {
    //                 productId: result.productId,
    //                 defaultImage: 1,
    //             },
    //         });
    //         const temp: any = result;
    //         temp.Images = productImage;
    //         temp.Category = productToCategory;
    //         return temp;
    //     });
    //     const finalResult = await Promise.all(promises);
    //     const maximum: any = ['Max(product.price) As maximumProductPrice'];
    //     const maximumPrice: any = await this.productService.productMaxPrice(maximum);
    //     const productPrice: any = maximumPrice.maximumProductPrice;
    //     const successResponse: any = {
    //         status: 1,
    //         message: 'Successfully got the complete list of products.',
    //         data: {
    //             maximumProductPrice: productPrice,
    //             productList: finalResult,
    //         },
    //     };
    //     return response.status(200).send(successResponse);
    // }

    // Custom Product List API
    /**
     * @api {get} /api/list/custom-product-list Custom Product List API
     * @apiGroup Store List
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {Number} limit limit
     * @apiParam (Request body) {Number} offset offset
     * @apiParam (Request body) {Number} manufacturerId manufacturerId
     * @apiParam (Request body) {String} categoryId categoryId
     * @apiParam (Request body) {Number} priceFrom price from you want to list
     * @apiParam (Request body) {Number} priceTo price to you want to list
     * @apiParam (Request body) {String} price ASC OR DESC
     * @apiParam (Request body) {Number} condition  1->new 2->used
     * @apiParam (Request body) {String} keyword keyword
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "status": "1"
     *      "message": "Successfully get product list",
     *      "data":"{}"
     * }
     * @apiSampleRequest /api/list/custom-product-list
     * @apiErrorExample {json} productList error
     * HTTP/1.1 500 Internal Server Error
     */
    // @Get('/custom-product-list')
    // public async customProductList(@QueryParam('limit') limit: number, @QueryParam('offset') offset: number, @QueryParam('keyword') keyword: string,
    //                                @QueryParam('manufacturerId') manufacturerId: number, @QueryParam('categoryId') categoryId: string, @QueryParam('priceFrom') priceFrom: string,
    //                                @QueryParam('priceTo') priceTo: string, @QueryParam('price') price: string, @QueryParam('condition') condition: number, @QueryParam('count') count: number | boolean, @Req() request: any, @Res() response: any): Promise<any> {
    //     return new Promise( async () => {
    //         const productList: any = await this.productService.customProductList(limit, offset, categoryId, manufacturerId, condition, keyword, priceFrom, priceTo, price);
    //         const promises = productList.map(async (result: any) => {
    //            const productImage = await this.productImageService.findOne({
    //                 select: ['productId', 'image', 'containerName', 'defaultImage'],
    //                 where: {
    //                     productId: result.productId,
    //                     defaultImage: 1,
    //                 },
    //             });
    //             const temp: any = result;
    //             temp.Images = productImage;
    //             return temp;
    //         });
    //         const finalResult = await
    //         Promise.all(promises);
    //         const successResponse: any = {
    //             status: 1,
    //             message: 'Successfully got the complete list of products.',
    //             data: finalResult,
    //         };
    //         return response.status(200).send(successResponse);
    //     });
    // }

    // Contact Us API
    /**
     * @api {post} /api/list/contact-us  Contact Us API
     * @apiGroup Store List
     * @apiParam (Request body) {String} name Name
     * @apiParam (Request body) {String} email Email
     * @apiParam (Request body) {String} phoneNumber Phone Number
     * @apiParam (Request body) {String} message Message
     * @apiParamExample {json} Input
     * {
     *      "name" : "",
     *      "email" : "",
     *      "phoneNumber" : "",
     *      "message" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Your mail send to admin..!",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/list/contact-us
     * @apiErrorExample {json} Contact error
     * HTTP/1.1 500 Internal Server Error
     */
    // ContactUs Function
    @Post('/contact-us')
    public async userContact(@Body({validate: true})contactParam: ContactRequest, @Req() request: any, @Res() response: any): Promise<any> {
        const contactInformation = new Contact();
        contactInformation.name = contactParam.name;
        contactInformation.email = contactParam.email;
        contactInformation.phoneNumber = contactParam.phoneNumber;
        contactInformation.message = contactParam.message;
        const informationData = await this.contactService.create(contactInformation);
        const emailContent = await this.emailTemplateService.findOne(3);
        const message = emailContent.content.replace('{name}', informationData.name).replace('{email}', informationData.email).replace('{phoneNumber}', informationData.phoneNumber).replace('{message}', informationData.message);
        const adminId: any = [];
        const adminUser = await this.userService.findAll({select: ['username'], where: {userGroupId : 1}});
            for (const user of adminUser) {
                const val = user.username;
                adminId.push(val);
            }
        const sendMailRes = MAILService.contactMail(message, emailContent.subject, adminId);
        if (sendMailRes) {
            const successResponse: any = {
                status: 1,
                message: 'Your request Successfully send',
            };
            return response.status(200).send(successResponse);
        } else {
            const errorResponse: any = {
                status: 0,
                message: 'Mail does not send',
            };
            return response.status(400).send(errorResponse);
        }
    }

    // Specific parent Category List API
    /**
     * @api {get} /api/list/specific-category-list Specific Category List
     * @apiGroup Store List
     * @apiParam (Request body) {Number} categoryId categoryId
     * @apiParamExample {json} Input
     * {
     *      "parentInt" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Category listed successfully..!",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/list/specific-category-list
     * @apiErrorExample {json} Category List error
     * HTTP/1.1 500 Internal Server Error
     */
    // Category List Function
    // @Get('/specific-category-list')
    // public async SpecificcategoryList( @QueryParam('categoryId') categoryid: number, @Req() request: any, @Res() response: any): Promise<any> {
    //     const categoryDataId = await this.categoryService.findOne(categoryid);
    //     if (categoryDataId === undefined) {
    //         const errorResponse: any = {
    //             status: 0,
    //             message: 'Invalid categoryId',
    //         };
    //         return response.status(400).send(errorResponse);
    //     }
    //     const select = ['categoryId', 'name', 'image', 'imagePath', 'parentInt', 'sortOrder', 'metaTagTitle', 'metaTagDescription', 'metaTagKeyword'];
    //     const categoryData = await this.categoryService.list(0 , 0 , select, 0 , 0 , 0, 0);
    //     const categoryList = arrayToTree(categoryData, {
    //         parentProperty: 'parentInt',
    //         customID: 'categoryId',
    //     });
    //     const mainCategoryId = categoryDetailId.pathId;
    //     let dataList;
    //     const key = 'categoryId';
    //     for ( const data of categoryList) {
    //         if (data[key] === mainCategoryId) {
    //             dataList = data;
    //         }
    //     }
    //     const successResponse: any = {
    //         status: 1,
    //         message: 'Successfully get the related category List',
    //         data: dataList,
    //     };
    //     return response.status(200).send(successResponse);
    // }
    // Active product count API
    /**
     * @api {get} /api/list/product-count  Product Count API
     * @apiGroup Store List
     * @apiParam (Request body) {String} keyword keyword for search
     * @apiParam (Request body) {Number} manufacturerId manufacturerId
     * @apiParam (Request body) {Number} categoryId categoryId
     * @apiParam (Request body) {Number} priceFrom price from you want to list
     * @apiParam (Request body) {Number} priceTo price to you want to list
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully get Product Count",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/list/product-count
     * @apiErrorExample {json} product count error
     * HTTP/1.1 500 Internal Server Error
     */
    // @Get('/product-count')
    // public async productCount( @QueryParam('keyword') keyword: string, @QueryParam('manufacturerId') manufacturerId: number, @QueryParam('categoryId') categoryId: number, @QueryParam('priceFrom') priceFrom: number, @QueryParam('priceTo') priceTo: number, @Res() response: any): Promise<any> {
    //     const maximum: any = ['Max(product.price) As maximumProductPrice'];
    //     const maximumPrice: any = await this.productService.productMaxPrice(maximum);
    //     const productPrice: any = maximumPrice.maximumProductPrice;
    //     const productCount = await this.productService.productCount(keyword, manufacturerId, categoryId, priceFrom, priceTo);
    //     const successResponse: any = {
    //         status: 1,
    //         message: 'Successfully get Product Count',
    //         data: {productCount: productCount.productCount,
    //             maximumProductPrice: productPrice},
    //     };
    //     return response.status(200).send(successResponse);

    // }
   }
