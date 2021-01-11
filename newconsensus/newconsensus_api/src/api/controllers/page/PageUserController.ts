/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import 'reflect-metadata';
import { Post, Body, JsonController, Res, Authorized, Req, Get, QueryParam } from 'routing-controllers';
import { classToPlain } from 'class-transformer';
import jwt from 'jsonwebtoken';
import { MAILService } from '../../../auth/mail.services';
import { BasePageUserRegisterRequest } from './requests/BasePageUserRegisterRequest';
import { PageUserRegisterRequest } from './requests/PageUserRegisterRequest';
import { PageUserRegisterFBRequest } from './requests/PageUserRegisterFBRequest';
import { PageUserLogin } from './requests/PageUserLoginRequest';
import { PageUserFBLogin } from './requests/PageUserFBLoginRequest';
import { ChangePassword } from './requests/changePasswordRequest';
import { PageUser } from '../../models/PageUser';
import { PageUserService } from '../../services/PageUserService';
import { LoginLogService } from '../../services/LoginLogService';
import { PageUserEditProfileRequest } from './requests/PageUserEditProfileRequest';
import { env } from '../../../env';
import { LoginLog } from '../../models/LoginLog';
import { EmailTemplateService } from '../../services/EmailTemplateService';
import { ImageService } from '../../services/ImageService';
import { S3Service } from '../../services/S3Service';
import { FacebookService } from '../../services/FacebookService';
import { AuthService } from '../../../auth/AuthService';
import { AddressPostcodeService } from '../../services/AddressPostcodeService';
import { SearchFilter } from '../requests/SearchFilterRequest';
import { ResponceUtil } from '../../../utils/ResponceUtil';
import { DebateCommentService } from '../../services/DebateCommentService';
import { ProposalCommentService } from '../../services/ProposalCommentService';
import { VoteCommentService } from '../../services/VoteCommentService';
import { ObjectUtil } from '../../../utils/ObjectUtil';
import { ConfigService } from '../../services/ConfigService';
import { USER_EXPIRED_TIME_CONFIG, CALCULATOR_USER_EXP_LEVEL_CONFIG_NAME, DEFAULT_CALCULATOR_USER_EXP_LEVEL_CONFIG, } from '../../../Constants';
import { UserExpStatementService } from '../../services/UserExpStatementService';

@JsonController('/pageuser')
export class PageUserController {
    constructor(private pageUserService: PageUserService, private s3Service: S3Service,
        private imageService: ImageService, private loginLogService: LoginLogService,
        private emailTemplateService: EmailTemplateService, private facebookService: FacebookService,
        private authService: AuthService, private postcodeService: AddressPostcodeService,
        private debateCommentService: DebateCommentService,
        private proposalCommentService: ProposalCommentService,
        private voteCommentService: VoteCommentService,
        private configService: ConfigService, private userExpStmtService: UserExpStatementService) {
    }

    // PageUser Register API
    /**
     * @api {post} /api/pageuser/register register API
     * @apiGroup PageUser
     * @apiParam (Request body) {String} name Name
     * @apiParam (Request body) {String} password User Password
     * @apiParam (Request body) {String} confirmPassword Confirm Password
     * @apiParam (Request body) {String} emailId User Email Id
     * @apiParam (Request body) {String} postcode User postcode
     * @apiParam (Request body) {String} identification User identification
     * @apiParam (Request body) {String} education User education
     * @apiParamExample {json} Input
     * {
     *      "name" : "",
     *      "password" : "",
     *      "confirmPassword" : "",
     *      "emailId" : "",
     *      "gender" : "",
     *      "birthday" : "",
     *      "postcode" : "",
     *      "identification" : "",
     *      "education" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Thank you for registering with us and please check your email",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/pageuser/register
     * @apiErrorExample {json} Register error
     * HTTP/1.1 500 Internal Server Error
     */
    // PageUser Register Function
    @Post('/register')
    public async register(@Body({ validate: true }) registerParam: PageUserRegisterRequest, @Req() request: any, @Res() response: any): Promise<any> {
        const newUser = this.createBasePageUser(registerParam);
        newUser.password = await PageUser.hashPassword(registerParam.password);
        newUser.isActive = 1;

        newUser.ip = (request.headers['x-forwarded-for'] ||
            request.connection.remoteAddress ||
            request.socket.remoteAddress ||
            request.connection.socket.remoteAddress).split(',')[0];
        const resultUser = await this.pageUserService.findOne({ where: { email: registerParam.emailId, deleteFlag: 0 } });
        if (resultUser) {
            const successResponse: any = {
                status: 1,
                message: 'You already registered please login.',
            };
            return response.status(400).send(successResponse);
        }
        const citizenId = await this.pageUserService.findOne({ where: { identificationCode: registerParam.identificationCode } });
        if (citizenId) {
            const dupErrorResponse: any = {
                status: 1,
                message: 'You already identification code please login.',
            };
            return response.status(400).send(dupErrorResponse);
        }

        // check postcode
        if (newUser.postcode !== null && newUser.postcode !== undefined) {
            const zipcode = await this.postcodeService.findZipcode(newUser.postcode + '');
            if (!zipcode) {
                const postcodeErrorResponse: any = {
                    status: 1,
                    message: 'Postcode was invalid.',
                };
                return response.status(400).send(postcodeErrorResponse);
            }
            newUser.province = zipcode.province;
        }
        // set image if exist
        // parse image if exist
        if (registerParam.avatar !== undefined && registerParam.avatar !== '') {
            const images = registerParam.avatar;
            const base64Data = new Buffer(images.replace(/^data:image\/\w+;base64,/, ''), 'base64');
            const type = registerParam.avatar.split(';')[0].split('/')[1];
            const name = 'Img_' + Date.now() + '.' + type; // path.extname(file.originalname);
            const path = 'customer/';

            await this.imageService.imageUpload((path + name), base64Data);
            newUser.avatar = name;
            newUser.avatarPath = path;
        }

        if (registerParam.password === registerParam.confirmPassword) {
            let resultData = await this.pageUserService.create(newUser);
            if (resultData) {
                resultData = this.pageUserService.cleanPageUserField(resultData);
                const successResponse: any = {
                    status: 1,
                    message: 'Thank you for registering with us. ',
                    data: classToPlain(resultData),
                };
                return response.status(200).send(successResponse);
            } else {
                const errorResponse: any = {
                    status: 0,
                    message: 'Registration unsuccessful. ',
                };
                return response.status(400).send(errorResponse);

            }
            // const emailContent = await this.emailTemplateService.findOne(1);
            // const message = emailContent.content.replace('{name}', resultData.firstName);
            // const sendMailRes = MAILService.registerMail(message, resultData.email, emailContent.subject);
            // if (sendMailRes) {
            //     const successResponse: any = {
            //         status: 1,
            //         message: 'Thank you for registering with us. Kindly check your email inbox for further details. ',
            //         data: classToPlain(resultData),
            //     };
            //     return response.status(200).send(successResponse);
            // } else {
            //     const errorResponse: any = {
            //         status: 0,
            //         message: 'Registration successful, but unable to send email. ',
            //     };
            //     return response.status(400).send(errorResponse);
            // }
        }
        const errorPasswordResponse: any = {
            status: 0,
            message: 'A mismatch between password and confirm password. ',
        };
        return response.status(400).send(errorPasswordResponse);
    }

    // PageUser Register By Facebook API
    /**
     * @api {post} /api/pageuser/register_fb register API
     * @apiGroup PageUser
     * @apiParam (Request body) {String} firstName First name
     * @apiParam (Request body) {String} lastName Last name
     * @apiParam (Request body) {String} emailId User Email Id
     * @apiParam (Request body) {Number} phoneNumber User Phone Number (Optional)
     * @apiParamExample {json} Input
     * {
     *      "firstName" : "",
     *      "lastName" : "",
     *      "emailId" : "",
     *      "displayName" : "",
     *      "gender" : "",
     *      "birthday" : "",
     *      "postcode" : "",
     *      "phoneNumber" : "",
     *      "fbUserId" : "",
     *      "fbToken" : "",
     *      "fbAccessExpirationTime" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Thank you for registering with us.",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/pageuser/register_fb
     * @apiErrorExample {json} Register error
     * HTTP/1.1 500 Internal Server Error
     */
    // PageUser Register Function
    @Post('/register_fb')
    public async registerByFacebook(@Body({ validate: true }) registerParam: PageUserRegisterFBRequest, @Req() request: any, @Res() response: any): Promise<any> {
        const newUser = this.createBasePageUser(registerParam);
        // facebook
        newUser.fbUserId = registerParam.fbUserId;
        newUser.fbToken = registerParam.fbToken;
        newUser.fbAccessExpirationTime = registerParam.fbAccessExpirationTime;

        // set active with ip
        newUser.isActive = 1;
        newUser.ip = (request.headers['x-forwarded-for'] ||
            request.connection.remoteAddress ||
            request.socket.remoteAddress ||
            request.connection.socket.remoteAddress).split(',')[0];
        const resultUser = await this.pageUserService.findOne({ where: { email: registerParam.emailId, deleteFlag: 0 } });
        if (resultUser) {
            const dupErrorResponse: any = {
                status: 1,
                message: 'You already registered please login.',
            };
            return response.status(400).send(dupErrorResponse);
        }
        if (registerParam.identificationCode !== '' && registerParam.identificationCode !== null && registerParam.identificationCode !== undefined) {

            const citizenId = await this.pageUserService.findOne({ where: { identificationCode: registerParam.identificationCode } });
            if (citizenId) {
                const dupErrorResponse: any = {
                    status: 1,
                    message: 'You already identification code please login.',
                };
                return response.status(400).send(dupErrorResponse);
            }
        }

        // check postcode
        if (newUser.postcode !== null && newUser.postcode !== undefined) {
            const zipcode = await this.postcodeService.findZipcode(newUser.postcode + '');
            if (!zipcode) {
                const postcodeErrorResponse: any = {
                    status: 1,
                    message: 'Postcode was invalid.',
                };
                return response.status(400).send(postcodeErrorResponse);
            }
            newUser.province = zipcode.province;
        }
        // set image if exist
        // parse image if exist
        if (registerParam.avatar !== undefined) {

            const base64Data = new Buffer(registerParam.avatar.replace(/^data:image\/\w+;base64,/, ''), 'base64');
            const type = registerParam.avatar.split(';')[0].split('/')[1];
            const name = 'Img_' + Date.now() + '.' + type; // path.extname(file.originalname);
            const path = 'customer/';

            await this.imageService.imageUpload((path + name), base64Data);
            newUser.avatar = name;
            newUser.avatarPath = path;
        }
        // generate long term token
        // random pass and create user with facebook
        const randomPassword = Math.floor(Math.random() * 100000);
        newUser.password = await PageUser.hashPassword(randomPassword + '');
        // create user
        const resultData = await this.pageUserService.create(newUser);
        const successResponse: any = {
            status: 1,
            message: 'Thank you for registering with us. Kindly check your email inbox for further details. ',
            data: {
                token: newUser.fbToken,
                user: classToPlain(resultData)
            },
        };
        return response.status(200).send(successResponse);

        // // send Email !implement
        // const emailContent = await this.emailTemplateService.findOne(11);
        // const message = emailContent.content.replace('{name}', resultData.firstName)
        // .replace('{password}', randomPassword);
        // const sendMailRes = MAILService.registerMail(message, resultData.email, emailContent.subject);
        // if (sendMailRes) {
        //     const successResponse: any = {
        //         status: 1,
        //         message: 'Thank you for registering with us. Kindly check your email inbox for further details. ',
        //         data: classToPlain(resultData),
        //     };
        //     return response.status(200).send(successResponse);
        // } else {
        //     const errorResponse: any = {
        //         status: 0,
        //         message: 'Registration successful, but unable to send email. ',
        //     };
        //     return response.status(400).send(errorResponse);
        // }
    }

    // Forgot Password API
    /**
     * @api {post} /api/pageuser/forgot-password Forgot Password API
     * @apiGroup PageUser
     * @apiParam (Request body) {String} emailId User Email Id
     * @apiParamExample {json} Input
     * {
     *      "emailId" : ""
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Thank you,Your password send to your mail id please check your email.",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/pageuser/forgot-password
     * @apiErrorExample {json} Forgot Password error
     * HTTP/1.1 500 Internal Server Error
     */
    // Forgot Password Function
    @Post('/forgot-password')
    public async forgotPassword(@Body({ validate: true }) forgotparam: any, @Res() response: any): Promise<any> {
        const resultData = await this.pageUserService.findOne({ where: { email: forgotparam.emailId, deleteFlag: 0 } });
        if (!resultData) {
            const errorResponse: any = {
                status: 0,
                message: 'Invalid Email Id',
            };
            return response.status(400).send(errorResponse);
        }
        const tempPassword: any = Math.random().toString().substr(2, 5);
        resultData.password = await PageUser.hashPassword(tempPassword);
        const updateUserData = await this.pageUserService.update(resultData.id, resultData);
        const emailContent = await this.emailTemplateService.findOne(2);
        const message = emailContent.content.replace('{name}', updateUserData.username).replace('{xxxxxx}', tempPassword);
        emailContent.content = message;
        const sendMailRes = MAILService.passwordForgotMail(message, updateUserData.email, emailContent.subject);
        if (sendMailRes) {
            const successResponse: any = {
                status: 1,
                message: 'Your password has been sent to your email inbox.',
            };
            return response.status(200).send(successResponse);
        } else {
            const errorResponse: any = {
                status: 0,
                message: 'Error in sending email, Invalid email.',
            };
            return response.status(400).send(errorResponse);
        }
    }

    // Login API
    /**
     * @api {post} /api/pageuser/login login API
     * @apiGroup PageUser
     * @apiParam (Request body) {String} emailId User Email Id
     * @apiParam (Request body) {String} password User Password
     * @apiParamExample {json} Input
     * {
     *      "emailId" : "",
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
     * @apiSampleRequest /api/pageuser/login
     * @apiErrorExample {json} Login error
     * HTTP/1.1 500 Internal Server Error
     */
    // Login Function
    @Post('/login')
    public async login(@Body({ validate: true }) loginParam: PageUserLogin, @Req() request: any, @Res() response: any): Promise<any> {

        const resultData = await this.pageUserService.findOne({
            select: ['id', 'firstName', 'displayName', 'email', 'mobileNumber', 'password', 'avatar', 'avatarPath', 'isActive', 'level', 'currentExp'],
            where: { email: loginParam.emailId, deleteFlag: 0 },
        });
        if (!resultData) {
            const errorUserNameResponse: any = {
                status: 0,
                message: 'Invalid EmailId.',
            };
            return response.status(400).send(errorUserNameResponse);
        }
        if (resultData.isActive === 0) {
            const errorUserInActiveResponse: any = {
                status: 0,
                message: 'InActive PageUser.',
            };
            return response.status(400).send(errorUserInActiveResponse);
        }
        if (resultData.deleteFlag === 1) {
            const errorUserInActiveResponse: any = {
                status: 0,
                message: 'Baned PageUser.',
            };
            return response.status(400).send(errorUserInActiveResponse);
        }
        if (await PageUser.comparePassword(resultData, loginParam.password)) {
            // get config
            const defaultExpired = await this.configService.getConfig(USER_EXPIRED_TIME_CONFIG);
            // create a token
            const token = jwt.sign({ id: resultData.id }, env.SECRET_KEY, { expiresIn: defaultExpired.value });
            const loginLog = new LoginLog();
            loginLog.userId = resultData.id;
            loginLog.emailId = resultData.email;
            loginLog.firstName = resultData.firstName;
            loginLog.ipAddress = (request.headers['x-forwarded-for'] ||
                request.connection.remoteAddress ||
                request.socket.remoteAddress ||
                request.connection.socket.remoteAddress).split(',')[0];
            const savedloginLog = await this.loginLogService.create(loginLog);
            const customer = await this.pageUserService.findOne({ where: { email: loginParam.emailId, deleteFlag: 0 } });
            customer.lastLogin = savedloginLog.createdDate;
            await this.pageUserService.create(customer);
            const successResponse: any = {
                status: 1,
                message: 'Loggedin successfully',
                data: {
                    token,
                    user: classToPlain(resultData),
                },
            };
            return response.status(200).send(successResponse);
        }
        const errorResponse: any = {
            status: 0,
            message: 'Invalid password',
        };
        return response.status(400).send(errorResponse);
    }

    // Login With FB API
    /**
     * @api {post} /api/pageuser/login_fb login With Facebook API
     * @apiGroup PageUser
     * @apiParam (Request body) {String} token Facebook User Token
     * @apiParamExample {json} Input
     * {
     *      "token" : ""
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "data": "{
     *         "token":'',
     *          "user":''
     *      }",
     *      "message": "Successfully login",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/pageuser/login_fb
     * @apiErrorExample {json} Login error
     * HTTP/1.1 500 Internal Server Error
     */
    // Login Function
    @Post('/login_fb')
    public async loginWithFacebook(@Body({ validate: true }) loginParam: PageUserFBLogin, @Req() request: any, @Res() response: any): Promise<any> {

        const checkAccessToken = await this.facebookService.checkAccessToken(loginParam.token);

        if (checkAccessToken === undefined) {
            const errorResponse: any = {
                status: 0,
                message: 'Invalid Token.',
            };
            return response.status(400).send(errorResponse);
        }

        if (checkAccessToken.error !== undefined) {
            const errorResponse: any = {
                status: 0,
                message: checkAccessToken.error.message,
            };
            return response.status(400).send(errorResponse);
        }

        if (checkAccessToken.data === undefined) {
            const errorResponse: any = {
                status: 0,
                message: 'Invalid Token.',
            };
            return response.status(200).send(errorResponse);
        }

        const expiresAt = checkAccessToken.data.expires_at;
        const today = new Date();
        if (expiresAt < today.getDate()) {
            const errorResponse: any = {
                status: 0,
                code: 'E3000002',
                message: 'User token expired.',
            };
            return response.status(400).send(errorResponse);
        }

        let pageUser = await this.facebookService.getPageUser(loginParam.token);
        if (!pageUser) {
            const errorUserNameResponse: any = {
                status: 0,
                code: 'E3000001',
                message: 'User was not found.',
            };
            return response.status(400).send(errorUserNameResponse);
        }
        if (pageUser.error !== undefined) {
            const errorResponse: any = {
                status: 0,
                message: pageUser.error.message,
            };
            return response.status(400).send(errorResponse);
        }
        if (pageUser.isActive === 0) {
            const errorUserInActiveResponse: any = {
                status: 0,
                message: 'InActive PageUser.',
            };
            return response.status(400).send(errorUserInActiveResponse);
        }
        if (pageUser.deleteFlag === 1) {
            const errorUserInActiveResponse: any = {
                status: 0,
                message: 'Baned PageUser.',
            };
            return response.status(400).send(errorUserInActiveResponse);
        }

        // update expired-at
        pageUser.fbToken = loginParam.token;
        pageUser.fbAccessExpirationTime = expiresAt;
        pageUser = await this.pageUserService.update(pageUser.id, pageUser);

        const successResponse: any = {
            status: 1,
            message: 'Loggedin successfully',
            data: {
                token: pageUser.fbToken,
                user: classToPlain(pageUser),
            },
        };
        return response.status(200).send(successResponse);
    }

    // Check UserStatus With token
    /**
     * @api {get} /api/pageuser/check_status Check UserStatus with token
     * @apiGroup PageUser
     * @apiHeader {String} Mode
     * @apiParam (Request body) {String} token Facebook User Token
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "data": "{
     *         "user":''
     *      }",
     *      "message": "Account was valid",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/pageuser/check_status
     * @apiErrorExample {json} User Token error
     * HTTP/1.1 500 Internal Server Error
     */
    // Check Account Status Function
    @Get('/check_status')
    public async checkAccountStatus(@QueryParam('token') tokenParam: string, @Req() request: any, @Res() response: any): Promise<any> {
        const isFBMode = request.header('mode');

        let pageUser;

        if (isFBMode !== undefined && isFBMode === 'FB') {
            try {
                pageUser = await this.facebookService.getPageUser(tokenParam);
            } catch (ex) {
                const errorResponse: any = {
                    status: 0,
                    message: ex.message,
                };
                return response.status(400).send(errorResponse);
            }
        } else {
            const pageUserId = await this.authService.decryptToken(tokenParam);
            if (pageUserId !== undefined) {
                pageUser = await this.pageUserService.findOne({
                    where: {
                        id: pageUserId,
                    },
                });
            }
        }
        if (!pageUser) {
            const errorUserNameResponse: any = {
                status: 0,
                code: 'E3000001',
                message: 'User was not found.',
            };
            return response.status(400).send(errorUserNameResponse);
        }
        if (pageUser.error !== undefined) {
            const errorResponse: any = {
                status: 0,
                message: pageUser.error.message,
            };
            return response.status(400).send(errorResponse);
        }
        // check expire token
        if (isFBMode) {
            const today = new Date();
            if (pageUser.fbAccessExpirationTime < today.getDate()) {
                const errorUserNameResponse: any = {
                    status: 0,
                    code: 'E3000002',
                    message: 'User token expired.',
                };
                return response.status(400).send(errorUserNameResponse);
            }
        } else {
            // ! implement check expired for normal mode
        }
        const userData = await this.userExpStmtService.userExp(pageUser.id);
        
        if (userData) {
            let score = 0;
            for (const userLevel of userData) {
                if(userLevel.expcount !== null){
                    score = parseFloat(userLevel.expcount);
                }
            }
            
            let constA = await this.configService.getConfig(CALCULATOR_USER_EXP_LEVEL_CONFIG_NAME.constA);
            let constB = await this.configService.getConfig(CALCULATOR_USER_EXP_LEVEL_CONFIG_NAME.constB);
            let constC = await this.configService.getConfig(CALCULATOR_USER_EXP_LEVEL_CONFIG_NAME.constC);
            if(constA === undefined){
                constA = DEFAULT_CALCULATOR_USER_EXP_LEVEL_CONFIG.CONSTA;
            } 
            if (constB === undefined){
                constB = DEFAULT_CALCULATOR_USER_EXP_LEVEL_CONFIG.CONSTB;
            }
            if(constC === undefined){
                constC = DEFAULT_CALCULATOR_USER_EXP_LEVEL_CONFIG.CONSTC;
            }

            pageUser.currentExp = score;
            const level = Math.max(Math.floor(Number(constA.value) * Math.log(score + Number(constC.value)) + (Number(constB.value))), 1);
            pageUser.level = level;
            pageUser.id = Number(pageUser.id);
            const dataUser = await this.pageUserService.updateExpUser(undefined, pageUser);

            if (!dataUser) {
                const errorResponse = ResponceUtil.getSucessResponce('User Exp State was update.', undefined);
                return response.status(400).send(errorResponse);
            }
        }

        delete pageUser.fbUserId;
        delete pageUser.fbToken;
        delete pageUser.fbAccessExpirationTime;
        delete pageUser.fbSignedRequest;
        delete pageUser.identificationCode;
        delete pageUser.ip;
        delete pageUser.password;
        delete pageUser.createdBy;
        delete pageUser.createdByUsername;
        delete pageUser.oauthData;
        delete pageUser.modifiedBy;
        delete pageUser.modifiedByUsername;

        const successResponse: any = {
            status: 1,
            message: 'Account was valid.',
            data: {
                user: classToPlain(pageUser),
            },
        };
        return response.status(200).send(successResponse);

    }

    // !implement logout
    /**
     * @api {post} /api/pageuser/logout Logout Page User
     * @apiGroup PageUser
     * @apiParam (Request body) {String} token Facebook User Token
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "data": "{
     *         "user":''
     *      }",
     *      "message": "Logout Page User",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/pageuser/logout
     * @apiErrorExample {json} User Token error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/logout')
    @Authorized('customer')
    public async logout(@Req() request: any, @Res() response: any): Promise<any> {
        const user = await this.pageUserService.findOne({
            where: {
                id: request.user.id,
            },
        });
        if (!user) {
            const errorResponse: any = {
                status: 0,
                message: 'Invalid token',
            };
            return response.status(400).send(errorResponse);
        }
        user.fbToken = null;
        const deleteToken = await this.pageUserService.update(user.id, user);
        if (!deleteToken) {
            const successResponse: any = {
                status: 1,
                message: 'Successfully Logout',
            };
            return response.status(200).send(successResponse);
        } else {
            const errorResponse: any = {
                status: 0,
                message: 'Unable Logout',
            };
            return response.status(200).send(errorResponse);
        }
    }

    // Change Password API
    /**
     * @api {post} /api/pageuser/change-password Change Password API
     * @apiGroup PageUser
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {String} oldPassword Old Password
     * @apiParam (Request body) {String} newPassword New Password
     * @apiParamExample {json} Input
     *      "oldPassword" : "",
     *      "newPassword" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Your password changed successfully",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/pageuser/change-password
     * @apiErrorExample {json} Change Password error
     * HTTP/1.1 500 Internal Server Error
     */
    // Change Password Function
    @Post('/change-password')
    @Authorized('customer')
    public async changePassword(@Body({ validate: true }) changePasswordParam: ChangePassword, @Req() request: any, @Res() response: any): Promise<any> {

        const resultData = await this.pageUserService.findOne({ where: { id: request.user.id } });
        if (await PageUser.comparePassword(resultData, changePasswordParam.oldPassword)) {
            const val = await PageUser.comparePassword(resultData, changePasswordParam.newPassword);
            if (val) {
                const errResponse: any = {
                    status: 0,
                    message: 'you are given a same password, please try different one',
                };
                return response.status(400).send(errResponse);
            }
            resultData.password = await PageUser.hashPassword(changePasswordParam.newPassword);
            const updateUserData = await this.pageUserService.update(resultData.id, resultData);
            if (updateUserData) {
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

    // Get PageUser Profile API
    /**
     * @api {get} /api/pageuser/get-profile Get Profile API
     * @apiGroup PageUser
     * @apiHeader {String} Authorization
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully Get the Profile..!",
     *      "status": "1"
     *       "data":{}
     * }
     * @apiSampleRequest /api/pageuser/get-profile
     * @apiErrorExample {json} Get Profile error
     * HTTP/1.1 500 Internal Server Error
     */
    // Get Profile Function
    @Get('/get-profile')
    @Authorized('customer')
    public async getProfile(@Req() request: any, @Res() response: any): Promise<any> {
        const resultData = await this.pageUserService.findOne({ where: { id: request.user.id } });
        // remove hidden field
        delete resultData.fbUserId;
        delete resultData.fbToken;
        delete resultData.fbAccessExpirationTime;
        delete resultData.fbSignedRequest;
        delete resultData.password;
        delete resultData.createdBy;
        delete resultData.createdByUsername;
        delete resultData.oauthData;
        delete resultData.modifiedBy;
        delete resultData.modifiedByUsername;
        delete resultData.identificationCode;
        delete resultData.classId;
        delete resultData.deleteFlag;
        delete resultData.customerGroupId;
        delete resultData.safe;
        delete resultData.mailStatus;

        const successResponse: any = {
            status: 1,
            message: 'Successfully Get the Profile.',
            data: resultData,
        };
        return response.status(200).send(successResponse);
    }

    // PageUser Edit Profile API
    /**
     * @api {post} /api/pageuser/edit-profile Edit Profile API
     * @apiGroup PageUser
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {String} firstName First Name
     * @apiParam (Request body) {String} lastName Last Name
     * @apiParam (Request body) {String} password password
     * @apiParam (Request body) {String} emailId User Email Id
     * @apiParam (Request body) {Number} phoneNumber User Phone Number (Optional)
     * @apiParam (Request body) {String} image PageUser Image
     * @apiParamExample {json} Input
     * {
     *      "firstName" : "", *
     *      "lastName" : "", *
     *      "displayName" "", *
     *      "gender" : "", *
     *      "birthday" "", *
     *      "postcode" : "", *
     *      "carrer" : "", *
     *      "phoneNumber" : "",
     *      "image": "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully updated your profile.",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/pageuser/edit-profile
     * @apiErrorExample {json} Register error
     * HTTP/1.1 500 Internal Server Error
     */
    // PageUser Profile Edit Function
    @Post('/edit-profile')
    @Authorized('customer')
    public async editProfile(@Body({ validate: true }) customerEditProfileRequest: PageUserEditProfileRequest, @Req() request: any, @Res() response: any): Promise<any> {
        const image = customerEditProfileRequest.avatar;
        let name;

        const resultData = await this.pageUserService.findOne({
            select: ['id', 'firstName', 'lastName', 'mobileNumber', 'avatar', 'avatarPath',
                'displayName', 'gender', 'birthday', 'province', 'postcode', 'career', 'education', 'currentExp'],
            where: { id: request.user.id },
        });
        if (image) {
            const base64Data = new Buffer(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
            const type = image.split(';')[0].split('/')[1];
            name = 'Img_' + Date.now() + '.' + type; // path.extname(file.originalname);
            const path = 'customer/';
            let val: any;
            if (env.imageserver === 's3') {
                val = await this.s3Service.imageUpload((path + name), base64Data, type);
            } else {
                val = await this.imageService.imageUpload((path + name), base64Data);
            }
            console.log(val);
            
            resultData.avatar = name;
            resultData.avatarPath = path;
        }
        resultData.firstName = customerEditProfileRequest.firstName;
        resultData.lastName = customerEditProfileRequest.lastName;
        resultData.mobileNumber = customerEditProfileRequest.mobileNumber;
        resultData.career = customerEditProfileRequest.career;
        resultData.education = customerEditProfileRequest.education;
        
        if (customerEditProfileRequest.displayName !== undefined) {
            resultData.displayName = customerEditProfileRequest.displayName;
        }
        if (customerEditProfileRequest.gender !== undefined) {
            resultData.gender = customerEditProfileRequest.gender;
        }
        if (customerEditProfileRequest.birthday !== undefined) {
            resultData.birthday = customerEditProfileRequest.birthday;
        }
        if (customerEditProfileRequest.postcode !== undefined) {
            // update postcode and province
            resultData.postcode = customerEditProfileRequest.postcode;
            // ! resultData.province = "resolve for province";
        }
        const updateUserData = await this.pageUserService.update(resultData.id, resultData);
        if (updateUserData) {
            const successResponseResult: any = {
                status: 1,
                message: 'Your profile Update Successfully.',
                data: classToPlain(updateUserData),
            };
            return response.status(200).send(successResponseResult);
        }

        const updateuserData = await this.pageUserService.update(resultData.id, resultData);
        // remove hidden field
        delete updateuserData.fbUserId;
        delete updateuserData.fbToken;
        delete updateuserData.fbAccessExpirationTime;
        delete updateuserData.fbSignedRequest;
        delete updateuserData.password;
        delete updateuserData.createdBy;
        delete updateuserData.createdByUsername;
        delete updateuserData.oauthData;
        delete updateuserData.modifiedBy;
        delete updateuserData.modifiedByUsername;

        const successResponse: any = {
            status: 1,
            message: 'Your profile Update Successfully.',
            data: classToPlain(updateuserData),
        };
        return response.status(200).send(successResponse);
    }

    // logList API
    /**
     * @api {get} /api/pageuser/login-log-list Login Log list API
     * @apiGroup PageUser
     * @apiParam (Request body) {Number} limit limit
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully get login log list",
     *      "data":{
     *      "id"
     *      "userId"
     *      "emailId"
     *      "firstName"
     *      "ipAddress"
     *      "createdDate"
     *      }
     * }
     * @apiSampleRequest /api/pageuser/login-log-list
     * @apiErrorExample {json} Front error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/login-log-list')
    @Authorized('customer')
    public async LogList(@QueryParam('limit') limit: number, @Req() request: any, @Res() response: any): Promise<any> {
        // const loginLogList = await this.loginLogService.logList(limit);
        const loginLogList = await this.loginLogService.pageUserLogList(request.user.id, limit);
        const promise = loginLogList.map(async (result: any) => {
            const moment = require('moment');
            const createdDate = moment.utc(result.createdDate).local().format('YYYY-MM-DD');
            const temp: any = result;
            temp.createdDate = createdDate;
            return temp;
        });
        const finalResult = await Promise.all(promise);
        const successResponse: any = {
            status: 1,
            message: 'Successfully get login Log list',
            data: finalResult,
        };
        return response.status(200).send(successResponse);

    }
    // Search PageUser Debate Comment API
    /**
     * @api {post} /api/pageuser/debate/comment/search Search PageUser Debate Comment
     * @apiGroup PageUser
     * @apiParam (Request body) {number} limit limit
     * @apiParam (Request body) {number} offset offset
     * @apiParam (Request body) {String} select select
     * @apiParam (Request body) {String} relation relation
     * @apiParam (Request body) {String} whereConditions whereConditions
     * @apiParam (Request body) {boolean} count count (0=false, 1=true)
     * @apiParamExample {json} Input
     * {
     *      "id" : "",
     *      "title" : "",
     *      "content" : "",
     *      "likeCount" : "",
     *      "dislikeCount" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Search Debate Successfully",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/pageuser/debate/comment/search
     * @apiErrorExample {json} Debate error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/debate/comment/search')
    @Authorized('customer')
    public async searchUserDebateComment(@Body() filter: SearchFilter, @QueryParam('show_user') showUser: boolean, @Res() response: any): Promise<any> {
        try {
            if (filter === null || filter === undefined) {
                return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
            }

            let join: any = undefined;
            if (showUser) {
                join = {
                    alias: 'dbComment',
                    leftJoinAndSelect: {
                        pageuser: 'dbComment.pageUser'
                    }
                };
            }

            let debateComment: any[] = await this.debateCommentService.search(filter, join);
            if (!filter.count) {
                debateComment = this.cleanPageUser(debateComment);
            }

            if (debateComment.length > 0) {
                return response.status(200).send(ResponceUtil.getSucessResponce('Search Debate Comment Successful', debateComment));
            } else {
                return response.status(200).send(ResponceUtil.getSucessResponce('Search Debate Comment Successful', []));
            }
        } catch (error) {
            return response.status(400).send(ResponceUtil.getErrorResponce('Cannot Search Debate Comment', error));

        }
    }
    // Proposal PageUser Commemt Search API
    /**
     * @api {Post} /api/pageuser/proposal/comment/search Proposal Comment Search API
     * @apiGroup PageUser
     * @apiParam (Request body) {number} limit limit
     * @apiParam (Request body) {number} offset offset
     * @apiParam (Request body) {String} select select
     * @apiParam (Request body) {String} relation relation
     * @apiParam (Request body) {String} whereConditions whereConditions
     * @apiParam (Request body) {boolean} isCount isCount (0=false, 1=true)   
     * @apiParam {boolean} show_user flag that will make data return user
     * @apiParam {number} userLike user's id fetch data user like
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "status": "1"
     *      "message": "Successfully get proposal list",
     *      "data":{
     *              "id" : "",
     *              "roomId" : "",
     *              "approveUserId" : "",
     *              "approveDate" : "",
     *              "likeCount" : "",
     *              "dislikeCount" : "",
     *              "endDate" : "",
     *      }
     * }
     * @apiSampleRequest /api/pageuser/proposal/comment/search
     * @apiErrorExample {json} Page error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/proposal/comment/search')
    @Authorized('customer')
    public async searchProposalComment(@Body({ validate: true }) filter: SearchFilter, @QueryParam('show_user') showUser: boolean, @Res() response: any): Promise<any> {
        try {
            if (filter === null || filter === undefined) {
                return response.status(400).send(ResponceUtil.getErrorResponce('error', undefined));
            }
            
            let join: any = undefined;
            if (showUser) {
                join = {
                    alias: 'pcomment',
                    leftJoinAndSelect: {
                        pageuser: 'pcomment.pageUser'
                    }
                };
            }

            let proposalComment: any[] = await this.proposalCommentService.search(filter.limit, filter.offset, filter.select, filter.relation, filter.whereConditions, filter.orderBy, filter.count, join);
            if (!filter.count) {
                proposalComment = this.cleanPageUser(proposalComment);
            }

            if (proposalComment.length > 0) {
                return response.status(200).send(ResponceUtil.getSucessResponce('Search Debate Comment Successful', proposalComment));
            } else {
                return response.status(200).send(ResponceUtil.getSucessResponce('Search Debate Comment Successful', []));
            }
        } catch (error) {
            return response.status(400).send(ResponceUtil.getErrorResponce('Cannot Search Debate Comment', error));

        }
    }
    // VoteComment API
    // Search API
    /**
     * @api {post} /api/pageuser/vote/comment/search  Search API
     * @apiGroup PageUser
     * @apiParam (Request body) {number} limit limit
     * @apiParam (Request body) {number} offset offset
     * @apiParam (Request body) {String} select select
     * @apiParam (Request body) {String} relation relation
     * @apiParam (Request body) {String} whereConditions whereConditions
     * @apiParam (Request body) {boolean} isCount isCount (0=false, 1=true)
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Search VoteComment Successfully",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/pageuser/vote/comment/search
     * @apiErrorExample {json} voteComment error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/vote/comment/search')
    @Authorized('customer')
    public async searchVoteComment(@Body() filter: SearchFilter, @QueryParam('show_user') showUser: boolean, @Res() response: any): Promise<any> {
        try {
            if (filter === null || filter === undefined) {
                return response.status(400).send(ResponceUtil.getErrorResponce('Invalid Search', undefined));
            }

            let join: any = undefined;
            if (showUser) {
                join = {
                    alias: 'voteComment',
                    leftJoinAndSelect: {
                        pageuser: 'voteComment.pageUser'
                    }
                };
            }

            let data: any[] = await this.voteCommentService.search(filter, join);
            if (!filter.count) {
                data = this.cleanPageUser(data);
            }

            if (data !== null && data !== undefined) {
                return response.status(200).send(ResponceUtil.getSucessResponce('Serch Vote Comment Successful', data));
            } else {
                return response.status(200).send(ResponceUtil.getSucessResponce('Serch Vote Comment Successful', []));
            }
        } catch (error) {
            return response.status(400).send(ResponceUtil.getErrorResponce('Cannot Search Vote Comment', error));
        }
    }
    // PageUser Validate
    /**
     * @api {post} /api/pageuser/validate_citizen Validate API
     * @apiGroup PageUser
     * @apiParam (Request body) {String} citizen User citizen
     * @apiParamExample {json} Input
     * {
     *      "identification_code" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/pageuser/validate_citizen
     * @apiErrorExample {json} Validate error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/validate_citizen')
    public async validateCitizen(@Body({ validate: true }) registerParam: PageUserRegisterFBRequest, @Req() request: any, @Res() response: any): Promise<any> {

        if (registerParam.identificationCode !== '' && registerParam.identificationCode !== null && registerParam.identificationCode !== undefined) {
            const citizenId = await this.pageUserService.findOne({ where: { identificationCode: registerParam.identificationCode } });
            if (citizenId) {
                const dupErrorResponse: any = {
                    status: 1,
                    message: 'You already identification code please login.',
                };
                return response.status(200).send(dupErrorResponse);
            }
        }
    }
    // PageUser Validate
    /**
     * @api {post} /api/pageuser/validate_email Validate API
     * @apiGroup PageUser
     * @apiParam (Request body) {String} emailId User Email Id
     * @apiParamExample {json} Input
     * {
     *      "email" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/pageuser/validate_email
     * @apiErrorExample {json} Validate error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/validate_email')
    public async validateEmail(@Body({ validate: true }) registerParam: PageUserRegisterFBRequest, @Req() request: any, @Res() response: any): Promise<any> {

        if (registerParam.emailId !== '' && registerParam.emailId !== null && registerParam.emailId !== undefined) {
            const userData = await this.pageUserService.findOne({ where: { email: registerParam.emailId, deleteFlag: 0 } });
            if (userData) {
                const successResponse: any = {
                    status: 1,
                    message: 'You already registered please login.',
                };
                return response.status(400).send(successResponse);
            }
        }
    }
    // PageUser refresh token
    /**
     * @api {post} /api/pageuser/refresh Validate API
     * @apiGroup PageUser
     * @apiParam (Request body) {String} token User 
     * @apiParamExample {json} Input
     * {
     *      "data": "{
     *         "user":''
     *      }",
     *      "message": "Account was valid",
     *      "status": "1"
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/pageuser/refresh
     * @apiErrorExample {json} User Token error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post('/refresh')
    public async refreshToken(@QueryParam('token') tokenParam: string, @Req() request: any, @Res() response: any): Promise<any> {
        let pageUser;
        const pageUserId = await this.authService.decryptToken(tokenParam);
        if (pageUserId !== undefined) {
            pageUser = await this.pageUserService.findOne({
                where: {
                    id: pageUserId,
                },
            });
            const successRes: any = {
                status: 1,
                message: 'Account was valid.',

            };
            return response.status(200).send(successRes);
        }
        const defaultExpired = await this.configService.getConfig(USER_EXPIRED_TIME_CONFIG);
        // create a token
        const token = jwt.sign({ id: pageUser.id }, env.SECRET_KEY, { expiresIn: defaultExpired.value });

        delete pageUser.identificationCode;
        delete pageUser.ip;
        delete pageUser.password;
        delete pageUser.createdBy;
        delete pageUser.createdByUsername;
        delete pageUser.oauthData;
        delete pageUser.modifiedBy;
        delete pageUser.modifiedByUsername;

        const successResponse: any = {
            status: 1,
            message: 'New Token User.',
            data: {
                token,
                user: classToPlain(pageUser),
            },
        };
        return response.status(200).send(successResponse);
    }

    private cleanPageUser(dataList: any[]): any[] {
        const result: any[] = [];

        if (dataList && Array.isArray(dataList)) {
            for (const item of dataList) {
                if (item.pageUser === undefined) {
                    continue;
                }
                const showFields = ['firstName', 'lastName', 'displayName', 'username', 'avatar', 'avatarPath', 'currentExp'];
                item.pageUser = ObjectUtil.createNewObjectWithField(item.pageUser, showFields);

                result.push(item);
            }
        }

        return result;
    }

    private createBasePageUser(registerParam: BasePageUserRegisterRequest): PageUser {
        const newUser = new PageUser();
        newUser.firstName = registerParam.firstName;
        newUser.lastName = registerParam.lastName;
        newUser.email = registerParam.emailId;
        newUser.username = registerParam.emailId;
        newUser.mobileNumber = registerParam.phoneNumber;
        newUser.displayName = registerParam.displayName;
        newUser.education = registerParam.education;
        newUser.career = registerParam.career;
        newUser.identificationCode = registerParam.identificationCode;
        newUser.gender = registerParam.gender;
        // -1 = undefine 0 = male 1 = female
        if (newUser.gender !== -1 && newUser.gender !== 0 && newUser.gender !== 1) {
            newUser.gender = -1;
        }
        newUser.birthday = registerParam.birthday;
        newUser.postcode = registerParam.postcode;
        newUser.level = 1;
        newUser.currentExp = 0;
        newUser.classId = 1;
        newUser.isOfficial = 0;

        return newUser;
    }

}
