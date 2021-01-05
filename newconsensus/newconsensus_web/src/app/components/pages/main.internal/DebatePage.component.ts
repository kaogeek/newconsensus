import { Component, OnInit } from '@angular/core';
import { CacheConfigInfo } from '../../../services/CacheConfigInfo.service';
import { DEBATE_MENU_ENABLE } from '../../../Constants';
import { Router } from '@angular/router';

const PAGE_NAME: string = 'debate';


@Component({
  selector: 'newcon-debate-page',
  templateUrl: './DebatePage.component.html',
})
export class DebatePage implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME;

  public cacheConfigInfo: CacheConfigInfo;
  public isShowDebate: boolean;
  public router: Router;

  constructor(cacheConfigInfo: CacheConfigInfo, router: Router) {
    this.cacheConfigInfo = cacheConfigInfo;
    this.router = router;

    this.cacheConfigInfo.getConfig(DEBATE_MENU_ENABLE).then((config: any) => {
      if (config.value !== undefined) {
        this.isShowDebate = (config.value.toLowerCase() === 'true');
        if (!this.isShowDebate) {
          this.router.navigateByUrl("/main");
        }
      }
    }).catch((error: any) => {
      console.log(error)
    });
  }

  ngOnInit() {
  }
}




