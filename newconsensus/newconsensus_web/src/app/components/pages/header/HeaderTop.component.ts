/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Component, ViewChild, OnInit, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenManager, ImageFacade, ObservableManager, EditProfileUserPageFacade, PartnerFacade } from 'src/app/services/services';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material';
import { AbstractPage } from '../AbstractPage';
import { MESSAGE } from '../../../../app/AlertMessage';

const DEFAULT_USER_ICON: string = '../../../assets/components/pages/icons8-female-profile-128.png';
const REDIRECT_PATH: string = '/main';
const PAGE_NAME: string = 'header';

@Component({
  selector: 'newcon-header-top',
  templateUrl: './HeaderTop.component.html',

})
export class HeaderTop extends AbstractPage implements OnInit {
  //--------------ห้ามแยก start--------------//
  @ViewChild(MatMenuTrigger, { static: false })
  public trigger: MatMenuTrigger;
  //--------------ห้ามแยก End--------------//

  @Input()
  protected menutopprofile: boolean;

  private imageAvatarFacade: ImageFacade;
  private observManager: ObservableManager;
  private editProfileFacade: EditProfileUserPageFacade;
  private partnerFacade: PartnerFacade;
  private userImage: any;

  public profileUser: any;
  public partners: any[] = [];
  public countPageuser: any;
  public isclickmenu: boolean;


  constructor(router: Router, authenManager: AuthenManager,
    imageAvatarFacade: ImageFacade, observManager: ObservableManager,
    editProfileFacade: EditProfileUserPageFacade, dialog: MatDialog, partnerFacade: PartnerFacade) {
    super(PAGE_NAME, authenManager, dialog, router);
    this.router = router;
    this.authenManager = authenManager;
    this.imageAvatarFacade = imageAvatarFacade;
    this.editProfileFacade = editProfileFacade;
    this.partnerFacade = partnerFacade;
    this.observManager = observManager;
    this.dialog = dialog;
    this.observManager.subscribe('authen.check', (data: any) => {
      this.reloadUserImage();
    });
    this.observManager.subscribe('authen.logout', (data: any) => {
      this.checkSessionTimeOut();
    });
    this.observManager.subscribe('authen.registered', (data: any) => {
      this.reloadUserImage();
    });
    this.observManager.subscribe('authen.image', (image: any) => {
      this.userImage = image;
    });
    this.observManager.subscribe('authen.pageUser', (pageUser: any) => {
      this.profileUser = pageUser;
    });
    this.observManager.subscribe('menu.click', (clickmenu) => {
      this.isclickmenu = clickmenu.click;

      if (window.innerWidth >= 1074) {

      } else {
        if (clickmenu.click === true) {
          var element = document.getElementById("profile");
          element.classList.remove("scroll-profile");

        } else {
          // var element = document.getElementById("profile");
          // element.classList.add("scroll-profile");
        }
      }
    });
  }

  public isLogin(): boolean {
    let user = this.authenManager.getCurrentUser();
    return user !== undefined && user !== null;
  }

  public closeMenu() {
    this.trigger.closeMenu();
  }

  public reloadUserImage(): void {
    this.userImage = undefined;
    let user = this.authenManager.getCurrentUser();
    if (user !== undefined && user !== null) {
      this.profileUser = {
        displayName: user.displayName,
        email: user.email
      };
      this.imageAvatarFacade.avatarProfile(user.avatar, user.avatarPath).then((result: any) => {
        let blob = result;
        this.getBase64ImageFromBlob(blob);
      }).catch((error: any) => {
        // console.log('error: ' + JSON.stringify(error));
        this.userImage = undefined;
      });
    }
  }

  public getBase64ImageFromBlob(imageUrl) {
    var reader = new FileReader();
    reader.readAsDataURL(imageUrl);
    reader.onloadend = () => {
      var base64data = reader.result;
      this.userImage = base64data;
    }
  }

  public getPartner(): void {
    this.partnerFacade.getPartner().then((result: any) => {
      this.partners = result;
    }).catch((error: any) => {
      // console.log('error: ' + JSON.stringify(error));
    });
  }

  public getCurrentUserImage(): string {
    sessionStorage.setItem("userimg", this.userImage);
    return (this.userImage) ? this.userImage : DEFAULT_USER_ICON;
  }

  public checkSessionTimeOut() {
    this.authenManager.clearStorage();
    this.authenManager.logout().then(() => {
      this.router.navigateByUrl(REDIRECT_PATH);
    }).catch((err) => {
      alert(err.error.message);
    });
  }

  public clickLogout() {
    const confirmEventEmitter = new EventEmitter<any>();
    confirmEventEmitter.subscribe(() => {
      this.authenManager.logout().then(() => {
        this.authenManager.clearStorage();
        this.router.navigateByUrl(REDIRECT_PATH);
      }).catch((err: any) => {
        alert(err.error.message);
      })
    });
    this.showDialogWithOptions({
      text: "คุณต้องการออกจากระบบ",
      bottomText1: MESSAGE.TEXT_BUTTON_CANCEL,
      bottomText2: MESSAGE.TEXT_BUTTON_CONFIRM,
      bottomColorText2: "black",
      confirmClickedEvent: confirmEventEmitter,
    });
  }

  public isProfileActive(test: string): boolean {
    if (this.trigger) {
      return this.trigger.menuOpen;
    } else {
      return false;
    }
  }

  public pageUserCount() {
    this.editProfileFacade.findCountPageUser().then((result: any) => {
      this.countPageuser = result;
    }).catch((error: any) => {
      // console.log(error);
    })
  }

  public getLinkLogin(): void {
    if (this.router.url.includes("/main/login")) {
      return;
    } else if (this.router.url.includes("/main/registeremail") || this.router.url.includes("/main/register")) {
      this.router.navigateByUrl("/main/login");
    } else {
      this.router.navigate(["/main/login", { redirection: this.router.url }]);
    }
  }

  ngOnInit() {
    this.reloadUserImage();
    this.pageUserCount();
    this.getPartner();
  }
}
