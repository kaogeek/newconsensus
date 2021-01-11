/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DebateFacade } from '../../../../services/facade/DebateFacade.service';
import { AbstractPage } from '../../AbstractPage';
import { AuthenManager, HotConfigInfo } from '../../../../services/services';
import { SearchFilter } from '../../../../models/models';
import { DEBATE_HOT_CONFIG_NAME } from '../../../../Constants';
import { CacheConfigInfo } from '../../../../services/CacheConfigInfo.service';

const PAGE_NAME: string = 'comment';
const SEARCH_LIMIT: number = 5;
const SEARCH_OFFSET: number = 0;

@Component({
  selector: 'newcon-debate-page',
  templateUrl: './DebateCommentPage.component.html',

})
export class DebateCommentPage extends AbstractPage implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME;

  public num = ['10', '20', '30', '40', '50', '60'];
  public debate: any = [];
  public showHot: any = [];

  private activatedRoute: ActivatedRoute;
  private debateFacade: DebateFacade;
  private currentOffset: number;
  private mode: string;
  private hotConfigInfo: HotConfigInfo;
  private cacheConfigInfo: CacheConfigInfo;


  public page: number;

  constructor(authenManager: AuthenManager, router: Router, activatedRoute: ActivatedRoute, hotConfigInfo: HotConfigInfo,cacheConfigInfo: CacheConfigInfo, debateFacade: DebateFacade, dialog: MatDialog) {
    super(PAGE_NAME, authenManager, dialog, router);
    this.debateFacade = debateFacade;
    this.currentOffset = SEARCH_OFFSET;
    this.activatedRoute = activatedRoute;
    this.hotConfigInfo = hotConfigInfo;
    this.cacheConfigInfo = cacheConfigInfo;

    this.activatedRoute.queryParams.subscribe(params => {
      this.page = params['page'] ? Number(params['page']) : 1;
      if (params['mode'] === 'hot') {
        this.mode = "hot";
      } else if (params['mode'] === 'suggest') {
        this.mode = 'suggest';
      } else {
        // except above value switch to here
        this.mode = "list";
      }
    });
  }

  ngOnInit() {
    super.ngOnInit();
    if (this.mode === "hot") {
      this.reloadHotTopic();
    } else if (this.mode === 'suggest') {
      this.reloadNewTopic();
    } else {
      this.reloadAllTopic();
    }
  }

  private reloadNewTopic(): void {
    this.debate = [];

    let filter = new SearchFilter();
    filter.limit = SEARCH_LIMIT;
    filter.offset = SEARCH_OFFSET;
    filter.orderBy = {
      "pinOrdering": "DESC",
      "createdDate": "DESC"
    };
    this.debateFacade.search(filter, true, true).then((result: any) => {
      this.debate = result;

      this.hotConfigInfo.getHotIndicator(DEBATE_HOT_CONFIG_NAME.HOT_SCORE_INDICATOR).then((hotRes) => {
        this.showHot = hotRes.value;
      });

    }).catch((error: any) => {
      // console.log('error: ' + error);
    });
  }

  private reloadHotTopic(limit?: number): void {
    this.debate = [];

    if (limit === undefined) {
      limit = SEARCH_LIMIT;
    }

    this.debateFacade.searchHot(limit).then((result: any) => {
      this.debate = result;

      this.hotConfigInfo.getHotIndicator(DEBATE_HOT_CONFIG_NAME.HOT_SCORE_INDICATOR).then((hotRes) => {
        this.showHot = hotRes.value;
      });

    }).catch((error: any) => {
      // console.log('error: ' + error);
    });
  }

  private reloadAllTopic(): void {
    this.debate = [];

    let filter = new SearchFilter();
    filter.limit = SEARCH_LIMIT;
    filter.offset = SEARCH_OFFSET;
    filter.orderBy = {
      "createdDate": "DESC"
    };
    this.debateFacade.search(filter, true, true).then((result: any) => {
      this.debate = result;

      this.hotConfigInfo.getHotIndicator(DEBATE_HOT_CONFIG_NAME.HOT_SCORE_INDICATOR).then((hotRes) => {
        this.showHot = hotRes.value;
      });

    }).catch((error: any) => {
      // console.log('error: ' + error);
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

  public isBtnCreate(): boolean {
    return !decodeURI(this.router.url).includes('/main/debate/comment/create');
  }

  public isHotTopic(): boolean {
    return this.mode === 'hot';
  }

  public loadNextAllDebate(): void {
    this.currentOffset = this.currentOffset + SEARCH_LIMIT;

    if (this.debate === undefined) {
      this.debate = [];
    }

    if (this.mode === "hot") {
      // hot can not load more reload mode only
      this.debate = [];
      this.reloadHotTopic(SEARCH_LIMIT);
    } else {
      let filter = new SearchFilter();
      filter.limit = SEARCH_LIMIT;
      filter.offset = this.currentOffset;
      filter.orderBy = {
        "createdDate": "DESC"
      };

      if (this.mode === 'suggest') {
        // load recomended topic
        filter.orderBy = {
          "pinOrdering": "DESC",
          "createdDate": "DESC"
        };
      }

      this.debateFacade.search(filter, true, true).then((res) => {
        if (this.debate === undefined) {
          this.debate = [];
        }

        if (Array.isArray(res) && res.length > 0) {
          // remove duplicate
          if (Array.isArray(res) && res.length < 5) {
            this.debate = this.debate.concat(res.filter((item) => this.debate.indexOf(item) < 0));
            document.getElementById("searchbt").style.display = "none";
          } else {
            this.debate = this.debate.concat(res.filter((item) => this.debate.indexOf(item) < 0));
          }
        }  else {
          // length 0 mean no value so do not increase offset
          this.currentOffset = this.currentOffset - SEARCH_LIMIT;
          document.getElementById("searchbt").style.display = "none";
        }
      }).catch((err) => {
        // console.log(err);
      });

    }
  }

  public clickIsLogin(): void {
    this.showAlertLoginDialog("/main/debate/comment/create");
  }
}
