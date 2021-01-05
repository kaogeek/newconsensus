import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ObservableManager } from '../../../services/ObservableManager.service';
import { PartnerFacade } from 'src/app/services/services';
import { CacheConfigInfo } from '../../../services/CacheConfigInfo.service';
import { DEBATE_MENU_ENABLE, VOTE_MENU_ENABLE } from '../../../Constants';

@Component({
  selector: 'newcon-header-bottom',
  templateUrl: './HeaderBottom.component.html',

})
export class HeaderBottom {
  private cacheConfigInfo: CacheConfigInfo;

  public isMenu: boolean = false;
  public isShowDebate: boolean ;
  public isShowVote: boolean ;
  public links = [
    {
      link: "/main",
      label: "หน้าแรก"
    },
    {
      link: "/main/debate",
      label: "บอร์ดพูดคุย"
    },
    { 
      // link: "/main/proposal",
      // label: "ข้อเสนอรัฐธรรมนูญ"
      link: "/main/proposal",
      label: "รับฟังความคิดเห็น"
    },
    {
      link: "/main/vote",
      label: "รับฟังความคิดเห็น"
    },
    {
      link: "/main/content",
      label: "คลังความรู้"
    }
  ]; 
  private router: Router;
  private observManager: ObservableManager;
  private partnerFacade: PartnerFacade;
  
  public partners: any[] = [];


  constructor(router: Router, observManager: ObservableManager, partnerFacade: PartnerFacade,cacheConfigInfo: CacheConfigInfo) {
    this.router = router;
    this.observManager = observManager;
    this.partnerFacade = partnerFacade;
    this.isShowDebate = false;
    this.isShowVote = false;
    this.cacheConfigInfo = cacheConfigInfo;

    this.observManager.createSubject('menu.click');

    this.cacheConfigInfo.getConfig(DEBATE_MENU_ENABLE).then((config: any) => {
      if (config.value !== undefined) {
        this.isShowDebate = (config.value.toLowerCase() === 'true');
      }
    }).catch((error: any) => { 
      // console.log(error) 
    });

    this.cacheConfigInfo.getConfig(VOTE_MENU_ENABLE).then((config: any) => {
      if (config.value !== undefined) {
        this.isShowVote = (config.value.toLowerCase() === 'true');
      }
    }).catch((error: any) => { 
      // console.log(error) 
    });
  }

  public clickMenu(): void {
    if (window.innerWidth >= 1074){
      this.isMenu = false;
    } else{
      this.isMenu = !this.isMenu;

      this.observManager.publish('menu.click', {
        click: this.isMenu
      });

     }
  }

  public isShowMenu(link: any): boolean {
    if (link.link === '/main/debate' && this.isShowDebate) {
      return  true;
    } else if (link.link !== '/main/debate') {
      return  true;
    } else {
      return false;
    }
  };
  
  public isShowMenu2(link: any): boolean {
  if (link.link === '/main/vote' && this.isShowVote) {
    return  true;
  } else if (link.link !== '/main/vote') {
    return  true;
  } else {
    return false;
  }
};

  public getPartner(): void {
    this.partnerFacade.getPartner().then((result: any) => {
      this.partners = result;
    }).catch((error: any) => {
      // console.log('error: ' + JSON.stringify(error)); 
    });
  }

  public getLinkActive(link: string): boolean {

    return (link === "/main" && this.router.url === "/main") || (link !== "/main" && this.router.url.includes(link));
  }

  ngOnInit() {
    this.getPartner();
  }
}
