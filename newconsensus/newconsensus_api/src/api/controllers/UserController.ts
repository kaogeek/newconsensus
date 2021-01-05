/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import 'reflect-metadata';
import {
    Post, Body, JsonController, Res, Get, Authorized, QueryParam, Put, Param, Delete, Req
} from 'routing-controllers';
import { classToPlain } from 'class-transformer';
import jwt from 'jsonwebtoken';

import { env } from '../../env';
import { ForgotPassword as ForgotPassword } from './requests/ForgotPasswordRequest';
import { UserLogin as LoginRequest } from './requests/UserLoginRequest';
import { CreateUser as CreateRequest } from './requests/CreateUserRequest';
import { UpdateUserRequest as updateUserRequest } from './requests/UpdateUserRequest';
import { User } from '../models/User';
import { AccessToken } from '../models/AccessTokenModel';
import { UserService } from '../services/UserService';
import { UserGroupService } from '../services/UserGroupService';
import { ChangePassword } from './requests/ChangePasswordRequest';
import { EditProfileRequest } from './requests/EditProfileRequest';
import { AccessTokenService } from '../services/AccessTokenService';
import { EmailTemplateService } from '../services/EmailTemplateService';
import { MAILService } from '../../auth/mail.services';
import { ImageService } from '../services/ImageService';
import { S3Service } from '../services/S3Service';
import { SearchFilter } from './requests/SearchFilterRequest';
import { LoginLogService } from '../services/LoginLogService';
import { ResponceUtil } from '../../utils/ResponceUtil';

@JsonController('/auth')
export class UserController {

    constructor(private userService: UserService,
        private loginLogService: LoginLogService,
        private userGroupService: UserGroupService,
        private accessTokenService: AccessTokenService,
        private emailTemplateService: EmailTemplateService, private s3Service: S3Service,
        private imageService: ImageService) {
    }
    // Login API
    /**
     * @api {post} /api/auth/login Login
     * @apiGroup Authentication
     * @apiParam (Request body) {String} username User Username
     * @apiParam (Request body) {String} password User Password
     * @apiParamExample {json} Input
     * {
     *      "username" : "",
     *      "password" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "data": "{
     *         "token":''
     *      }",
     *      "message": "Successfully login",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/auth/login
     * @apiErrorExample {json} Login error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/login')
    public async login(@Body({ validate: true }) loginParam: LoginRequest, @Res() response: any): Promise<any> {
        const user = await this.userService.findOne({
            where: {
                username: loginParam.username,
                deleteFlag: 0,
            }, relations: ['usergroup'],
        });
        if (user) {
            if (await User.comparePassword(user, loginParam.password)) {
                // create a token
                const token = jwt.sign({ id: user.id }, env.SECRET_KEY);
                if (user.usergroup.isActive === 0) {
                    const errorResponse: any = {
                        status: 0,
                        message: 'InActive Role',
                    };
                    return response.status(400).send(errorResponse);
                }
                if (token) {
                    const newToken = new AccessToken();
                    newToken.userId = user.id;
                    newToken.token = token;
                    await this.accessTokenService.create(newToken);
                }
                const successResponse: any = {
                    status: 1,
                    message: 'Loggedin successful',
                    data: {
                        token,
                        user: classToPlain(user),
                    },
                };
                return response.status(200).send(successResponse);
            } else {
                const errorResponse: any = {
                    status: 0,
                    message: 'Invalid password',
                };
                return response.status(400).send(errorResponse);
            }
        } else {

            const errorResponse: any = {
                status: 0,
                message: 'Invalid username',
            };
            return response.status(400).send(errorResponse);
        }
    }

    // User List API
    /**
     * @api {get} /api/auth/userlist User List API
     * @apiGroup Authentication
     * @apiParam (Request body) {Number} limit limit
     * @apiParam (Request body) {Number} offset offset
     * @apiParam (Request body) {String} keyword keyword
     * @apiParam (Request body) {Number} count count in number or boolean
     * @apiHeader {String} Authorization
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully get user list",
     *      "data":"{}"
     *      "status": "1"
     * }
     * @apiSampleRequest /api/auth/userlist
     * @apiErrorExample {json} User Profile error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/userlist')
    @Authorized()
    public async findAll(@QueryParam('limit') limit: number, @QueryParam('offset') offset: number, @QueryParam('keyword') keyword: string, @QueryParam('count') count: number | boolean, @Res() response: any): Promise<any> {
        const relation = ['usergroup'];
        const WhereConditions = [{
            name: 'deleteFlag',
            value: 0,
        }];
        const user = await this.userService.list(limit, offset, ['id', 'userGroupId', 'username', 'firstName', 'lastName', 'email', 'address', 'phoneNumber', 'avatar', 'avatarPath', 'password', 'createdDate'], relation, WhereConditions, keyword, count);
        const successResponse: any = {
            status: 1,
            data: classToPlain(user),
            message: 'Successfully get All user List',
        };
        return response.status(200).send(successResponse);
    }

    // Create User API
    /**
     * @api {post} /api/auth/create-user Create User API
     * @apiGroup Authentication
     * @apiParam (Request body) {String} username userName
     * @apiParam (Request body) {String} password password
     * @apiParam (Request body) {String} address address
     * @apiParam (Request body) {String} avatar avatar
     * @apiParam (Request body) {String} avatarPath avatarPath
     * @apiParam (Request body) {Number} deleteFlag deleteFlag
     * @apiParam (Request body) {Number} isActive isActive
     * @apiParam (Request body) {String} firstName User First Name
     * @apiParam (Request body) {String} lastName User Last Name
     * @apiParam (Request body) {Number} phoneNumber User phoneNumber
     * @apiParam (Request body) {String} email User Email-Id
     * @apiParam (Request body) {Number} userGroupId User GroupId
     * @apiHeader {String} Authorization
     * @apiParamExample {json} Input
     * {
     *      "username" : "",
     *      "password" : "",
     *      "address" : "",
     *      "avatar" : "",
     *      "avatarPath" : "",
     *      "deleteFlag" : "",
     *      "isActive" : "",
     *      "firstName" : "",
     *      "lastName" : "",
     *      "email" : "",
     *      "userGroupId" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "New User is created successfully",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/auth/create-user
     * @apiErrorExample {json} createUser error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/create-user')
    @Authorized()
    public async createUser(@Body({ validate: true }) createParam: CreateRequest, @Req() request: any, @Res() response: any): Promise<any> {
        const userGroupExistWhereCondition = [
            {
                name: 'id',
                value: createParam.userGroupId,
            },
        ];
        const userGroupExistRecord = await this.userGroupService.list(0, 0, [], userGroupExistWhereCondition, 0);
        if (userGroupExistRecord.length === 0) {
            const errorResponse: any = {
                status: 0,
                message: 'Invalid userGroupId',
            };
            return response.status(400).send(errorResponse);
        }
        const user = await this.userService.findOne({
            where: {
                username: createParam.username,
                deleteFlag: 0,
            },
        });
        
        if (user) {
            const errorResponse: any = {
                status: 0,
                message: 'this user already saved',
            };
            return response.status(400).send(errorResponse);
        }
        // return this.userLoginService.find();
        
        const newUserPassword = await User.hashPassword(createParam.password);
        const newUserParams = new User();
        newUserParams.username = createParam.username;
        newUserParams.password = newUserPassword;
        newUserParams.firstName = createParam.firstName;
        newUserParams.lastName = createParam.lastName;
        newUserParams.email = createParam.email;
        newUserParams.deleteFlag = 0;
        newUserParams.userGroupId = createParam.userGroupId;
        newUserParams.isActive = 1;
        newUserParams.createdByUsername = request.user.username;
        newUserParams.createdBy = request.user.id;
        let userSaveResponse = await this.userService.create(newUserParams);
        // sending login Credential email to new user
        if (userSaveResponse) {
            userSaveResponse = this.userService.cleanAdminUserField(userSaveResponse);

            // const emailContent = await this.emailTemplateService.findOne(7);
            // const message = emailContent.content.replace('{name}', createParam.username).replace('{username}', createParam.email).replace('{password}', createParam.password);
            // MAILService.customerLoginMail(message, createParam.email, emailContent.subject);

            const successResponse: any = {
                status: 1,
                message: 'User saved successfully',
                data: userSaveResponse,
            };

            return response.status(200).send(successResponse);
        }
    }

    // update User API
    /**
     * @api {put} /api/auth/update-user/:id Update User API
     * @apiGroup Authentication
     * @apiParam (Request body) {String} username userName
     * @apiParam (Request body) {String} password password
     * @apiParam (Request body) {String} firstName User First Name
     * @apiParam (Request body) {String} lastName User Last Name
     * @apiParam (Request body) {String} email User Email-Id
     * @apiParam (Request body) {Number} userGroupId User GroupId
     * @apiHeader {String} Authorization
     * @apiParamExample {json} Input
     * {
     *      "username" : "",
     *      "password" : "",
     *      "firstName" : "",
     *      "lastName" : "",
     *      "email" : "",
     *      "userGroupId" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "User is updated successfully",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/auth/update-user/:id
     * @apiErrorExample {json} updateUser error
     * HTTP/1.1 500 Internal Server Error
     */
    @Put('/update-user/:id')
    @Authorized()
    public async updateUser(@Param('id') id: number, @Body({ validate: true }) createParam: updateUserRequest, @Req() request: any, @Res() response: any): Promise<any> {
        if (request.user.id === id) {
            const errorResponse: any = {
                status: 0,
                message: 'You cannot Edit loggedin User',
            };
            return response.status(400).send(errorResponse);
        }
        const userGroupExistWhereCondition = [
            {
                name: 'id',
                value: createParam.userGroupId,
            },
        ];
        const userGroupExistRecord = await this.userGroupService.list(0, 0, [], userGroupExistWhereCondition, 0);
        if (userGroupExistRecord.length === 0) {
            const errorResponse: any = {
                status: 0,
                message: 'Invalid userGroupId',
            };
            return response.status(400).send(errorResponse);
        }
        // return this.userLoginService.find();
        const newUserPassword = await User.hashPassword(createParam.password);
        const newUserParams = new User();
        newUserParams.username = createParam.username;
        if (createParam.password) {
            newUserParams.password = newUserPassword;
        }
        newUserParams.firstName = createParam.firstName;
        newUserParams.lastName = createParam.lastName;
        newUserParams.email = createParam.email;
        newUserParams.userGroupId = createParam.userGroupId;
        newUserParams.isActive = 1;
        const userSaveResponse = await this.userService.update(id, newUserParams);
        if (userSaveResponse) {
            const successResponse: any = {
                status: 1,
                message: 'User updated successfully',
            };
            return response.status(200).send(successResponse);
        } else {
            const errorResponse: any = {
                status: 0,
                message: 'Unable to update user',
            };
            return response.status(400).send(errorResponse);
        }

    }
    // Delete User API
    /**
     * @api {delete} /api/auth/delete-user/:id Delete User
     * @apiGroup Authentication
     * @apiParam (Request body) {Number} id UserId
     * @apiHeader {String} Authorization
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "User is deleted successfully",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/auth/delete-user/:id
     * @apiErrorExample {json} updateUser error
     * HTTP/1.1 500 Internal Server Error
     */
    @Delete('/delete-user/:id')
    @Authorized()
    public async remove(@Param('id') userId: number, @Req() request: any, @Res() response: any): Promise<any> {
        if (request.user.id === userId) {
            const errorResponse: any = {
                status: 0,
                message: 'You cannot delete loggedin user',
            };
            return response.status(400).send(errorResponse);
        }
        const user = await this.userService.findOne({
            where: {
                id: userId,
            },
        });
        user.deleteFlag = 1;
        const deleteUser = await this.userService.create(user);
        // const userDelete = await this.userService.delete(id);      
        if (deleteUser) {
            const successResponse: any = {
                status: 1,
                message: 'User Deleted successfully',
            };
            return response.status(200).send(successResponse);
        } else {
            const errorResponse: any = {
                status: 0,
                message: 'Unable to delete user',
            };
            return response.status(400).send(errorResponse);
        }
    }
    // forgot Password API
    /**
     * @api {post} /api/auth/forgot-password Forgot Password API
     * @apiGroup Authentication
     * @apiParam (Request body) {String} email User email
     * @apiParamExample {json} Input
     * {
     *      "email" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Thank you. Your password send to your email",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/auth/forgot-password
     * @apiErrorExample {json} User error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/forgot-password')
    public async forgotPassword(@Body({ validate: true }) forgotPassword: ForgotPassword, @Res() response: any): Promise<any> {
        const user = await this.userService.findOne({
            where: {
                email: forgotPassword.email,
            },
        });
        if (!user) {
            const errorResponse: any = {
                status: 0,
                message: 'Invalid email Id',
            };
            return response.status(400).send(errorResponse);
        }
        const tempPassword: any = Math.random().toString().substr(2, 5);
        const password = await User.hashPassword(tempPassword);
        user.password = password;

        await this.userService.create(user);

        const emailContent = await this.emailTemplateService.findOne(2);
        const message = emailContent.content.replace('{name}', user.firstName).replace('{xxxxxx}', tempPassword);
        const sendMailRes = MAILService.passwordForgotMail(message, user.email, emailContent.subject);
        if (sendMailRes) {
            const successResponse: any = {
                status: 1,
                message: 'Your password has been sent to your email inbox.',
            };
            return response.status(200).send(successResponse);
        } else {
            const errorResponse: any = {
                status: 0,
                message: 'error in sending email',
            };
            return response.status(400).send(errorResponse);
        }
    }

    // Change Password API
    /**
     * @api {put} /api/auth/change-password Change Password API
     * @apiGroup Authentication
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {String} oldPassword User oldPassword
     * @apiParam (Request body) {String} newPassword User newPassword
     * @apiParamExample {json} Input
     * {
     *      "oldPassword" : "",
     *      "newPassword" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully Password changed",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/auth/change-password
     * @apiErrorExample {json} User error
     * HTTP/1.1 500 Internal Server Error
     */
    @Put('/change-password')
    @Authorized()
    public async changePassword(@Body({ validate: true }) changePasswordParam: ChangePassword, @Req() request: any, @Res() response: any): Promise<any> {
        const user = await this.userService.findOne({
            where: {
                userId: request.user.id,
            },
        });
        if (!user) {
            const errResponse: any = {
                status: 0,
                message: 'Invalid userId',
            };
            return response.status(400).send(errResponse);
        }
        if (await User.comparePassword(user, changePasswordParam.oldPassword)) {
            const val = await User.comparePassword(user, changePasswordParam.newPassword);
            if (val) {
                const errResponse: any = {
                    status: 0,
                    message: 'Existing password and New password should not match',
                };
                return response.status(400).send(errResponse);
            }
            user.password = await User.hashPassword(changePasswordParam.newPassword);
            const updateUser = await this.userService.update(user.id, user);
            if (updateUser) {
                const successResponse: any = {
                    status: 1,
                    message: 'Your password changed successfully',
                };
                return response.status(200).send(successResponse);
            }
        }
        const errorResponse: any = {
            status: 0,
            message: 'Your old password is wrong',
        };
        return response.status(400).send(errorResponse);
    }

    // Logout API
    /**
     * @api {get} /api/auth/logout Log Out API
     * @apiGroup Authentication
     * @apiHeader {String} Authorization
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully logout",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/auth/logout
     * @apiErrorExample {json} Logout error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/logout')
    @Authorized()
    public async logout(@Req() request: any, @Res() response: any): Promise<any> {
        const user = await this.accessTokenService.findOne({
            where: {
                userId: request.user.id,
            },
        });
        if (!user) {
            const errorResponse: any = {
                status: 0,
                message: 'Invalid token',
            };
            return response.status(400).send(errorResponse);
        }
        const deleteToken = await this.accessTokenService.delete(user);
        if (!deleteToken) {
            const successResponse: any = {
                status: 1,
                message: 'Successfully Logout',
            };
            return response.status(200).send(successResponse);
        }
    }

    // Edit Profile API
    /**
     * @api {post} /api/auth/edit-profile Edit Profile API
     * @apiGroup Authentication
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {String} username User username
     * @apiParam (Request body) {String} email User email
     * @apiParam (Request body) {String} phoneNumber User phoneNumber
     * @apiParam (Request body) {String} address User address
     * @apiParam (Request body) {String} avatar User avatar
     * @apiParamExample {json} Input
     * {
     *      "username" : "",
     *      "email" : "",
     *      "phoneNumber" : "",
     *      "address" : "",
     *      "avatar" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully updated User.",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/auth/edit-profile
     * @apiErrorExample {json} User error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/edit-profile')
    @Authorized()
    public async editProfile(@Body({ validate: true }) editProfileParam: EditProfileRequest, @Res() response: any, @Req() request: any): Promise<any> {

        const user = await this.userService.findOne({
            where: {
                userId: request.user.id,
            },
        });
        const avatar = editProfileParam.avatar;
        if (avatar) {
            const type = avatar.split(';')[0].split('/')[1];
            const name = 'Img_' + Date.now() + '.' + type;
            const path = 'user/';
            const base64Data = new Buffer(avatar.replace(/^data:image\/\w+;base64,/, ''), 'base64');
            if (env.imageserver === 's3') {
                await this.s3Service.imageUpload((path + name), base64Data, type);
            } else {
                await this.imageService.imageUpload((path + name), base64Data);
            }
            user.avatar = name;
            user.avatarPath = path;
        }
        user.username = editProfileParam.username;
        user.email = editProfileParam.email;
        user.phoneNumber = editProfileParam.phoneNumber;
        user.address = editProfileParam.address;

        const userSave = await this.userService.create(user);
        if (userSave) {
            const successResponse: any = {
                status: 1,
                message: 'Successfully updated profile',
                data: userSave,
            };
            return response.status(200).send(successResponse);
        } else {
            const errorResponse: any = {
                status: 0,
                message: 'unable to edit profile',
            };
            return response.status(400).send(errorResponse);
        }
    }
    /**
     * @api {post} /api/auth/search Pageuser Search Tag API
     * @apiGroup Tag
     * @apiParam (Request body) {number} limit limit
     * @apiParam (Request body) {number} offset offset
     * @apiParam (Request body) {String} select select
     * @apiParam (Request body) {String} relation relation
     * @apiParam (Request body) {String} whereConditions whereConditions
     * @apiParam (Request body) {boolean} count count (0=false, 1=true)
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *    "message": "Successfully get auth search",
     *    "data":{
     *    "name" : "",
     *    "description": "",
     *     }
     *    "status": "1"
     *  }
     * @apiSampleRequest /api/auth/search
     * @apiErrorExample {json} auth error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/search')
    public async userSearh(@Body({ validate: true }) filter: SearchFilter, @Res() response: any): Promise<any> {
        const userLists: any = await this.userService.search(filter.limit, filter.offset, filter.select, filter.relation, filter.whereConditions, filter.orderBy, filter.count);
        // console.log(userLists);
        if (!userLists) {
            const errorResponse = ResponceUtil.getErrorResponce('Unable got search user', undefined);
            return response.status(400).send(errorResponse);

        } else {
            const successResponse = ResponceUtil.getSucessResponce('Successfully got search user', userLists);
            return response.status(200).send(successResponse);
        }
    }

    // Log user API
    /**
     * @api {post} /auth/log Search Log
     * @apiGroup Authentication
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
     *      "message": "Successfully get user list",
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
     * @apiSampleRequest /api/auth/log/search
     * @apiErrorExample {json} Page error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/log/search')
    @Authorized()
    public async logUser(@Body({ validate: true }) searchFilter: SearchFilter, @Res() response: any): Promise<any> {

        const userLogList = await this.loginLogService.search(searchFilter);
        if (userLogList) {
            const successRes: any = ResponceUtil.getSucessResponce('Successfully got user log.', userLogList);
            return response.status(200).send(successRes);
        } else {
            const errorResponse: any = ResponceUtil.getErrorResponce('Error get user log list.', undefined);
            return response.status(400).send(errorResponse);
        }
    }
}
