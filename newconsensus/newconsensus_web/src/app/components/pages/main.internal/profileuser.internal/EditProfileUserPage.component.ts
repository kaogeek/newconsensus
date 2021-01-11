/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileUserPageFacade, AuthenManager, ImageFacade, ObservableManager, PostcodeFacade, PageUserInfo } from '../../../../services/services';
import { EditProfileUserPages } from '../../../../models/EditProfileUserPages';
import { DialogImage } from '../../../shares/dialog/DialogImage.component';
import { AbstractPage } from '../../AbstractPage';
import { MatDatepicker } from '@angular/material';
import { NgForm } from '@angular/forms'; 
import { Router } from '@angular/router';
import { AutoCompEducation, AutoCompCareer } from '../../../components';

const PAGE_NAME: string = 'edit';
const IMAGE_SUBJECT: string = 'authen.image';

@Component({
  selector: 'newcon-edit-profile-user-page',
  templateUrl: './EditProfileUserPage.component.html',
})
export class EditProfileUserPage extends AbstractPage implements OnInit {

  @ViewChild(MatDatepicker, { static: true }) datapicker: MatDatepicker<Date>;
  @ViewChild("gender",{static: true }) gender: NgForm;
  @ViewChild("education", { static: false })
  private autoCompEducation: AutoCompEducation;
  @ViewChild("career", { static: false })
  private autoCompCareer: AutoCompCareer;

  private editProfileFacade: EditProfileUserPageFacade;
  private imageAvatarFacade: ImageFacade;
  private observManager: ObservableManager;
  private profileUser: any[] = [];
  private pageUserInfo: PageUserInfo;
  
  public postcodeFacade: PostcodeFacade;
  public dialogs: MatDialog;
  public authenManager: AuthenManager;
  public resUser: any = [];
  public imagesAvatar: any;
  public birthdate: any;
  public whereConditions: string[];
  
  public static readonly PAGE_NAME: string = PAGE_NAME;

  public result: any;

  constructor(editProfileFacade: EditProfileUserPageFacade, authenManager: AuthenManager, imageAvatarFacade: ImageFacade,
    observManager: ObservableManager, router: Router, dialogs: MatDialog, postcodeFacade: PostcodeFacade, pageUserInfo: PageUserInfo) {
    super(PAGE_NAME, authenManager, dialogs, router);
    this.editProfileFacade = editProfileFacade;
    this.authenManager = authenManager;
    this.pageUserInfo = pageUserInfo;
    this.imageAvatarFacade = imageAvatarFacade;
    this.observManager = observManager;
    this.postcodeFacade = postcodeFacade;
    this.dialogs = dialogs; 
    this.whereConditions = ["postcode","province"]

    this.observManager.subscribe('authen.check', (data: any) => {
      this.reloadUserImage();
      this.getUserProfile();
    });
    // create obsvr subject
    this.observManager.createSubject(IMAGE_SUBJECT);
  }
  ngOnInit() :void {
    super.ngOnInit();
    this.checkAccountStatus().then((res)=>{
      if(!res){
        this.observManager.publish("authen.logout", true);
      }
    });
    this.reloadUserImage();
    let user = this.getCurrentUser();
    
    if (user !== null && user !== undefined) {
      let token =this.authenManager.getUserToken();
      if(token !== null && token !== undefined){
        this.getUserProfile();

      }
    }
  }

  public getUserProfile() {
    this.editProfileFacade.getProfile().then((result: any) => {
      this.resUser = result;
      this.autoCompEducation.setValueEducation(this.resUser.education);
      this.autoCompCareer.setValueCareer(this.resUser.career);
    });
  }
  public reloadUserImage(): void {
    let user = this.authenManager.getCurrentUser();
    this.profileUser = [];
    if (user !== undefined && user !== null) {
      this.profileUser.push({
        name: user.displayName,
        email: user.email
      });
      this.imageAvatarFacade.avatarProfile(user.avatar, user.avatarPath).then((result: any) => {
        let blob = result;
        
        this.getBase64ImageFromBlob(blob);
      }).catch((error: any) => {
        // console.log('error: ' + JSON.stringify(error));
      });
    }
  }

  public getBase64ImageFromBlob(imageUrl) {
    var reader = new FileReader();
    reader.readAsDataURL(imageUrl);
    reader.onloadend = () => {
      var base64data = reader.result;
      this.imagesAvatar = base64data;
    }
  }
  onClickEdit(formData) {
    const editProfile = new EditProfileUserPages();
    editProfile.firstName = this.resUser.firstName;
    editProfile.avatar = this.imagesAvatar;
    editProfile.email = formData.email;
    editProfile.gender = this.resUser.gender;
    editProfile.birthday = this.resUser.birthday;
    editProfile.displayName = formData.displayName;
    
    editProfile.postcode = parseInt(this.resUser.postcode);
    editProfile.career = formData.career;
    editProfile.education = this.autoCompEducation.educationForm.value !== undefined && this.autoCompEducation.educationForm.value !== null ? this.autoCompEducation.educationForm.value.name : "";
    editProfile.career = this.autoCompCareer.careerForm.value !== undefined && this.autoCompCareer.careerForm.value !== null ? this.autoCompCareer.careerForm.value.name : "";


    if(!editProfile.postcode){
      return this.showAlertDialog("กรุณากรอกรหัสไปรษณีย์");
    }
    if(editProfile.displayName.trim()  === ""){
      return this.showAlertDialog("กรุณากรอกชื่อที่แสดง");
    }
    if(editProfile.birthday === null || editProfile.birthday === undefined){
      return this.showAlertDialog("กรุณากรอกวันเกิด");
    }
    
    this.editProfileFacade.editProfile(editProfile).then((res: any) => {
      this.showAlertDialog("แก้ไขโปรไฟล์สำเร็จ");
      this.observManager.publish('authen.image',this.imagesAvatar); 
      this.observManager.publish('authen.pageUser',res.data); 
      this.pageUserInfo.addPageUser(res.data); 
    }).catch((error: any) => {
      // console.log(error);
    });
  } 

  public showDialogImage(): void {
    const dialogRef = this.dialog.open(DialogImage, {
      width: 'auto',
      disableClose: true,
      data: this.imagesAvatar
    });

    dialogRef.afterClosed().subscribe(result => {
      this.imagesAvatar = result.image;
    });
  }
}
