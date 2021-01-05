import { Component, OnInit } from '@angular/core';
import { CacheConfigInfo } from '../../../services/CacheConfigInfo.service';
import { VOTE_MENU_ENABLE } from '../../../Constants';
import { Router } from '@angular/router';

const PAGE_NAME: string = 'vote';

@Component({
  selector: 'newcon-vote-comment-page',
  templateUrl: './VoteCommentPage.component.html',
})
export class VoteCommentPage implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME;

  public cacheConfigInfo: CacheConfigInfo;
  public isShowVote: boolean;
  public router: Router;

  constructor(cacheConfigInfo: CacheConfigInfo, router: Router) {
    this.cacheConfigInfo = cacheConfigInfo;
    this.router = router;

    this.cacheConfigInfo.getConfig(VOTE_MENU_ENABLE).then((config: any) => {
      if (config.value !== undefined) {
        this.isShowVote = (config.value.toLowerCase() === 'true');
        if (!this.isShowVote) {
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
