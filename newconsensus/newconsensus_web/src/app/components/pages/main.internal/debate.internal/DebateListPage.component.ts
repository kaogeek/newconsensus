/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DebateFacade } from '../../../../services/facade/DebateFacade.service';
import { AbstractPage } from '../../AbstractPage';
import { DEBATE_HOT_CONFIG_NAME } from '../../../../Constants';
import { AuthenManager, HotConfigInfo } from '../../../../services/services';
import { ActivatedRoute, Router } from '@angular/router';
import { CacheConfigInfo } from '../../../../services/CacheConfigInfo.service';

const PAGE_NAME: string = 'toppost';
const SEARCH_LIMIT: number = 10;
const SEARCH_OFFSET: number = 0;

@Component({
  selector: 'newcon-list-debate-page',
  templateUrl: './DebateListPage.component.html',
})
export class DebateListPage extends AbstractPage implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME;

  private currentOffset: number;
  private debateFacade: DebateFacade;
  private hotConfigInfo: HotConfigInfo;
  private activatedRoute: ActivatedRoute;
  private cacheConfigInfo: CacheConfigInfo;

  public debate: any = [];
  public newDebate: any = [];
  public hotDebate: any = [];
  public showHot: any = [];
  public imagesAvatar: any = [];
  public isLoadingMore: boolean;
  public isShowLoadMore: boolean;
  public mode: string;
  public searchLimit: number = SEARCH_LIMIT;
  public p: number;
  public total: number;
  public loading: boolean;

  constructor(authenManager: AuthenManager, router: Router, activatedRoute: ActivatedRoute, debateFacade: DebateFacade, hotConfigInfo: HotConfigInfo, dialog: MatDialog,cacheConfigInfo: CacheConfigInfo) {
    super(PAGE_NAME, authenManager, dialog, router);
    this.debateFacade = debateFacade;
    this.hotConfigInfo = hotConfigInfo;
    this.currentOffset = SEARCH_OFFSET;
    this.activatedRoute = activatedRoute;
    this.isLoadingMore = false;
    this.isShowLoadMore = true;
    this.cacheConfigInfo = cacheConfigInfo;

    this.activatedRoute.params.subscribe(params => {
      if (params['mode'] === 'hot') {
        this.mode = "hot";
      } else if (params['mode'] === 'suggest') {
        this.mode = 'suggest';
      } else {
        this.mode = "list";
      }
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.p = params['page'] ? Number(params['page']) : 1;
    });
  }

  ngOnInit() {
    super.ngOnInit();
    this.countDebate().then(() => {
      this.getDebate(this.p);
    });
  }

  private countDebate(): Promise<number> {
    return new Promise((resolve, reject) => {
      if (this.mode === "hot") {
        this.debateFacade.countHot().then((res) => {
          this.total = res;
          resolve(res);
        }).catch((err) => {
          reject(err);
          // console.log(err);
        });
      } else {
        var filter = {
          limit: undefined,
          offset: undefined,
          select: [],
          relation: [],
          whereConditions: this.mode === 'suggest' ? "pin_ordering > 0" : [],
          orderBy: {},
          count: true,
        }
        this.debateFacade.search(filter, false, false).then((res: any) => {
          this.total = res;
          resolve(res);
        }).catch((err) => {
          reject(err);
          // console.log(err);
        });
      }
    });
  }

  private getDebate(page: number): void {
    this.loading = true;
    this.p = page;
    let offset = (page - 1) * SEARCH_LIMIT;
    if (this.mode === "hot") {
      this.getHotDebate(offset);
    } else {
      let filter = {
        limit: SEARCH_LIMIT,
        offset: offset,
        select: [],
        relation: [],
        whereConditions: this.mode === 'suggest' ? "pin_ordering > 0" : [],
        orderBy: this.mode === 'suggest' ? {
          createdDate: "DESC",
          pinOrdering: "DESC",
        } : {
          createdDate: "DESC"
        },
        count: false,
      }

      this.debateFacade.search(filter, true, true).then((res) => {
        this.loading = false;
        this.debate = res;
        this.hotConfigInfo.getHotIndicator(DEBATE_HOT_CONFIG_NAME.HOT_SCORE_INDICATOR).then((hotRes) => {
          this.showHot = hotRes.value;
        });
      }).catch((err) => {
        this.loading = false;
        // console.log(err);
      });
    }
  }

  private getHotDebate(offset): void {
    this.debateFacade.searchHot(SEARCH_LIMIT, offset).then((res) => {
      this.loading = false;
      this.debate = res;

      this.hotConfigInfo.getHotIndicator(DEBATE_HOT_CONFIG_NAME.HOT_SCORE_INDICATOR).then((hotRes) => {
        this.showHot = hotRes.value;
      });

    }).catch((err) => {
      // console.log(err);
    });
  }

  public getTopicHeaderLabel(): string {
    if (this.mode === 'hot') {
      return "กระทู้พูดคุยที่ฮิตที่สุด";
    } else if (this.mode === 'suggest') {
      return "กระทู้พูดคุยแนะนำ";
    }

    return "กระทู้พูดคุยทั้งหมด";
  }

  public clickIsLogin(): void {
    this.showAlertLoginDialog("/main/debate/comment/create");
  }

}
