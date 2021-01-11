/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DebateFacade } from '../../../../services/facade/DebateFacade.service';
import { DebateCommentFacade, PageUserInfo } from '../../../../services/services';
import { SearchFilter, DebateComment } from '../../../../models/models';
import { AuthenManager } from '../../../../services/AuthenManager.service';
import { AbstractPage } from '../../AbstractPage';
import { MESSAGE } from '../../../../AlertMessage';
import { DialogEditComment } from 'src/app/components/shares/dialog/dialog';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CacheConfigInfo } from '../../../../services/CacheConfigInfo.service';
import { BadWordUtils } from '../../../../utils/BadWordUtils';
import { ActionLogFacade } from '../../../../services/facade/ActionLogFacade.service';
import { DEBATE_COMMENT_APPROVE } from '../../../../Constants';

const PAGE_NAME: string = 'post';
const URL_PATH: string = '/main/debate/comment/post/';
const SEARCH_LIMIT: number = 10;
const SEARCH_OFFSET: number = 0;

@Component({
  selector: 'newcon-post-debate-page',
  templateUrl: './DebatePostPage.component.html',
})
export class DebatePostPage extends AbstractPage implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME;
  public linkUrl: string;
  private debateFacade: DebateFacade;
  private debateCommentFacade: DebateCommentFacade;
  private debateComment: string;
  private debateId: string;
  private currentOffset: number;
  private pageUserInfo: PageUserInfo;
  private activatedRoute: ActivatedRoute;
  private cacheConfigInfo: CacheConfigInfo;
  private actionLogFacade: ActionLogFacade;

  public debate: any;
  public debateComments: any[];
  public isSending: boolean;
  public isLoadingMore: boolean;
  public isShowLoadMore: boolean;
  public Editor = ClassicEditor;
  public debateIdName: string;
  public debateName: string;
  public mode: string;
  public page: number;

  public isCommentApprove: boolean;

  constructor(authenManager: AuthenManager, router: Router,
    debateFacade: DebateFacade, activatedRoute: ActivatedRoute, debateCommentFacade: DebateCommentFacade, dialog: MatDialog, pageUserInfo: PageUserInfo, cacheConfigInfo: CacheConfigInfo, actionLogFacade: ActionLogFacade) {
    super(PAGE_NAME, authenManager, dialog, router);
    this.debateFacade = debateFacade;
    this.router = router;
    this.pageUserInfo = pageUserInfo;
    this.debateCommentFacade = debateCommentFacade;
    this.debate = {};
    this.debateComments = [];
    this.isSending = false;
    this.isLoadingMore = false;
    this.isShowLoadMore = true;
    this.activatedRoute = activatedRoute;
    this.currentOffset = SEARCH_OFFSET;
    this.cacheConfigInfo = cacheConfigInfo;
    this.actionLogFacade = actionLogFacade;

    this.activatedRoute.queryParams.subscribe(params => {
      this.page = params['page'] ? Number(params['page']) : 1;
      if (params['mode'] === 'hot') {
        this.mode = "hot";
      } else if (params['mode'] === 'suggest') {
        this.mode = 'suggest';
      } else {
        this.mode = "list";
      }
    });

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        const url: string = decodeURI(this.router.url);

        if (url.indexOf(URL_PATH) >= 0) {
          const replaceURL: string = url.replace(URL_PATH, '');
          const splitText = replaceURL.split('-');
          this.debateIdName = replaceURL;

          let topicId: string = '';
          if (splitText.length > 0) {
            // [0] must be id
            topicId = splitText[0];
            const debateName = splitText[1].split('?');
            this.debateName = debateName[0];
          } else {
            topicId = replaceURL;
          }

          let regEx = /^\d+$/;
          if (!topicId.match(regEx)) {
            topicId = undefined;
          }

          if (topicId) {
            this.initPage(topicId);
          }
        }
      }
    });
  }

  ngOnInit() {
    super.ngOnInit();
    this.shareLinkToFacebook();
  }
  public shareLinkToFacebook(): any {
    this.linkUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href);
  }

  private loadImageUserComment(): void {
    for (let debateComment of this.debateComments) {
      if (debateComment.pageUser) {
        this.pageUserInfo.addPageUser(debateComment.pageUser);
      }
    }
  }

  private initPage(debateId: string): void {
    this.debateId = debateId;
    this.debate = {};
    this.debateComments = [];

    let userId = this.getCurrentUserId();

    this.debateFacade.find(this.debateId, userId).then((result: any) => {
      this.debate = result;
      if (this.debate.pageUser) {
        this.pageUserInfo.addPageUser(this.debate.pageUser);
      }

      this.actionLogFacade.createActionLog(this.debateId, 'debate'); // add log
    }).catch((error: any) => {
      this.router.navigateByUrl("/main/debate");
    });

    let filter = new SearchFilter();

    this.cacheConfigInfo.getConfig(DEBATE_COMMENT_APPROVE).then((config: any) => {
      if (config.value !== undefined) {
        this.isCommentApprove = (config.value.toLowerCase() === 'true');
        if (this.isCommentApprove !== true) {
          filter.limit = SEARCH_LIMIT;
          filter.offset = SEARCH_OFFSET;
          filter.orderBy = {
            "id": "ASC"
          };
        } else {
          filter.limit = SEARCH_LIMIT;
          filter.offset = SEARCH_OFFSET;
          filter.whereConditions = "approve_user_id is not null";
          filter.orderBy = {
            "id": "ASC"
          };
        }
      }

      this.debateCommentFacade.search(this.debateId, filter, true, userId).then((result: any) => {
        this.debateComments = result;
        if (result && result.length < 10) {
          this.isShowLoadMore = false;
        }

        this.loadImageUserComment();
      }).catch((error: any) => {
        // console.log(error);
      });
    }).catch((error: any) => {
    });

    this.reloadDebateComment();
  }

  private reloadDebateComment(): void {
    this.debateComments = [];

    let filter = new SearchFilter();
    filter.limit = SEARCH_LIMIT;
    filter.offset = SEARCH_OFFSET;
    filter.orderBy = {
      "id": "ASC"
    };

    this.debateCommentFacade.search(this.debateId, filter, true).then((result: any) => {
      this.debateComments = result;
      if (result && result.length < 10) {
        this.isShowLoadMore = false;
      }
      this.loadImageUserComment();
    }).catch((error: any) => {
      // console.log(error);
    });
  }

  private updateDebateLike(dabate: any): void {
    if (dabate === null || dabate === undefined) {
      return;
    }

    if (this.debate !== undefined) {
      this.debate.likeCount = dabate.likeCount;
      this.debate.dislikeCount = dabate.dislikeCount;
    }
  }

  private updateCommentLike(commentData: any, index: number, isLike: boolean) {
    if (index === undefined) {
      return;
    }

    if (this.debateComments && index < this.debateComments.length) {
      this.debateComments[index].isUserLike = isLike;
      this.debateComments[index].likeCount = commentData.likeCount;
      this.debateComments[index].dislikeCount = commentData.dislikeCount;
    }
  }

  private updateComment(commentData: any, index: number) {
    if (index === undefined) {
      return;
    }

    if (this.debateComments && index < this.debateComments.length) {
      this.debateComments[index].comment = commentData.comment;
    }
  }

  private removeComment(index: number) {
    if (index === undefined) {
      return;
    }

    if (this.debateComments && index < this.debateComments.length) {
      this.debateComments.splice(index, 1);
    }
  }

  public getTopicHeaderLabel(): string {
    if (this.mode === 'hot') {
      return "กระทู้พูดคุยยอดนิยม";
    } else if (this.mode === 'suggest') {
      return "กระทู้พูดคุยแนะนำ";
    }

    return "กระทู้พูดคุยทั้งหมด";
  }

  public isShowAction(itemUserId: string): boolean {
    const userId = this.getCurrentUserId() + "";
    return userId === itemUserId + "";
  }

  public createDebateComment(): void {
    if (!this.isLogin()) {
      this.showAlertLoginDialog("/main/debate/comment/post/" + this.debateIdName);
      return;
    }

    if (this.debateId === undefined || this.debateId === null || this.debateId === '') {
      this.showAlertDialog('ไม่พบรหัสกระทู้พูดคุย กรุณารีเฟรชหน้าใหม่');
      return;
    }

    if (this.debateComment === undefined || this.debateComment === null || this.debateComment === '' || this.debateComment.trim().length <= 0) {
      this.showAlertDialog('กรุณาใส่ Comment');
      return;
    }

    let dbComment = new DebateComment();
    dbComment.comment = this.debateComment.trim();
    this.isSending = true;

    // filter
    dbComment.comment = BadWordUtils.clean(dbComment.comment);

    this.debateCommentFacade.create(this.debateId, dbComment).then((result: any) => {
      this.debateComment = '';
      this.isSending = false;
      if (this.debateComments.length < 10) {
        this.reloadDebateComment();
      }
      this.showAlertDialog('ความคิดเห็นของคุณจะถูกแสดงเมื่อ Admin อนุมัติ');
    }).catch((error: any) => {
      this.showAlertDialog('Error : ' + JSON.stringify(error));
      this.isSending = false;
    });
  }

  public likeDebate(commentId: string, index: number): void {
    if (!this.isLogin()) {
      this.showAlertLoginDialog("/main/debate/comment/post/" + this.debateIdName);
      return;
    }

    this.debateCommentFacade.likeDebateComment(this.debateId, commentId, 'true').then((result: any) => {
      this.updateCommentLike(result, index, this.debateComments[index].isUserLike === true ? undefined : true);
    }).catch((error: any) => {
      this.showAlertDialog(JSON.stringify(error));
    });
  }

  public dislikeDebate(commentId: string, index: number): void {
    if (!this.isLogin()) {
      this.showAlertLoginDialog("/main/debate/comment/post/" + this.debateIdName);
      return;
    }

    this.debateCommentFacade.likeDebateComment(this.debateId, commentId, 'false').then((result: any) => {
      this.updateCommentLike(result, index, this.debateComments[index].isUserLike === false ? undefined : false);
    }).catch((error: any) => {
      this.showAlertDialog(JSON.stringify(error));
    });
  }

  public showEditCommentDialog(data: any, index: number): void {
    const confirmEventEmitter = new EventEmitter<any>();
    confirmEventEmitter.subscribe((result: any) => {
      const cloneData = JSON.parse(JSON.stringify(data));
      cloneData.comment = result.text;

      this.debateCommentFacade.edit(this.debateId, data.id, cloneData).then((result: any) => {
        // update comments
        this.updateComment(result, index);
      }).catch((error: any) => {
        this.showAlertDialog('Error : ' + JSON.stringify(error));
      });
    });

    this.dialog.open(DialogEditComment, {
      disableClose: true,
      data: {
        text: (data.comment) ? data.comment : '',
        confirmClickedEvent: confirmEventEmitter
      }
    });
  }

  public showDeleteCommentDialog(commentId: any, index: number): void {
    const confirmEventEmitter = new EventEmitter<any>();
    confirmEventEmitter.subscribe(() => {
      this.debateCommentFacade.delete(this.debateId, commentId).then((result: any) => {
        this.removeComment(index);
      }).catch((error: any) => {
        this.showAlertDialog('Error : ' + JSON.stringify(error));
      });
    });

    this.showDialogWithOptions({
      title: 'ลบข้อมูล',
      text: MESSAGE.TEXT_DELETE_CONTENT,
      bottomText1: MESSAGE.TEXT_BUTTON_CANCEL,
      bottomText2: MESSAGE.TEXT_BUTTON_CONFIRM,
      bottomColorText2: "black",
      confirmClickedEvent: confirmEventEmitter,
    }
    );
  }

  public loadNextAllComment(): void {
    if (this.debateId === undefined) {
      return;
    }

    this.isLoadingMore = true;
    this.currentOffset = this.currentOffset + SEARCH_LIMIT;

    if (this.debateComments === undefined) {
      this.debateComments = [];
    }

    let filter = new SearchFilter();
    filter.limit = SEARCH_LIMIT;
    filter.offset = this.currentOffset;
    filter.orderBy = {
      "id": "ASC"
    };

    let userId = this.getCurrentUserId();

    this.debateCommentFacade.search(this.debateId, filter, true, userId).then((result: any) => {
      setTimeout(() => {
        this.isLoadingMore = false;
        if (Array.isArray(result) && result.length > 0) {
          if (result.length < 10) {
            this.isShowLoadMore = false;
          }
          // remove duplicate
          for (const comment of result) {
            if (comment.pageUser) {
              this.pageUserInfo.addPageUser(comment.pageUser);
            }
          }
          this.debateComments = this.debateComments.concat(result.filter((item) => this.debateComments.indexOf(item) < 0));
        } else {
          this.isShowLoadMore = false;
        }
      }, 250);
    }).catch((error: any) => {
      this.isLoadingMore = false;
      // console.log(error);
    });

  }

  public likeBtnClicked(): void {
    if (this.debateId === undefined || this.debateId === null) {
      return;
    }

    if (!this.isLogin()) {
      this.showAlertLoginDialog("/main/debate/comment/post/" + this.debateIdName);
      return;
    }

    this.debateFacade.likeDebate(this.debateId, true).then((result: any) => {
      this.updateDebateLike(result);
      if (this.debate.isUserLike) {
        this.debate.isUserLike = undefined;
      } else {
        this.debate.isUserLike = true;
      }
    }).catch((error: any) => {
      this.showAlertDialog(JSON.stringify(error));
    });
  }

  public dislikeBtnClicked(): void {
    if (this.debateId === undefined || this.debateId === null) {
      return;
    }

    if (!this.isLogin()) {
      this.showAlertLoginDialog("/main/debate/comment/post/" + this.debateIdName);
      return;
    }

    this.debateFacade.likeDebate(this.debateId, false).then((result: any) => {
      this.updateDebateLike(result);
      if (this.debate.isUserLike === false) {
        this.debate.isUserLike = undefined;
      } else {
        this.debate.isUserLike = false;
      }
    }).catch((error: any) => {
      this.showAlertDialog(JSON.stringify(error));
    });
  }
}
