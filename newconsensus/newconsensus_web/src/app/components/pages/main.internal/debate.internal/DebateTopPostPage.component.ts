import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DebateFacade } from '../../../../services/facade/DebateFacade.service';
import { AbstractPage } from '../../AbstractPage';
import { DEBATE_HOT_CONFIG_NAME } from '../../../../Constants';
import { AuthenManager, HotConfigInfo } from '../../../../services/services';
import { CacheConfigInfo } from '../../../../services/CacheConfigInfo.service';
import { Router } from '@angular/router';

const PAGE_NAME: string = 'toppost';
const SEARCH_LIMIT: number = 5;
const SEARCH_OFFSET: number = 0;

@Component({
  selector: 'newcon-top-post-debate-page',
  templateUrl: './DebateTopPostPage.component.html',
})
export class DebateTopPostPage extends AbstractPage implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME;

  private currentOffset: number;
  private debateFacade: DebateFacade;
  private hotConfigInfo: HotConfigInfo;
  private cacheConfigInfo: CacheConfigInfo;

  public debate: any = [];
  public newDebate: any = [];
  public hotDebate: any = [];
  public showHot: any = [];
  public imagesAvatar: any = [];
  public isLoadingMore: boolean;
  public isShowLoadMore: boolean;

  constructor(authenManager: AuthenManager, router: Router, debateFacade: DebateFacade, hotConfigInfo: HotConfigInfo, dialog: MatDialog,cacheConfigInfo: CacheConfigInfo) {
    super(PAGE_NAME, authenManager, dialog, router);
    this.debateFacade = debateFacade;
    this.hotConfigInfo = hotConfigInfo;
    this.currentOffset = SEARCH_OFFSET;
    this.isLoadingMore = false;
    this.isShowLoadMore = true;

  }

  ngOnInit() {
    super.ngOnInit();
    this.getAllDebate();
    this.getPinDebate();
    this.getHotDebate();
  }

  public redirect() {
    this.router.navigate(['main']);
  }

  private getAllDebate(): void {
    let filter = {
      limit: SEARCH_LIMIT,
      offset: this.currentOffset,
      select: [],
      relation: [],
      whereConditions: [],
      orderBy: {
        createdDate: "DESC",
      },
      count: false,
    }

    this.debateFacade.search(filter, true, true).then((res) => {
      this.debate = res;
      if (res && res.length < 5) {
        this.isShowLoadMore = false;
      }

      this.hotConfigInfo.getHotIndicator(DEBATE_HOT_CONFIG_NAME.HOT_SCORE_INDICATOR).then((hotRes) => {
        this.showHot = hotRes.value;
      });

    }).catch((err) => {
      // console.log(err);
    });
  }

  private getPinDebate(): void {
    let newDebateFilter = {
      limit: SEARCH_LIMIT,
      offset: SEARCH_OFFSET,
      select: [],
      relation: [],
      whereConditions: [],
      orderBy: {
        pinOrdering: "DESC",
        createdDate: "DESC"
      },
      count: false,
    }

    this.debateFacade.search(newDebateFilter, true, true).then((res) => {
      this.newDebate = res;

      this.hotConfigInfo.getHotIndicator(DEBATE_HOT_CONFIG_NAME.HOT_SCORE_INDICATOR).then((hotRes) => {
        this.showHot = hotRes.value;
      });

    }).catch((err) => {
      // console.log(err);
    });
  }

  private getHotDebate(): void {
    this.debateFacade.searchHot(5).then((res) => {
      this.hotDebate = res;

      this.hotConfigInfo.getHotIndicator(DEBATE_HOT_CONFIG_NAME.HOT_SCORE_INDICATOR).then((hotRes) => {
        this.showHot = hotRes.value;
      });

    }).catch((err) => {
      // console.log(err);
    });
  }

  public loadNextAllDebate(): void {
    this.isLoadingMore = true;
    this.currentOffset = this.currentOffset + SEARCH_LIMIT;

    let filter = {
      limit: SEARCH_LIMIT,
      offset: this.currentOffset,
      select: [],
      relation: [],
      whereConditions: [],
      orderBy: {
        createdDate: "DESC",
      },
      count: false,
    }

    this.debateFacade.search(filter, true, true).then((res) => {
      setTimeout(() => {
        this.isLoadingMore = false;
        if (this.debate === undefined) {
          this.debate = [];
        }
        if (Array.isArray(res) && res.length > 0) {
          // remove duplicate
          if (Array.isArray(res) && res.length < 5) {
            this.isShowLoadMore = false;
          }
          this.debate = this.debate.concat(res.filter((item) => this.debate.indexOf(item) < 0));
        } else {
          // length 0 mean no value so do not increase offset
          this.currentOffset = this.currentOffset - SEARCH_LIMIT;
          this.isShowLoadMore = false;
        }
      }, 250);
    }).catch((err) => {
      this.isLoadingMore = false;
      // console.log(err);
    });
  }

  public clickIsLogin(): void {
    this.showAlertLoginDialog("/main/debate/comment/create");
  }
}
