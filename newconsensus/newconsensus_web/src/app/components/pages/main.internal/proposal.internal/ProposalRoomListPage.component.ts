import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProposalFacade } from '../../../../services/facade/ProposalFacade.service';
import { AbstractPage } from '../../AbstractPage';
import { DEBATE_HOT_CONFIG_NAME } from '../../../../Constants';
import { AuthenManager, HotConfigInfo } from '../../../../services/services';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

const PAGE_NAME: string = 'toppost';
const SEARCH_LIMIT: number = 10;
const SEARCH_OFFSET: number = 0;
const URL_PATH_ROOM: string = '/main/proposal/room/';

@Component({
  selector: 'newcon-list-room-proposal-page',
  templateUrl: './ProposalRoomListPage.component.html',
})
export class ProposalRoomListPage extends AbstractPage implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME;

  private currentOffset: number;
  private proposalFacade: ProposalFacade;
  private hotConfigInfo: HotConfigInfo;
  private activatedRoute: ActivatedRoute;

  public proposal: any = [];
  public newProposal: any = [];
  public hotProposal: any = [];
  public showHot: any = [];
  public imagesAvatar: any = [];
  public isLoadingMore: boolean;
  public isShowLoadMore: boolean;
  public mode: string;
  public roomId: string;
  public roomIdName: string;
  public roomName: string;
  public searchLimit: number = SEARCH_LIMIT;
  public p: number;
  public total: number;
  public loading: boolean;

  constructor(authenManager: AuthenManager, router: Router, activatedRoute: ActivatedRoute, proposalFacade: ProposalFacade, hotConfigInfo: HotConfigInfo, dialog: MatDialog) {
    super(PAGE_NAME, authenManager, dialog, router);
    this.proposalFacade = proposalFacade;
    this.hotConfigInfo = hotConfigInfo;
    this.currentOffset = SEARCH_OFFSET;
    this.activatedRoute = activatedRoute;
    this.isLoadingMore = false;
    this.isShowLoadMore = true;
    this.router = router;

    const url: string = decodeURI(this.router.url);

    if (url.indexOf(URL_PATH_ROOM) >= 0) {
      const substringPath: string = url.substring(url.indexOf(URL_PATH_ROOM), url.length);
      const replaceURL: string = substringPath.replace(URL_PATH_ROOM, '');
      // pattern should be '/roomId/proposal' or 'proposal/...'
      const splitUrl = replaceURL.split('/');
      let roomId: string = '';
      if (splitUrl.length > 0) {
        roomId = splitUrl[0];
        const splitName = splitUrl[0].split('-');
        this.roomIdName = splitUrl[0];
        this.roomName = splitName[1];
      }

      const splitText = roomId.split('-');

      if (splitText.length > 0) {
        // [0] must be id
        this.roomId = splitText[0];
      } else {
        this.roomId = replaceURL;
      }

      let regEx = /^\d+$/;
      if (!this.roomId.match(regEx)) {
        this.roomId = undefined;
      }
    }

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
    this.countProposal().then(() => {
      this.getProposal(this.p);
    });
  }

  private countProposal(): Promise<number> {
    return new Promise((resolve, reject) => {
      if (this.mode === "hot") {
        this.proposalFacade.searchHot(true, Number(this.roomId)).then((res) => {
          this.total = res;
          resolve(res);
        }).catch((err) => {
          reject(err);
          // console.log(err);
        });
      } else {
        var filter: any = {
          limit: undefined,
          offset: undefined,
          select: [],
          relation: [],
          whereConditions: this.mode === 'suggest' ? "pin_ordering > 0 " : "",
          orderBy: {},
          count: true,
        }
        if (this.roomId) {
          if (filter.whereConditions === "") {
            filter.whereConditions += "room_id = " + this.roomId;
          } else {
            filter.whereConditions += "and room_id = " + this.roomId;
          }
        }
        this.proposalFacade.search(filter, false, false).then((res: any) => {
          this.total = res;
          resolve(res);
        }).catch((err) => {
          reject(err);
          // console.log(err);
        });
      }
    });
  }

  private getProposal(page: number): void {
    this.loading = true;
    this.p = page;
    let offset = (page - 1) * SEARCH_LIMIT;
    if (this.mode === "hot") {
      this.getHotProposal(offset);
    } else {
      let filter: any = {
        limit: SEARCH_LIMIT,
        offset: offset,
        select: [],
        relation: [],
        whereConditions: this.mode === 'suggest' ? "pin_ordering > 0 " : "",
        orderBy: {
          createdDate: "DESC",
          pinOrdering: "DESC",
        },
        count: false,
      }
      if (this.roomId) {
        if (filter.whereConditions === "") {
          filter.whereConditions += "room_id = " + this.roomId;
        } else {
          filter.whereConditions += "and room_id = " + this.roomId;
        }
      }

      this.proposalFacade.search(filter, true, true).then((res) => {
        this.loading = false;
        this.proposal = res;
        this.hotConfigInfo.getHotIndicator(DEBATE_HOT_CONFIG_NAME.HOT_SCORE_INDICATOR).then((hotRes) => {
          this.showHot = hotRes.value;
        });
      }).catch((err) => {
        this.loading = false;
        // console.log(err);
      });
    }
  } 

  private getHotProposal(offset): void {
    this.proposalFacade.searchHot(false, Number(this.roomId), offset, SEARCH_LIMIT).then((res) => {
      this.loading = false;
      this.proposal = res;

      this.hotConfigInfo.getHotIndicator(DEBATE_HOT_CONFIG_NAME.HOT_SCORE_INDICATOR).then((hotRes) => {
        this.showHot = hotRes.value;
      });

    }).catch((err) => {
      // console.log(err);
    });
  }

  public getTopicHeaderLabel(): string {
    if (this.mode === 'hot') {
      return "ข้อเสนอยอดนิยม";
    } else if (this.mode === 'suggest') {
      return "ข้อเสนอแนะนำ";
    }

    return "ข้อเสนอทั้งหมด";
  }
}
