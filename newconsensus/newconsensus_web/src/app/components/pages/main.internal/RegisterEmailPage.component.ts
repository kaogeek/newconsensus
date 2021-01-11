/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Component, OnInit, ViewChild, EventEmitter, ElementRef } from "@angular/core";
import { AbstractPage } from '../AbstractPage';
import { MatDatepicker, DateAdapter, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ObservableManager, AuthenManager, PostcodeFacade } from 'src/app/services/services';
import { MESSAGE } from 'src/app/AlertMessage';
import { RegisterEmail } from 'src/app/models/models';
import { DialogImage, AutoCompEducation, AutoCompCareer } from '../../components';
import { DialogAlert } from '../../shares/dialog/DialogAlert.component';

const PAGE_NAME: string = 'registeremail';

@Component({
    selector: 'newcon-register-email-page',
    templateUrl: './RegisterEmailPage.component.html',
})
export class RegisterEmailPage extends AbstractPage implements OnInit {

    public static readonly PAGE_NAME: string = PAGE_NAME;

    @ViewChild(MatDatepicker, { static: true })
    private datapicker: MatDatepicker<Date>;
    @ViewChild("birthday", { static: false })
    private datapickerBirthday: any;
    @ViewChild("education", { static: false })
    private autoCompEducation: AutoCompEducation;
    @ViewChild("career", { static: false })
    private autoCompCareer: AutoCompCareer;

    private accessToken: any;
    private route: ActivatedRoute;
    private observManager: ObservableManager;
    private dateAdapter: DateAdapter<Date>;

    public authenManager: AuthenManager;
    public postcodeFacade: PostcodeFacade;
    public dialog: MatDialog;
    public redirection: string;
    public result: any;
    public avatar: any;
    public images: any;
    public imagesAvatar: any;
    public birthdate: any;
    public whereConditions: string[];

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
            this.result.gender = -1;
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
        const register = new RegisterEmail();
        register.firstName = formData.firstName;
        register.lastName = formData.lastName;
        register.displayName = formData.displayName;
        register.avatar = this.imagesAvatar === "" || this.imagesAvatar === undefined ? '' : this.imagesAvatar.image;
        register.identificationCode = formData.identification;
        register.emailId = formData.email;
        register.gender = this.result.gender;
        register.password = formData.password;
        register.confirmPassword = formData.confirmpasswd;
        register.education = this.autoCompEducation.educationForm.value !== undefined && this.autoCompEducation.educationForm.value !== null ? this.autoCompEducation.educationForm.value.name : "";
        register.career = this.autoCompCareer.careerForm.value !== undefined && this.autoCompCareer.careerForm.value !== null ? this.autoCompCareer.careerForm.value.name : "";
        register.postcode = parseInt(this.result.postcode);
        let date = this.datapickerBirthday.valueAccessor._elementRef.nativeElement.value.split('/');
        if (date.length === 3) {
            let dateFormat = new Date(Number(date[2]) > 2400 ? Number(date[2]) - 543 : Number(date[2]), Number(date[1]) - 1, Number(date[0]));
            if (!isNaN(dateFormat.getTime())) {
                register.birthday = dateFormat;
            } else {
                return this.showAlertDialog("กรุณากรอกวันเกิดให้ถูกต้อง");
            }
        } else {
            return this.showAlertDialog("กรุณากรอกวันเกิดให้ถูกต้อง");
        }

        const checkCitizenId = this.checkDigitIdentificationCode(register.identificationCode);

        if (register.firstName.trim() === "") {
            document.getElementById("firstName").focus();
            return this.showAlertDialog("กรุณากรอกชื่อ");
        }
        if (register.lastName.trim() === "") {
            document.getElementById("lastName").focus();
            return this.showAlertDialog("กรุณากรอกนามสกุล");
        }
        if (register.displayName.trim() === "") {
            document.getElementById("displayName").focus();
            return this.showAlertDialog("กรุณากรอกชื่อบัญชีผู้ใช้");
        }
        if (!checkCitizenId) {
            document.getElementById("identification").focus();
            return this.showAlertDialog("กรุณากรอกรหัสบัตรประจำตัวประชาชนผิด หรือ กรอกไม่ครบ 13 หลัก");
        }
        if (formData.identification.trim() === "") {
            document.getElementById("identification").focus();
            return this.showAlertDialog("กรุณากรอกรหัสบัตรประจำตัวประชาชน");
        }
        if (register.password.trim() === "") {
            document.getElementById("password").focus();
            return this.showAlertDialog("กรุณากรอกรหัสผ่าน");
        }
        if (formData.confirmpasswd.trim() === "") {
            document.getElementById("confirmpasswd").focus();
            return this.showAlertDialog("กรุณากรอกยืนยันรหัสผ่าน");
        }
        if (register.password !== formData.confirmpasswd) {
            document.getElementById("confirmpasswd").focus();
            return this.showAlertDialog("กรอกยืนยันรหัสผ่านไม่ตรงกัน");
        }
        if (!register.postcode) {
            return this.showAlertDialog("กรุณากรอกรหัสไปรษณีย์");
        }
        let postcode: string = String(register.postcode);
        if (postcode.length !== 5) {
            return this.showAlertDialog("กรุณากรอกรหัสไปรษณีย์ให้ครบ 5 ตัว");
        }
        if (register.birthday === null || register.birthday === undefined) {
            return this.showAlertDialog("กรุณากรอกวันเกิด");
        }
        if (register.emailId.trim() === "") {
            document.getElementById("email").focus();
            return this.showAlertDialog("กรุณากรอกอีเมล์");
        }
        this.authenManager.registerWithEmail(register).then((value: any) => {
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
        }).catch((err) => {
            if (err) {
                let alertMessages: string = 'ลงทะเบียนสำเร็จ ' + MESSAGE.TEXT_TITLE_LOGIN;
                if (err.error.message === 'You already registered please login.') {
                    alertMessages = 'อีเมลนี้ถูกลงทะเบียนแล้ว กรุณาเข้าสู่ระบบ';
                    document.getElementById("email").focus();
                } else if (err.error.message === 'You already identification code please login.') {
                    alertMessages = 'รหัสบัตรประจำตัวประชาชนถูกใช้งานแล้ว กรุณาเข้าสู่ระบบ';
                } else if (err.error.message === 'Postcode was invalid.') {
                    alertMessages = 'ไม่ค้นพบรหัสไปรษณีย์';
                    document.getElementById("identification").focus();
                }
                let dialog = this.showAlertDialogWarming(alertMessages, "none");
                dialog.afterClosed().subscribe((res) => {
                    if (res) {
                        this.observManager.publish('authen.check', null);
                        if (this.redirection) {
                            this.router.navigateByUrl(this.redirection);
                        }
                    }
                });
            } else {
                this.router.navigate(['main/login']);
            }
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
