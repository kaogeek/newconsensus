/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import 'reflect-metadata';
import {
    Get,
    Post,
    Delete,
    Put,
    Body,
    QueryParam,
    Param,
    JsonController,
    Authorized,
    Req,
    Res
} from 'routing-controllers';
import * as AWS from 'aws-sdk';
import { classToPlain } from 'class-transformer';
import { aws_setup } from '../../env';
import { PageUserService } from '../services/PageUserService';
import { PageUser } from '../models/PageUser';
import { CreateCustomer } from './requests/CreateCustomerRequest';
import { User } from '../models/User';
import { MAILService } from '../../auth/mail.services';
import { UpdateCustomer } from './requests/UpdateCustomerRequest';
import { EmailTemplateService } from '../services/EmailTemplateService';
import { DeleteCustomerRequest } from './requests/DeleteCustomerRequest';
import * as fs from 'fs';
import { ResponceUtil } from '../../utils/ResponceUtil';
import { SearchFilter } from './requests/SearchFilterRequest';

@JsonController('/pageuser')
export class PageUserController {
    constructor(private customerService: PageUserService,
        private emailTemplateService: EmailTemplateService) {
    }

    // Create PageUser API
    /**
     * @api {post} /api/pageuser/add-customer Add PageUser API
     * @apiGroup PageUser
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {Number} customerGroupId PageUser customerGroupId
     * @apiParam (Request body) {String} username PageUser username
     * @apiParam (Request body) {String} email PageUser email
     * @apiParam (Request body) {Number} mobileNumber PageUser mobileNumber
     * @apiParam (Request body) {String} password PageUser password
     * @apiParam (Request body) {String} confirmPassword PageUser confirmPassword
     * @apiParam (Request body) {String} avatar PageUser avatar
     * @apiParam (Request body) {Number} mailStatus PageUser mailStatus should be 1 or 0
     * @apiParam (Request body) {Number} status PageUser status
     * @apiParamExample {json} Input
     * {
     *      "customerGroupId" : "",
     *      "userName" : "",
     *      "email" : "",
     *      "mobileNumber" : "",
     *      "password" : "",
     *      "confirmPassword" : "",
     *      "avatar" : "",
     *      "mailStatus" : "",
     *      "status" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "PageUser Created successfully",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/pageuser/add-customer
     * @apiErrorExample {json} PageUser error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/add-customer')
    @Authorized()
    public async addCustomer(@Body({ validate: true }) customerParam: CreateCustomer, @Res() response: any): Promise<any> {

        const avatar = customerParam.avatar;
        const newCustomer: any = new PageUser();
        const resultUser = await this.customerService.findOne({ where: { email: customerParam.email, deleteFlag: 0 } });
        if (resultUser) {
            const successResponse: any = {
                status: 1,
                message: 'Already registered with this emailId.',
            };
            return response.status(400).send(successResponse);
        }
        if (avatar) {
            const type = avatar.split(';')[0].split('/')[1];
            const name = 'Img_' + Date.now() + '.' + type;
            const s3 = new AWS.S3();
            const path = 'customer/';
            const base64Data = new Buffer(avatar.replace(/^data:image\/\w+;base64,/, ''), 'base64');
            const params = {
                Bucket: aws_setup.AWS_BUCKET,
                Key: 'customer/' + name,
                Body: base64Data,
                ACL: 'public-read',
                ContentEncoding: 'base64',
                ContentType: `image/${type}`,
            };
            newCustomer.avatar = name;
            newCustomer.avatarPath = path;
            s3.upload(params, (err, data) => {
                if (data) {
                    console.log('image upload successfully');
                    console.log(data);
                } else {
                    console.log('error while uploading image');
                }
            });
        }
        if (customerParam.password === customerParam.confirmPassword) {
            const password = await User.hashPassword(customerParam.password);
            newCustomer.customerGroupId = customerParam.customerGroupId;
            newCustomer.firstName = customerParam.username;
            newCustomer.username = customerParam.email;
            newCustomer.email = customerParam.email;
            newCustomer.mobileNumber = customerParam.mobileNumber;
            newCustomer.password = password;
            newCustomer.mailStatus = customerParam.mailStatus;
            newCustomer.deleteFlag = 0;
            newCustomer.isActive = customerParam.status;

            const customerSave = await this.customerService.create(newCustomer);

            if (customerSave) {
                if (customerParam.mailStatus === 1) {
                    const emailContent = await this.emailTemplateService.findOne(4);
                    const message = emailContent.content.replace('{name}', customerParam.username).replace('{username}', customerParam.email).replace('{password}', customerParam.password);
                    MAILService.customerLoginMail(message, customerParam.email, emailContent.subject);
                    const successResponse: any = {
                        status: 1,
                        message: 'Successfully created new PageUser with user name and password and send an email. ',
                        data: customerSave,
                    };
                    return response.status(200).send(successResponse);
                } else {
                    const successResponse: any = {
                        status: 1,
                        message: 'PageUser Created Successfully',
                        data: customerSave,
                    };
                    return response.status(200).send(successResponse);
                }
            }
        } else {
            const errorResponse: any = {
                status: 0,
                message: 'Password does not match.',
            };
            return response.status(400).send(errorResponse);
        }
    }

    // PageUser List API
    /**
     * @api {get} /api/pageuser/customerlist PageUser List API
     * @apiGroup PageUser
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {Number} limit limit
     * @apiParam (Request body) {Number} offset offset
     * @apiParam (Request body) {String} name search by name
     * @apiParam (Request body) {String} email search bu email
     * @apiParam (Request body) {Number} status 0->inactive 1-> active
     * @apiParam (Request body) {String} customerGroup search by customerGroup
     * @apiParam (Request body) {String} date search by date
     * @apiParam (Request body) {Number} count count should be number or boolean
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully get customer list",
     *      "data":{
     *      "customerGroupId" : "",
     *      "username" : "",
     *      "email" : "",
     *      "mobileNUmber" : "",
     *      "password" : "",
     *      "avatar" : "",
     *      "avatarPath" : "",
     *      "status" : "",
     *      "safe" : "",
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/pageuser/customerlist
     * @apiErrorExample {json} customer error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/customerlist')
    @Authorized()
    public async customerList(@QueryParam('limit') limit: number, @QueryParam('offset') offset: number, @QueryParam('name') name: string, @QueryParam('status') status: string, @QueryParam('email') email: string, @QueryParam('customerGroup') customerGroup: string, @QueryParam('date') date: string, @QueryParam('count') count: number | boolean, @Res() response: any): Promise<any> {
        const search = [
            {
                name: 'firstName',
                op: 'like',
                value: name,
            },
            {
                name: 'email',
                op: 'like',
                value: email,
            },
            {
                name: 'createdDate',
                op: 'like',
                value: date,
            },
            {
                name: 'customerGroupId',
                op: 'like',
                value: customerGroup,
            },
            {
                name: 'isActive',
                op: 'like',
                value: status,
            },
        ];
        const WhereConditions = [
            {
                name: 'deleteFlag',
                value: 0,
            },
        ];
        const customerList = await this.customerService.list(limit, offset, search, WhereConditions, 0, count);

        const successResponse: any = {
            status: 1,
            message: 'Successfully got PageUser list.',
            data: customerList,
        };
        return response.status(200).send(successResponse);

    }

    // Delete PageUser API
    /**
     * @api {delete} /api/pageuser/delete-customer/:id Delete PageUser API
     * @apiGroup PageUser
     * @apiHeader {String} Authorization
     * @apiParamExample {json} Input
     * {
     *      "customerId" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully deleted customer.",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/pageuser/delete-customer/:id
     * @apiErrorExample {json} PageUser error
     * HTTP/1.1 500 Internal Server Error
     */
    @Delete('/delete-customer/:id')
    @Authorized()
    public async deleteCustomer(@Param('id') id: number, @Res() response: any, @Req() request: any): Promise<any> {

        const customer = await this.customerService.findOne({
            where: {
                id,
            },
        });
        if (!customer) {
            const errorResponse: any = {
                status: 0,
                message: 'Invalid customerId',
            };
            return response.status(400).send(errorResponse);
        }
        customer.deleteFlag = 1;
        const deleteCustomer = await this.customerService.create(customer);
        if (deleteCustomer) {
            const successResponse: any = {
                status: 1,
                message: 'PageUser Deleted Successfully',
            };
            return response.status(200).send(successResponse);
        } else {
            const errorResponse: any = {
                status: 0,
                message: 'unable to change delete flag status',
            };
            return response.status(400).send(errorResponse);
        }
    }

    // Update PageUser API
    /**
     * @api {put} /api/pageuser/update-customer/:id Update PageUser API
     * @apiGroup PageUser
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {Number} customerGroupId PageUser customerGroupId
     * @apiParam (Request body) {String} username PageUser username
     * @apiParam (Request body) {String} email PageUser email
     * @apiParam (Request body) {Number} mobileNumber PageUser mobileNumber
     * @apiParam (Request body) {String} password PageUser password
     * @apiParam (Request body) {String} confirmPassword PageUser confirmPassword
     * @apiParam (Request body) {String} avatar PageUser avatar
     * @apiParam (Request body) {Number} mailStatus PageUser mailStatus should be 1 or 0
     * @apiParam (Request body) {Number} status PageUser status
     * @apiParamExample {json} Input
     * {
     *      "customerGroupId" : "",
     *      "userName" : "",
     *      "email" : "",
     *      "mobileNumber" : "",
     *      "password" : "",
     *      "confirmPassword" : "",
     *      "avatar" : "",
     *      "mailStatus" : "",
     *      "status" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": " PageUser is updated successfully",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/pageuser/update-customer/:id
     * @apiErrorExample {json} updateCustomer error
     * HTTP/1.1 500 Internal Server Error
     */
    @Put('/update-customer/:id')
    @Authorized()
    public async updateCustomer(@Param('id') id: number, @Body({ validate: true }) customerParam: UpdateCustomer, @Res() response: any): Promise<any> {
        const customer = await this.customerService.findOne({
            where: {
                id,
            },
        });
        if (!customer) {
            const errorResponse: any = {
                status: 0,
                message: 'invalid customer id',
            };
            return response.status(400).send(errorResponse);
        }
        if (customerParam.password === customerParam.confirmPassword) {

            const avatar = customerParam.avatar;
            if (avatar) {
                const type = avatar.split(';')[0].split('/')[1];
                const name = 'Img_' + Date.now() + '.' + type;
                const s3 = new AWS.S3();
                const path = 'customer/';
                const base64Data = new Buffer(avatar.replace(/^data:image\/\w+;base64,/, ''), 'base64');
                const params = {
                    Bucket: aws_setup.AWS_BUCKET,
                    Key: 'customer/' + name,
                    Body: base64Data,
                    ACL: 'public-read',
                    ContentEncoding: 'base64',
                    ContentType: `image/${type}`,
                };
                s3.upload(params, (err, data) => {
                    if (data) {
                        console.log('image upload successfully');
                        console.log(data);
                    } else {
                        console.log('error while uploading image');
                    }
                });
                customer.avatar = name;
                customer.avatarPath = path;
            }
            // const password = await User.hashPassword(customerParam.password);
            customer.customerGroupId = customerParam.customerGroupId;
            customer.firstName = customerParam.username;
            customer.username = customerParam.email;
            customer.email = customerParam.email;
            customer.mobileNumber = customerParam.mobileNumber;
            if (customerParam.password) {
                const password = await User.hashPassword(customerParam.password);
                customer.password = password;
            }
            customer.mailStatus = customerParam.mailStatus;
            customer.isActive = customerParam.status;
            const customerSave = await this.customerService.create(customer);
            if (customerSave) {
                const successResponse: any = {
                    status: 1,
                    message: 'PageUser Updated Successfully',
                    data: customerSave,
                };
                return response.status(200).send(successResponse);

            }
        } else {
            const errorResponse: any = {
                status: 0,
                message: 'Password does not match.',
            };
            return response.status(400).send(errorResponse);
        }
    }

    // Get PageUser Detail API
    /**
     * @api {get} /api/pageuser/pageuser-details/:id PageUser Details API
     * @apiGroup PageUser
     * @apiHeader {String} Authorization
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     * "message": "Successfully get customer Details",
     * "data":{
     * "customerGroupId" : "",
     * "username" : "",
     * "email" : "",
     * "mobileNumber" : "",
     * "password" : "",
     * "avatar" : "",
     * "avatarPath" : "",
     * "newsletter" : "",
     * "status" : "",
     * "safe" : "",
     * }
     * "status": "1"
     * }
     * @apiSampleRequest /api/pageuser/pageuser-details/:id
     * @apiErrorExample {json} customer error
     * HTTP/1.1 500 Internal Server Error
     */
    // @Get('/pageuser-details/:id')
    // @Authorized()
    // public async customerDetails(@Param('id')Id: number, @Res() response: any): Promise<any> {
    //     const customer = await this.customerService.findOne({
    //         where: {id: Id},
    //     });
    //     if (!customer) {
    //         const errorResponse: any = {
    //             status: 0,
    //             message: 'invalid CustomerId',
    //         };
    //         return response.status(400).send(errorResponse);
    //     }

    //     const order = await this.orderService.find({where: {customerId: Id}});
    //     const productLists = await order.map(async (result: any) => {
    //         const product = await this.orderProductService.find({
    //             where: {orderId: result.orderId},
    //             select: ['productId', 'orderId', 'name', 'model', 'total', 'createdDate'],
    //         });
    //         const productPromises = await product.map(async (value: any) => {
    //             const productsDetails: any = value;
    //             const products = await this.productService.find({where: {productId: value.productId}});

    //             const productImages = await products.map(async (values: any) => {
    //                 const productImagesResult: any = values;
    //                 const Image = await this.productImageService.findOne({
    //                     select: ['productId', 'productImageId', 'image', 'containerName', 'defaultImage'],
    //                     where: {productId: values.productId, defaultImage: 1},
    //                 });
    //                 productImagesResult.productImages = Image;
    //                 return productImagesResult;
    //             });
    //             const images = await Promise.all(productImages);
    //             productsDetails.productDetails = images;
    //             return productsDetails;
    //         });
    //         const productsListWithImages = await Promise.all(productPromises);
    //         const temp: any = await productsListWithImages;
    //         return temp;
    //     });

    //     const finalResult = await Promise.all(productLists);
    //     customer.productList = finalResult;
    //     // customer.productCount = finalResult.length;
    //     if (finalResult) {
    //         const successResponse: any = {
    //             status: 1,
    //             message: 'successfully got PageUser details. ',
    //             data: customer,
    //         };
    //         return response.status(200).send(successResponse);
    //     } else {
    //         const errorResponse: any = {
    //             status: 0,
    //             message: 'unable to get customer Details',
    //         };
    //         return response.status(400).send(errorResponse);
    //     }
    // }

    // Recently Added PageUser List API
    /**
     * @api {get} /api/pageuser/recent-customerlist Recent PageUser List API
     * @apiGroup PageUser
     * @apiHeader {String} Authorization
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "status": "1"
     *      "message": "Successfully get customer list",
     *      "data":{
     *      "location" : "",
     *      "name" : "",
     *      "created date" : "",
     *      "isActive" : "",
     *      }
     * }
     * @apiSampleRequest /api/pageuser/recent-customerlist
     * @apiErrorExample {json} customer error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/recent-customerlist')
    @Authorized()
    public async recentCustomerList(@Res() response: any): Promise<any> {
        const order = 1;
        const WhereConditions = [
            {
                name: 'deleteFlag',
                value: 0,
            },
        ];
        const customerList = await this.customerService.list(0, 0, 0, WhereConditions, order, 0);
        const successResponse: any = {
            status: 1,
            message: 'Successfully got PageUser list.',
            data: classToPlain(customerList),
        };

        return response.status(200).send(successResponse);
    }

    //  Today PageUser Count API
    /**
     * @api {get} /api/pageuser/today-customercount Today PageUser Count API
     * @apiGroup PageUser
     * @apiHeader {String} Authorization
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully get Today customer count",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/pageuser/today-customercount
     * @apiErrorExample {json} order error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/today-customercount')
    @Authorized()
    public async customerCount(@Res() response: any): Promise<any> {

        const nowDate = new Date();
        const todaydate = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + nowDate.getDate();
        const customerCount = await this.customerService.todayCustomerCount(todaydate);
        const successResponse: any = {
            status: 1,
            message: 'Successfully get customerCount',
            data: customerCount,
        };
        return response.status(200).send(successResponse);

    }

    // Delete Multiple PageUser API
    /**
     * @api {post} /api/product/delete-customer Delete Multiple PageUser API
     * @apiGroup PageUser
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {number} customerId customerId
     * @apiParamExample {json} Input
     * {
     * "customerId" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     * "message": "Successfully deleted customer.",
     * "status": "1"
     * }
     * @apiSampleRequest /api/pageuser/delete-customer
     * @apiErrorExample {json} customerDelete error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/delete-customer')
    @Authorized()
    public async deleteMultipleCustomer(@Body({ validate: true }) deleteCustomerId: DeleteCustomerRequest, @Res() response: any, @Req() request: any): Promise<any> {
        const customers = deleteCustomerId.customerId.toString();
        const customer: any = customers.split(',');
        console.log(customer);
        const data: any = customer.map(async (id: any) => {
            const dataId = await this.customerService.findOne(id);
            if (dataId === undefined) {
                const errorResponse: any = {
                    status: 0,
                    message: 'Please choose customer for delete',
                };
                return response.status(400).send(errorResponse);
            } else {
                dataId.deleteFlag = 1;
                return await this.customerService.create(dataId);
            }
        });
        const deleteCustomer = await Promise.all(data);
        if (deleteCustomer) {
            const successResponse: any = {
                status: 1,
                message: 'Successfully deleted customer',
            };
            return response.status(200).send(successResponse);
        }
    }

    // PageUser Details Excel Document Download
    /**
     * @api {get} /api/pageuser/pageuser-excel-list PageUser Excel
     * @apiGroup PageUser
     * @apiParam (Request body) {String} customerId customerId
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully download the PageUser Excel List..!!",
     *      "status": "1",
     *      "data": {},
     * }
     * @apiSampleRequest /api/pageuser/pageuser-excel-list
     * @apiErrorExample {json} PageUser Excel List error
     * HTTP/1.1 500 Internal Server Error
     */

    @Get('/pageuser-excel-list')
    public async excelCustomerView(@QueryParam('customerId') customerId: string, @Req() request: any, @Res() response: any): Promise<any> {
        const excel = require('exceljs');
        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('Order Detail Sheet');
        const rows = [];
        const customerid = customerId.split(',');
        for (const id of customerid) {
            const dataId = await this.customerService.findOne(id);
            if (dataId === undefined) {
                const errorResponse: any = {
                    status: 0,
                    message: 'Invalid customerId',
                };
                return response.status(400).send(errorResponse);
            }
        }
        // Excel sheet column define
        worksheet.columns = [
            { header: 'PageUser Id', key: 'id', size: 16, width: 15 },
            { header: 'PageUser Name', key: 'first_name', size: 16, width: 15 },
            { header: 'User Name', key: 'username', size: 16, width: 24 },
            { header: 'Email Id', key: 'email', size: 16, width: 15 },
            { header: 'Mobile Number', key: 'mobileNumber', size: 16, width: 15 },
            { header: 'Date Of Registration', key: 'createdDate', size: 16, width: 15 },
        ];
        worksheet.getCell('A1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('B1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('C1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('D1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('E1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('F1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        for (const id of customerid) {
            const dataId = await this.customerService.findOne(id);
            if (dataId.lastName === null) {
                dataId.lastName = '';
            }
            rows.push([dataId.id, dataId.firstName + ' ' + dataId.lastName, dataId.username, dataId.email, dataId.mobileNumber, dataId.createdDate]);
        }
        // Add all rows data in sheet
        worksheet.addRows(rows);
        const fileName = './CustomerExcel_' + Date.now() + '.xlsx';
        await workbook.xlsx.writeFile(fileName);
        return new Promise((resolve, reject) => {
            response.download(fileName, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    fs.unlinkSync(fileName);
                    return response.end();
                }
            });
        });
    }
    /**
     * @api {get} /api/pageuser/count Count Pageuser 
     * @apiGroup PageUser
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Pageuser Count Successfully",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/pageuser/count
     * @apiErrorExample {json} Pageuser error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/count')
    public async findCountPageUser(@Res() response: any): Promise<any> {
        // console.log('filter.count : '+filter.count);
        try {
            const PageUserCount: any = await this.customerService.search(undefined, undefined, undefined, undefined, undefined, undefined, true);

            return response.status(200).send(ResponceUtil.getSucessResponce('Successfully Count PageUser ', PageUserCount));
        } catch (error) {
            return response.status(400).send(error);
        }
    }

    // Ban PageUser API
    /**
     * @api {put} /api/pageuser/ban/:id Ban PageUser API
     * @apiGroup PageUser
     * @apiHeader {String} Authorization
     * @apiParamExample {json} Input
     * {
     *      "id" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully baned customer.",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/pageuser/ban/:id
     * @apiErrorExample {json} PageUser error
     * HTTP/1.1 500 Internal Server Error
     */
    @Put('/ban/:id')
    @Authorized()
    public async banCustomer(@Param('id') id: number, @Res() response: any, @Req() request: any): Promise<any> {

        const customer = await this.customerService.findOne({
            where: {
                id,
            },
        });
        if (!customer) {
            const errorResponse: any = {
                status: 0,
                message: 'Invalid PageUser Id',
            };
            return response.status(400).send(errorResponse);
        }

        if (customer.deleteFlag) {
            const errorResponse: any = {
                status: 0,
                message: 'PageUser was baned',
            };
            return response.status(400).send(errorResponse);
        }

        customer.deleteFlag = 1;
        const deleteCustomer = await this.customerService.create(customer);
        if (deleteCustomer) {
            const successResponse: any = {
                status: 1,
                message: 'PageUser Baned Successfully',
            };
            return response.status(200).send(successResponse);
        } else {
            const errorResponse: any = {
                status: 0,
                message: 'unable to change ban flag status',
            };
            return response.status(400).send(errorResponse);
        }
    }

    // Unban PageUser API
    /**
     * @api {put} /api/pageuser/unban/:id Unban PageUser API
     * @apiGroup PageUser
     * @apiHeader {String} Authorization
     * @apiParamExample {json} Input
     * {
     *      "id" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully baned customer.",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/pageuser/unban/:id
     * @apiErrorExample {json} PageUser error
     * HTTP/1.1 500 Internal Server Error
     */
    @Put('/unban/:id')
    @Authorized()
    public async unbanCustomer(@Param('id') id: number, @Res() response: any, @Req() request: any): Promise<any> {

        const customer = await this.customerService.findOne({
            where: {
                id,
            },
        });
        if (!customer) {
            const errorResponse: any = {
                status: 0,
                message: 'Invalid PageUser Id',
            };
            return response.status(400).send(errorResponse);
        }

        if (!customer.deleteFlag) {
            const errorResponse: any = {
                status: 0,
                message: 'PageUser was unbaned',
            };
            return response.status(400).send(errorResponse);
        }

        customer.deleteFlag = 0;
        const deleteCustomer = await this.customerService.create(customer);
        if (deleteCustomer) {
            const successResponse: any = {
                status: 1,
                message: 'PageUser Unbaned Successfully',
            };
            return response.status(200).send(successResponse);
        } else {
            const errorResponse: any = {
                status: 0,
                message: 'unable to change ban flag status',
            };
            return response.status(400).send(errorResponse);
        }
    }
    // Official PageUser API
    /**
     * @api {put} /api/pageuser/official/:id Official PageUser API
     * @apiGroup PageUser
     * @apiHeader {String} Authorization
     * @apiParamExample {json} Input
     * {
     *      "id" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully official customer.",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/pageuser/official/:id
     * @apiErrorExample {json} PageUser error
     * HTTP/1.1 500 Internal Server Error
     */
    @Put('/official/:id')
    @Authorized()
    public async approveOfficialCustomer(@Param('id') id: number, @Res() response: any, @Req() request: any): Promise<any> {

        const customer = await this.customerService.findOne({
            where: {
                id,
            },
        });
        if (!customer) {
            const errorResponse: any = {
                status: 0,
                message: 'Invalid PageUser Id',
            };
            return response.status(400).send(errorResponse);
        }
        if (customer.isOfficial) {
            const errorResponse: any = {
                status: 0,
                message: 'PageUser was official',
            };
            return response.status(400).send(errorResponse);
        }

        customer.isOfficial = 1;
        const deleteCustomer = await this.customerService.create(customer);
        if (deleteCustomer) {
            const successResponse: any = {
                status: 1,
                message: 'PageUser official Successfully',
            };
            return response.status(200).send(successResponse);
        } else {
            const errorResponse: any = {
                status: 0,
                message: 'unable to change official flag status',
            };
            return response.status(400).send(errorResponse);
        }
    }

    // UnOfficial PageUser API
    /**
     * @api {put} /api/pageuser/unofficial/:id Official PageUser API
     * @apiGroup PageUser
     * @apiHeader {String} Authorization
     * @apiParamExample {json} Input
     * {
     *      "id" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully baned customer.",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/pageuser/unofficial/:id
     * @apiErrorExample {json} PageUser error
     * HTTP/1.1 500 Internal Server Error
     */
    @Put('/unofficial/:id')
    @Authorized()
    public async unapproveOfficialCustomer(@Param('id') id: number, @Res() response: any, @Req() request: any): Promise<any> {

        const customer = await this.customerService.findOne({
            where: {
                id,
            },
        });
        if (!customer) {
            const errorResponse: any = {
                status: 0,
                message: 'Invalid PageUser Id',
            };
            return response.status(400).send(errorResponse);
        }

        if (!customer.isOfficial) {
            const errorResponse: any = {
                status: 0,
                message: 'PageUser was unofficial',
            };
            return response.status(400).send(errorResponse);
        }

        customer.isOfficial = 0;
        const deleteCustomer = await this.customerService.create(customer);
        if (deleteCustomer) {
            const successResponse: any = {
                status: 1,
                message: 'PageUser unofficial Successfully',
            };
            return response.status(200).send(successResponse);
        } else {
            const errorResponse: any = {
                status: 0,
                message: 'unable to change unofficial flag status',
            };
            return response.status(400).send(errorResponse);
        }
    }
    /**
     * @api {post} /api/pageuser/search Pageuser Search API
     * @apiGroup PageUser
     * @apiParam (Request body) {number} limit limit
     * @apiParam (Request body) {number} offset offset
     * @apiParam (Request body) {String} select select
     * @apiParam (Request body) {String} relation relation
     * @apiParam (Request body) {String} whereConditions whereConditions
     * @apiParam (Request body) {boolean} count count (0=false, 1=true)
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *    "message": "Successfully get pageUser search",
     *    "data":{
     *    "name" : "",
     *    "description": "",
     *     }
     *    "status": "1"
     *  }
     * @apiSampleRequest /api/content/search
     * @apiErrorExample {json} tag error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/search')
    @Authorized()
    public async contentSearch(@Body({ validate: true }) filter: SearchFilter, @Res() response: any): Promise<any> {
        const userLists: any = await this.customerService.search(filter.limit, filter.offset, filter.select, filter.relation, filter.whereConditions, filter.orderBy, filter.count);
        
        if (!userLists) {
            const successResponse = ResponceUtil.getSucessResponce('Successfully search content', []);
            return response.status(200).send(successResponse);

        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully search content', userLists);
            return response.status(200).send(successResponse);
        }
    }
}
