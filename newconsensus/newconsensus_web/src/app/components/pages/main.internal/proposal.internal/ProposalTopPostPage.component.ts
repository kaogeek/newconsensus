import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Proposal, SearchFilter } from '../../../../models/models';
import { ProposalFacade, HotConfigInfo } from '../../../../services/services';
import { PROPOSAL_HOT_CONFIG_NAME } from '../../../../Constants';

const PAGE_NAME: string = 'post';
// const URL_PATH: string = '/main/room/';
const URL_PATH_ROOM: string = '/main/proposal/room';
const URL_PATH: string = '/main/proposal';
const SEARCH_LIMIT: number = 5;
const SEARCH_OFFSET: number = 0;

@Component({
  selector: 'newcon-proposal-top-post-page',
  templateUrl: './ProposalTopPostPage.component.html',
})
export class ProposalTopPostPage implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME;

  private router: Router
  private proposalFacade: ProposalFacade;
  private roomId: string;
  private roomIdName: string;
  private currentOffset: number;
  private hotConfigInfo: HotConfigInfo;

  public allTopicList: Proposal[];
  public newTopicList: Proposal[];
  public hotTopicList: Proposal[];
  public isLoadingMore: boolean;
  public isShowLoadMore: boolean;
  public showHot: any = [];

  constructor(router: Router, proposalFacade: ProposalFacade, hotConfigInfo: HotConfigInfo) {
    this.router = router;
    this.proposalFacade = proposalFacade;
    this.allTopicList = [];
    this.newTopicList = [];
    this.hotTopicList = [];
    this.isLoadingMore = false;
    this.isShowLoadMore = true;
    this.currentOffset = SEARCH_OFFSET;
    this.hotConfigInfo = hotConfigInfo;

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        const url: string = decodeURI(this.router.url);

        if (url.indexOf(URL_PATH_ROOM) >= 0) {
          const substringPath: string = url.substring(url.indexOf(URL_PATH), url.length);
          const replaceURL: string = substringPath.replace(URL_PATH, '');
          // pattern should be '/roomId/proposal' or 'proposal/...'
          const splitUrl = replaceURL.split('/room/');
          let roomId: string = '';
          if (splitUrl.length > 0) {
            roomId = splitUrl[1];
            this.roomIdName = splitUrl[1];
          }

          const splitText = roomId.split('-');

          if (splitText.length > 0) {
            // [0] must be id
            roomId = splitText[0];
          } else {
            roomId = replaceURL;
          }

          let regEx = /^\d+$/;
          if (!roomId.match(regEx)) {
            roomId = undefined;
          }

          this.initPage(roomId);
        } else if (url.indexOf(URL_PATH) >= 0) {
          this.initPage(undefined);
        }
      }
    });
  }

  ngOnInit() {

  }

  private initPage(roomId: string): void {
    this.roomId = roomId;
    this.reloadAllTopic();
    this.reloadNewTopic();
    this.reloadHotTopic();
  }

  private reloadAllTopic(): void {
    this.allTopicList = [];

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
      this.allTopicList = result;
      if (result && result.length < 5) {
        this.isShowLoadMore = false;
      }

      this.hotConfigInfo.getHotIndicator(PROPOSAL_HOT_CONFIG_NAME.HOT_SCORE_INDICATOR).then((hotRes) => {
        this.showHot = hotRes.value;
      });

    }).catch((error: any) => {
      // console.log('error: ' + error);
    });
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

  private reloadHotTopic(): void {
    this.hotTopicList = [];

    let roomId: number = undefined;
    try {
      var reg = /^\d+$/;
      if (this.roomId !== undefined && this.roomId.match(reg)) {
        roomId = parseInt(this.roomId);
      }
    } catch (ex) {
    }

    this.proposalFacade.searchHot(false, roomId, undefined, 5).then((result: any) => {
      this.hotTopicList = result;

      this.hotConfigInfo.getHotIndicator(PROPOSAL_HOT_CONFIG_NAME.HOT_SCORE_INDICATOR).then((hotRes) => {
        this.showHot = hotRes.value;
      });

    }).catch((error: any) => {
      // console.log('error: ' + error);
    });
  }

  public loadNextAllProposel(): void {
    this.isLoadingMore = true;
    this.currentOffset = this.currentOffset + SEARCH_LIMIT;

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

    this.proposalFacade.search(filter, true, true).then((res) => {
      setTimeout(() => {
        this.isLoadingMore = false;
        if (this.allTopicList === undefined) {
          this.allTopicList = [];
        }

        if (Array.isArray(res) && res.length > 0) {
          // remove duplicate
          if (res.length < 5) {
            this.isShowLoadMore = false;
          }
          this.allTopicList = this.allTopicList.concat(res.filter((item) => {
            return this.allTopicList.indexOf(item) < 0;
          }));
        } else {
          // length 0 mean no value so do not increase offset
          this.currentOffset = this.currentOffset - SEARCH_LIMIT;
          this.isShowLoadMore = false;
        }

        this.hotConfigInfo.getHotIndicator(PROPOSAL_HOT_CONFIG_NAME.HOT_SCORE_INDICATOR).then((hotRes) => {
          this.showHot = hotRes.value;
        });
      }, 250);
    }).catch((err) => {
      // console.log(err);
    });
  }
}
