/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AbstractPage } from '../../AbstractPage';
import { AuthenManager, HotConfigInfo } from '../../../../services/services';
import { Proposal, SearchFilter } from '../../../../models/models';
import { ProposalFacade } from '../../../../services/services';
import { PROPOSAL_HOT_CONFIG_NAME } from '../../../../Constants';

const PAGE_NAME: string = 'comment';
const SEARCH_LIMIT: number = 5;
const SEARCH_OFFSET: number = 0;
const URL_PATH_ROOM: string = '/proposal/room/';
const URL_PATH: string = '/proposal/comment/post/';

@Component({
  selector: 'newcon-proposal-comment-page',
  templateUrl: './ProposalCommentPage.component.html',
})
export class ProposalCommentPage extends AbstractPage implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME;

  private activatedRoute: ActivatedRoute;
  private proposalFacade: ProposalFacade;
  private currentOffset: number;
  private mode: string;
  private roomId: string;
  private hotConfigInfo: HotConfigInfo;

  public roomIdName: string;
  public newTopicList: Proposal[];
  public showHot: any = [];
  public isShowCot: boolean;

  constructor(authenManager: AuthenManager, router: Router, activatedRoute: ActivatedRoute, hotConfigInfo: HotConfigInfo, proposalFacade: ProposalFacade, dialog: MatDialog) {
    super(PAGE_NAME, authenManager, dialog, router);

    this.activatedRoute = activatedRoute;
    this.proposalFacade = proposalFacade;
    this.newTopicList = [];
    this.currentOffset = SEARCH_OFFSET;
    this.hotConfigInfo = hotConfigInfo;
    this.router = router;
    

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        const url: string = decodeURI(this.router.url);

        if (url.indexOf(URL_PATH_ROOM) >= 0) {
          const substringPath: string = url.substring(url.indexOf(URL_PATH_ROOM), url.length);
          const replaceURL: string = substringPath.replace(URL_PATH_ROOM, '');
          const replaceCommentURL: string = replaceURL.replace("/comment/post", '');
          const splitText = replaceCommentURL.split('/');

          if (splitText.length > 0) {
            // [0] must be id 
            this.roomIdName = splitText[0];
          }
        }
      }
    });

    this.activatedRoute.queryParams.subscribe(params => {
      if (params['mode'] === 'hot') {
        this.mode = "hot";
      } else if (params['mode'] === 'suggest') {
        this.mode = 'suggest';
      } else {
        // except above value switch to here
        this.mode = "list";
      }

      if (params['room'] !== undefined) {
        this.roomId = params['room'];
      }
    });
  }

  ngOnInit() {
    super.ngOnInit();
    this.getRelateProposal();
  }

  private reloadNewTopic(): void {
    this.newTopicList = [];

    let filter = new SearchFilter();
    filter.limit = SEARCH_LIMIT;
    filter.offset = SEARCH_OFFSET;
    filter.whereConditions = "pin_ordering is not null and approve_user_id is not null";
    filter.orderBy = {
      "pinOrdering": "ASC",
      "createdDate": "DESC"
    };
    if (this.roomId !== undefined && this.roomId !== '') {
      filter.whereConditions = "pin_ordering is not null and approve_user_id is not null and room_id = '" + this.roomId + "'";
    }
    this.proposalFacade.search(filter, true, true).then((result: any) => {
      this.newTopicList = result;

      this.hotConfigInfo.getHotIndicator(PROPOSAL_HOT_CONFIG_NAME.HOT_SCORE_INDICATOR).then((hotRes) => {
        this.showHot = hotRes.value;
      });

    }).catch((error: any) => {
      // console.log('error: ' + error);
    });
  }

  private reloadHotTopic(limit?: number): void {
    this.newTopicList = [];

    if (limit === undefined) {
      limit = SEARCH_LIMIT;
    }

    let roomId: number = undefined;
    try {
      var reg = /^\d+$/;
      if (this.roomId !== undefined && this.roomId.match(reg)) {
        roomId = parseInt(this.roomId);
      }
    } catch (ex) {
    }

    this.proposalFacade.searchHot(false, roomId, undefined, limit).then((result: any) => {
      this.newTopicList = result;

      this.hotConfigInfo.getHotIndicator(PROPOSAL_HOT_CONFIG_NAME.HOT_SCORE_INDICATOR).then((hotRes) => {
        this.showHot = hotRes.value;
      });

    }).catch((error: any) => {
      // console.log('error: ' + error);
    });
  }

  private reloadAllTopic(): void {
    this.newTopicList = [];

    let filter = new SearchFilter();
    filter.limit = SEARCH_LIMIT;
    filter.offset = SEARCH_OFFSET;
    filter.orderBy = {
      "createdDate": "DESC"
    };
    if (this.roomId !== undefined && this.roomId !== '') {
      filter.whereConditions = [
        {
          roomId: this.roomId
        }
      ];
    }
    this.proposalFacade.search(filter, true, true).then((result: any) => {
      this.newTopicList = result;

      this.hotConfigInfo.getHotIndicator(PROPOSAL_HOT_CONFIG_NAME.HOT_SCORE_INDICATOR).then((hotRes) => {
        this.showHot = hotRes.value;
      });

    }).catch((error: any) => {
      // console.log('error: ' + error);
    });
  }

  public isBtnCreate(): boolean {
    return !decodeURI(this.router.url).includes('/main/proposal/comment/create');
  }

  public getTopicHeaderLabel(): string {
    if (this.mode === 'hot') {
      return "ข้อเสนอ ที่ฮิตที่สุด";
    } else if (this.mode === 'suggest') {
      return "ข้อเสนอแนะนำ";
    }

    return "ข้อเสนอ";
  }

  public loadNextAllProposel(): void {
    this.currentOffset = this.currentOffset + SEARCH_LIMIT;

    if (this.newTopicList === undefined) {
      this.newTopicList = [];
    }

    if (this.mode === "hot") {
      // hot can not load more except
      this.reloadHotTopic(this.currentOffset);
    } else {
      let filter = new SearchFilter();
      filter.limit = SEARCH_LIMIT;
      filter.offset = this.currentOffset;
      filter.orderBy = {
        "createdDate": "DESC"
      };
      if (this.roomId !== undefined && this.roomId !== '') {
        filter.whereConditions = [
          {
            roomId: this.roomId
          }
        ];
      }

      if (this.mode === 'suggest') {
        filter.whereConditions = "pin_ordering is not null and approve_user_id is not null";
        filter.orderBy = {
          "pinOrdering": "ASC",
          "createdDate": "DESC"
        };
        if (this.roomId !== undefined && this.roomId !== '') {
          filter.whereConditions = "pin_ordering is not null and approve_user_id is not null and room_id = '" + this.roomId + "'";
        }
      }

      this.proposalFacade.search(filter, true, true).then((res) => {
        if (this.newTopicList === undefined) {
          this.newTopicList = [];
        }

        if (Array.isArray(res) && res.length > 0) {
          // remove duplicate
          this.newTopicList = this.newTopicList.concat(res.filter((item) => this.newTopicList.indexOf(item) < 0));
        } else {
          document.getElementById("searchbt").style.display = "none";
        }


      }).catch((err) => {
        // console.log(err);
      });

    }
  }

  public clickIsLogin(): void {
    this.showAlertLoginDialog("/main/proposal/comment/create");
  }

  public clickUrl(): void {
    this.isShowCot = true;
    this.getRelateProposal();
    this.router.navigateByUrl("/main/proposal/comment/create");
  }


  private getRelateProposal(): void {
    this.newTopicList = [];
    const url: string = decodeURI(this.router.url);
    const urlsplit1 = url.split('-');
    const urls = urlsplit1[0];
    const urlsplit2 = urls.split('post/');
    const proposalID: string = urlsplit2[1];
    if (this.isShowCot === true) {
      this.proposalFacade.getRelateProposal(proposalID).then((result: any) => {
        this.newTopicList = result;
        if (this.newTopicList.length === 0) {
          if (this.mode === "hot") {
            this.reloadHotTopic();
          } else if (this.mode === 'suggest') {
            this.reloadNewTopic();
          } else {
            this.reloadAllTopic();
          }
        }
      }).catch((error: any) => {
      });
    }
    if (this.mode === "hot") {
      this.reloadHotTopic();
    } else if (this.mode === 'suggest') {
      this.reloadNewTopic();
    } else {
      this.reloadAllTopic();
    }
  }

}
