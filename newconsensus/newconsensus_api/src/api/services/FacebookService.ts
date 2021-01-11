/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Service } from 'typedi';
import { FB, Facebook } from 'fb';
import { facebook_setup } from '../../env';
import { PageUserService } from './PageUserService';

@Service()
export class FacebookService {

    constructor(
        private pageUserService: PageUserService
    ) { }

    public createFB(): Facebook {
        const options = FB.options();
        options.appId = facebook_setup.FACEBOOK_APP_ID;
        options.version = facebook_setup.FACEBOOK_VERSION;
        options.appSecret = facebook_setup.FACEBOOK_APP_SECRET;
        options.cookie = facebook_setup.FACEBOOK_COOKIE;
        options.xfbml = facebook_setup.FACEBOOK_XFBML;

        return new Facebook(options);
    }

    // get App Access token
    public getAppAccessToken(): Promise<any> {
        return new Promise((resolve, reject) => {
            FB.api('oauth/access_token', {
                client_id: facebook_setup.FACEBOOK_APP_ID,
                client_secret: facebook_setup.FACEBOOK_APP_SECRET,
                grant_type: 'client_credentials'
            }, (res: any) => {
                if (!res || res.error) {
                    reject({
                        error: res.error
                    });
                    return;
                }
                const accessToken = res.access_token;
                resolve({
                    token: accessToken
                });
            });
        });
    }

    // extends live time of token
    public extendsAccessToken(fbExchangeToken: string): Promise<any> {
        return new Promise((resolve, reject) => {
            FB.api('oauth/access_token', {
                client_id: facebook_setup.FACEBOOK_APP_ID,
                client_secret: facebook_setup.FACEBOOK_APP_SECRET,
                grant_type: 'fb_exchange_token',
                fb_exchange_token: fbExchangeToken
            }, (res: any) => {
                if (!res || res.error) {
                    reject({
                        error: res.error
                    });
                    return;
                }
                const accessToken = res.access_token;
                resolve({
                    token: accessToken,
                    type: res.token_type,
                    expires: res.expires_in
                });
            });
        });
    }
    // getLoginStatus return id if valid
    public getLoginStatus(accessToken: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getFBUserId(accessToken).then((result: any)=>{
                const loginResult = {
                    isLogin: (result.id !== undefined ? true : false)
                };
                resolve(loginResult);
            }).catch((error: any)=>{reject(error);});
        });
    }
    // get FB Id
    public getFBUserId(accessToken: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const facebook = this.createFB();
            facebook.setAccessToken(accessToken);

            facebook.api('me/?fields=id&access_token=\'+accessToken+\'', 'post',
                (response: any) => {
                    resolve(response);
                });
        });
    }
    // get PageUser
    public getPageUser(accessToken: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getFBUserId(accessToken).then((result: any)=>{
                if(result.error){
                    reject(result.error);
                    return;
                }

                const pageUser = this.pageUserService.findOne({where: {
                    fbUserId: result.id
                }});

                resolve(pageUser);
            }).catch((error: any)=>{reject(error);});
        });
    }
    // getUserInfo
    public getUserInfo(userId: string, accessToken: string, fields?: any[]): Promise<any> {
        return new Promise((resolve, reject) => {
            const facebook = this.createFB();
            facebook.setAccessToken(accessToken);

            let userFields = ['id', 'name', 'email'];
            if (fields !== undefined && fields !== null) {
                userFields = fields;
            }

            facebook.api(userId,
                { fields: userFields },
                (response: any) => {
                    resolve(response);
            });
        });
    }

    public checkAccessToken(inputToken: string): Promise<any> {
        return new Promise((resolve, reject) => {

            this.getAppAccessToken().then((result: any)=>{
                const facebook = this.createFB();
                facebook.setAccessToken(result.token);

                facebook.api('debug_token?input_token='+inputToken, 'get',
                    (response: any) => {
                        resolve(response);
                });
            }).catch((error: any)=>{
                reject(error);
            });
        });
    }
}
