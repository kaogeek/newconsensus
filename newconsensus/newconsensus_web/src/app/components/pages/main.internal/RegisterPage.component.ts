import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { MatDatepicker } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenManager, ObservableManager, PostcodeFacade } from '../../../services/services';
import { RegisterFacebook } from '../../../models/models';
import { MatDialog } from '@angular/material/dialog';
import { DialogImage } from '../../shares/dialog/DialogImage.component';
import { DateAdapter } from '@angular/material';
import { AbstractPage } from '../AbstractPage';
import { MESSAGE } from 'src/app/AlertMessage';
import { DialogAlert } from '../../shares/dialog/DialogAlert.component';
import { AutoCompEducation, AutoCompCareer } from '../../components';

const PAGE_NAME: string = 'register';

@Component({
  selector: 'newcon-register-page',
  templateUrl: './RegisterPage.component.html'
})
export class RegisterPage extends AbstractPage implements OnInit {

  @ViewChild(MatDatepicker, { static: true }) datapicker: MatDatepicker<Date>;
  public static readonly PAGE_NAME: string = PAGE_NAME;

  @ViewChild("education", { static: false })
  private autoCompEducation: AutoCompEducation;
  @ViewChild("career", { static: false })
  private autoCompCareer: AutoCompCareer;

  private accessToken: any;
  private route: ActivatedRoute;
  private observManager: ObservableManager;
  private dateAdapter: DateAdapter<Date>

  public authenManager: AuthenManager;
  public postcodeFacade: PostcodeFacade;
  public dialog: MatDialog;
  public hide = true;
  public email: string = '';
  public password: string = '';
  public result: any;
  public avatar: any;
  public images: any;
  public imagesAvatar: any;
  public birthdate: any;
  public whereConditions: string[];
  public redirection: string;

  minDate = new Date(1800, 0, 1);
  maxDate = new Date();
  startDate: Date;

  constructor(authenManager: AuthenManager,
    route: ActivatedRoute,
    router: Router,
    dialog: MatDialog,
    observManager: ObservableManager,
    dateAdapter: DateAdapter<Date>,
    postcodeFacade: PostcodeFacade
  ) {
    super(PAGE_NAME, authenManager, dialog, router);
    this.authenManager = authenManager;
    this.route = route;
    this.postcodeFacade = postcodeFacade;
    this.router = router;
    this.dialog = dialog;
    this.observManager = observManager;
    this.whereConditions = ["postcode", "province"]

    this.dateAdapter = dateAdapter;
    this.dateAdapter.setLocale('th-TH');

    this.minDate.setDate(this.minDate.getDate());
    this.minDate.setFullYear(this.minDate.getFullYear() - 200);
    this.maxDate.setDate(this.maxDate.getDate());
    this.maxDate.setFullYear(this.maxDate.getFullYear());
    this.startDate = this.maxDate;

    this.route.queryParams.subscribe(val => {
      this.result = {};
      const navigation = this.router.getCurrentNavigation();
      const state = navigation.extras.state;
      if (state) {
        this.accessToken = state.data;
        this.redirection = state.redirection;
        this.getCurrentUserInfo();
      } else {
        this.router.navigateByUrl("/main/login");
      }
    });
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.checkLoginAndRedirection();
  }

  private checkLoginAndRedirection(): void {
    if (this.isLogin()) {
      if (this.redirection) {
        this.router.navigateByUrl(this.redirection);
      } else {
        this.router.navigateByUrl("/main");
      }
    }
  }

  public onClickregister(formData) {

    const register = new RegisterFacebook();
    register.fbAccessExpirationTime = this.accessToken.fbexptime;
    register.fbSignedRequest = this.accessToken.fbsignedRequest;
    register.fbToken = this.accessToken.fbtoken;
    register.fbUserId = this.accessToken.fbid;
    register.firstName = formData.firstName;
    register.avatar = this.imagesAvatar;
    register.lastName = this.result.last_name;
    register.emailId = formData.email;
    register.gender = this.result.gender;
    register.birthday = this.result.birthday;
    register.displayName = this.result.name;
    register.identificationCode = formData.identification;
    register.education = this.autoCompEducation.educationForm.value !== undefined && this.autoCompEducation.educationForm.value !== null ? this.autoCompEducation.educationForm.value.name : "";
    register.career = this.autoCompCareer.careerForm.value !== undefined && this.autoCompCareer.careerForm.value !== null ? this.autoCompCareer.careerForm.value.name : "";

    register.postcode = parseInt(this.result.postcode);

    const checkCitizenId = this.checkDigitIdentificationCode(register.identificationCode);

    if (!checkCitizenId) {
      return this.showAlertDialog("กรุณากรอกรหัสบัตรประจำตัวประชาชนผิด หรือ กรอกไม่ครบ 13 หลัก");
    }
    if (!register.postcode) {
      return this.showAlertDialog("กรุณากรอกรหัสไปรษณีย์");
    }
    if (register.firstName.trim() === "") {
      return this.showAlertDialog("กรุณากรอกชื่อบัญชีผู้ใช้");
    }
    if (register.birthday === null || register.birthday === undefined) {
      return this.showAlertDialog("กรุณากรอกวันเกิด");
    }
    this.authenManager.registerWithFacebook(register).then((value: any) => {
      if (value) {
        let alertMessage: string = 'ลงทะเบียนสำเร็จ ' + MESSAGE.TEXT_TITLE_LOGIN;
        let isValid = false;
        if (value.data) {
          isValid = true;
        } else {
          if (value.message === 'You already registered please login.') {
            alertMessage = 'อีเมลนี้ถูกลงทะเบียนแล้ว กรุณาเข้าสู่ระบบ';
          } else if (value.message === 'You already identification code please login.') {
            alertMessage = 'รหัสบัตรประจำตัวประชาชนถูกใช้งานแล้ว กรุณาเข้าสู่ระบบ';
          }
        }
        let dialog = this.showAlertDialogWarming(alertMessage, "none");
        dialog.afterClosed().subscribe((res) => {
          if (isValid) {
            this.observManager.publish('authen.check', null);
            if (this.redirection) {
              this.router.navigateByUrl(this.redirection);
            } else {
              this.router.navigate(['main/login']);
            }
          } else {
            this.router.navigate(['main/login']);
          }
        });
      }
    }).catch((err: any) => {
      if (err) {
        let alertMessages: string = 'ลงทะเบียนสำเร็จ ' + MESSAGE.TEXT_TITLE_LOGIN;
        if (err.error.message === 'You already registered please login.') {
          alertMessages = 'อีเมลนี้ถูกลงทะเบียนแล้ว กรุณาเข้าสู่ระบบ';
        } else if (err.error.message === 'You already identification code please login.') {
          alertMessages = 'รหัสบัตรประจำตัวประชาชนถูกใช้งานแล้ว กรุณาเข้าสู่ระบบ';
        }
        let dialog = this.showAlertDialogWarming(alertMessages, "none");

        dialog.afterClosed().subscribe((res) => {
          if (res) {
            this.observManager.publish('authen.check', null);
            if (this.redirection) {
              this.router.navigateByUrl(this.redirection);
            } else {
              this.router.navigate(['main/login']);
            }
          }
        });
      } else {
        this.router.navigate(['main/login']);
      }
    });
  }

  public getCurrentUserInfo(): any {
    window['FB'].api('/me', {
      fields: 'name, first_name, last_name,birthday,picture,id,email'
    }, (userInfo) => {
      this.result = userInfo;
      this.result.gender = -1;
      this.result.birthday = this.result.birthday ? new Date(userInfo.birthday) : undefined;
      this.images = 'https://graph.facebook.com/' + this.result.id + '/picture?type=normal'
      this.getBase64ImageFromUrl(this.images).then((result: any) => {
        this.imagesAvatar = result;
      }).catch(err => {
        console.log("เกิดข้อผิดพลาด");
      });
    });

  }
  public async getBase64ImageFromUrl(imageUrl) {
    var res = await fetch(imageUrl);
    var blob = await res.blob();

    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.addEventListener("load", function () {
        const imagesAvatar = reader.result;
        resolve(imagesAvatar);
      }, false);

      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    });
  }
  public checkDigitIdentificationCode(citizenId: string): boolean {
    let sum = 0;
    if (citizenId.length != 13) return false;
    for (let i = 0; i < 12; i++)
      sum += parseFloat(citizenId.charAt(i)) * (13 - i);
    if ((11 - sum % 11) % 10 != parseFloat(citizenId.charAt(12)))
      return false; return true;
  }

  public showDialogImage(): void {
    const dialogRef = this.dialog.open(DialogImage, {
      width: 'auto',
      disableClose: true,
      data: this.imagesAvatar
    });

    dialogRef.afterClosed().subscribe(result => {
      this.imagesAvatar = result;
    });
  }

}
