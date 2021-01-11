/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { AuthenManager, ObservableManager } from 'src/app/services/services';
import { environment } from '../../../../environments/environment';
import { CacheConfigInfo } from '../../../services/CacheConfigInfo.service';
import { LOGIN_FACEBOOK_ENABLE } from '../../../Constants';
import { AbstractPage } from '../AbstractPage';
import { MatDialog } from '@angular/material/dialog';
import { DialogAlert } from '../../components';
import { MESSAGE } from 'src/app/AlertMessage';


const PAGE_NAME: string = 'login';


@Component({
  selector: 'newcocs-login-page',
  templateUrl: './LoginPage.component.html',
})
export class LoginPage extends AbstractPage implements OnInit {

  @ViewChild('email', { static: false }) email: ElementRef;
  @ViewChild('password', { static: false }) password: ElementRef;
  private accessToken: any;
  private observManager: ObservableManager;
  private _ngZone: NgZone;
  private cacheConfigInfo: CacheConfigInfo;
  private activatedRoute: ActivatedRoute;

  public static readonly PAGE_NAME: string = PAGE_NAME;
  public authenManager: AuthenManager;
  public router: Router;

  public hide = true;
  public redirection: string;
  public isEmailLogin: boolean;
  public isShowFacebook: boolean;

  constructor(authenManager: AuthenManager, activatedRoute: ActivatedRoute, router: Router, _ngZone: NgZone,
    observManager: ObservableManager, cacheConfigInfo: CacheConfigInfo, dialog: MatDialog) {
    super(PAGE_NAME, authenManager, dialog, router);
    this.authenManager = authenManager;
    this.activatedRoute = activatedRoute;
    this.router = router;
    this._ngZone = _ngZone;
    this.observManager = observManager;
    this.isShowFacebook = true;
    this.cacheConfigInfo = cacheConfigInfo;

    this.cacheConfigInfo.getConfig(LOGIN_FACEBOOK_ENABLE).then((config: any) => {
      if (config.value !== undefined) {
        this.isShowFacebook = (config.value.toLowerCase() === 'true');
      }
    }).catch((error: any) => {
      // console.log(error) 
    });

    this.activatedRoute.params.subscribe((param) => {
      this.redirection = param['redirection'];
    });
  }

  private checkLoginAndRedirection(): void {
    if (!this.isLogin()) {
      this.fbLibrary();
    } else {
      if (this.redirection) {
        this.router.navigateByUrl(this.redirection);
      } else {
        this.router.navigateByUrl("/main");
      }
    }
  }

  public fbLibrary() {

    (window as any).fbAsyncInit = function () {
      window['FB'].init({
        appId: environment.facebookAppId,
        cookie: true,
        xfbml: true,
        version: 'v3.1'
      });
      window['FB'].AppEvents.logPageView();
    };

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

  }

  login() {
    window['FB'].login((response) => {
      if (response.authResponse) {
        let accessToken = {
          fbid: response.authResponse.userID,
          fbtoken: response.authResponse.accessToken,
          fbexptime: response.authResponse.data_access_expiration_time,
          fbsignedRequest: response.authResponse.signedRequest
        }
        this.accessToken = accessToken;

        this._ngZone.run(() => this.loginFB());
      }
    }, { scope: 'public_profile,email,user_birthday' });
  }

  public emailLogin() {
    this.isEmailLogin = true;
  }

  private loginFB() {
    this.authenManager.loginWithFacebook(this.accessToken.fbtoken).then((data: any) => {
      // login success redirect to main page
      this.observManager.publish('authen.check', null);
      if (this.redirection) {
        this.router.navigateByUrl(this.redirection);
      } else {
        this.router.navigate(['main']);
      }
    }).catch((err) => {
      const statusMsg = err.error.message;
      if (statusMsg === "User was not found.") {
        let navigationExtras: NavigationExtras = {
          state: {
            data: this.accessToken,
            redirection: this.redirection
          },
        }
        this.router.navigate(['main/register'], navigationExtras);
      } else if (err.error.message === 'Baned PageUser.') {
        this.dialog.open(DialogAlert, {
          disableClose: true,
          data: {
            text: MESSAGE.TEXT_LOGIN_BANED,
            bottomText2: MESSAGE.TEXT_BUTTON_CONFIRM,
            bottomColorText2: "black",
            btDisplay1: "none"
          }
        });
      }
    });
  }

  public onClickLogin() {
    let body = {
      email: this.email.nativeElement.value,
      password: this.password.nativeElement.value
    }
    if (body.email.trim() === "") {
      return this.showAlertDialog("กรุณากรอกอีเมล์");
    }
    if (body.password.trim() === "") {
      return this.showAlertDialog("กรุณากรอกรหัสผ่าน");
    }
    this.authenManager.login(body.email, body.password).then((data) => {
      var w = window.innerWidth;
      if (data) {
        if (w > 991) {
          let dialog = this.dialog.open(DialogAlert, {
            disableClose: true,
            data: {
              text: MESSAGE.TEXT_LOGIN_SUCCESS,
              bottomText2: MESSAGE.TEXT_BUTTON_CONFIRM,
              bottomColorText2: "black",
              btDisplay1: "none"
            }
          });
          dialog.afterClosed().subscribe((res) => {
            if (res) {
              this.observManager.publish('authen.check', null);
              if (this.redirection) {
                this.router.navigateByUrl(this.redirection);
              } else {
                this.router.navigate(['main']);
              }
            }

          });
        } else {
          this.router.navigate(['main']);
        }
      }
    }).catch((err) => {
      if (err) {
        let alertMessages: string = MESSAGE.TEXT_TITLE_LOGIN;
        if (err.error.message === 'Invalid EmailId.') {
          alertMessages = 'กรุณาใส่อีเมล์อีกครั้ง';
        } else if (err.error.message === 'Baned PageUser.') {
          alertMessages = 'บัญชีผู้ใช้ถูกแบน';
        } else if (err.error.message === 'Invalid password') {
          alertMessages = 'รหัสผ่านไม่ถูกต้อง';
        }
        this.dialog.open(DialogAlert, {
          disableClose: true,
          data: {
            text: alertMessages,
            bottomText2: MESSAGE.TEXT_BUTTON_CONFIRM,
            bottomColorText2: "black",
            btDisplay1: "none"
          }
        });
      }
    });
  }

  ngOnInit() {
    this.checkLoginAndRedirection();
  }

}
