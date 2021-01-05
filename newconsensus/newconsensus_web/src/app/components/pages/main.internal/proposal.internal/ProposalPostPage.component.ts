import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ProposalComment, SearchFilter } from '../../../../models/models';
import { ProposalFacade } from '../../../../services/facade/ProposalFacade.service';
import { ProposalCommentFacade } from '../../../../services/facade/ProposalCommentFacade.service';
import { AuthenManager } from '../../../../services/AuthenManager.service';
import { ObservableManager } from '../../../../services/ObservableManager.service';
import { AbstractPage } from '../../AbstractPage';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditComment } from 'src/app/components/shares/dialog/dialog';
import { MESSAGE } from '../../../../AlertMessage';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ImageFacade } from '../../../../services/facade/ImageFacade.service';
import { PageUserInfo } from '../../../../services/PageUserInfo.service';
import { CacheConfigInfo } from '../../../../services/CacheConfigInfo.service';
import { BadWordUtils } from '../../../../utils/BadWordUtils';
import { ActionLogFacade } from '../../../../services/facade/ActionLogFacade.service';
import { DEBATE_MENU_ENABLE, PROPOSAL_COMMENT_APPROVE } from '../../../../Constants';

const PAGE_NAME: string = 'post';
// const URL_PATH: string = '/proposal/room/comment/post/';
const URL_PATH_ROOM: string = '/proposal/room/';
const URL_PATH: string = '/proposal/comment/post/';
const SEARCH_APPROVE: string = '';
const SEARCH_LIMIT: number = 10;
const SEARCH_OFFSET: number = 0;

@Component({
  selector: 'newcon-proposal-post-page',
  templateUrl: './ProposalPostPage.component.html',
})
export class ProposalPostPage extends AbstractPage implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME;

  private observManager: ObservableManager;
  private proposalFacade: ProposalFacade;
  private proposalCommentFacade: ProposalCommentFacade;
  private proposalId: string;
  private isUserPPSupport: boolean;
  private currentOffset: number;
  private pageUserInfo: PageUserInfo;
  private activatedRoute: ActivatedRoute;
  private cacheConfigInfo: CacheConfigInfo;
  private actionLogFacade: ActionLogFacade;

  private accessToken: any;
  public proposal: any;
  public proposalcomments: any[];
  public roomIdName: string;
  public roomName: string;
  public proposalIdName: string;
  public proposalName: string;
  public comment: string;
  public linkUrl: string;
  public isShowLoadMore: boolean;
  public isLoadingMore: boolean;
  public isSending: boolean;
  public mode: string;
  public page: number;
  public redirection: string;

  public Editor = ClassicEditor;

  public isShowDebate: boolean;
  public isCommentApprove: boolean;

  constructor(authenManager: AuthenManager, activatedRoute: ActivatedRoute, router: Router, observManager: ObservableManager, proposalFacade: ProposalFacade,
    proposalCommentFacade: ProposalCommentFacade, dialog: MatDialog, imageAvatarFacade: ImageFacade, pageUserInfo: PageUserInfo, cacheConfigInfo: CacheConfigInfo, actionLogFacade: ActionLogFacade) {
    super(PAGE_NAME, authenManager, dialog, router);
    this.router = router;
    this.pageUserInfo = pageUserInfo;
    this.observManager = observManager;
    this.proposalFacade = proposalFacade;
    this.proposalCommentFacade = proposalCommentFacade;
    this.proposal = {};
    this.proposalcomments = [];
    this.isUserPPSupport = false;
    this.isSending = false;
    this.isLoadingMore = false;
    this.isShowLoadMore = true;
    this.currentOffset = SEARCH_OFFSET;
    this.activatedRoute = activatedRoute;
    this.cacheConfigInfo = cacheConfigInfo;
    this.actionLogFacade = actionLogFacade;

    this.cacheConfigInfo.getConfig(DEBATE_MENU_ENABLE).then((config: any) => {
      if (config.value !== undefined) {
        this.isShowDebate = (config.value.toLowerCase() === 'true');
      }
    }).catch((error: any) => {
    });


    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        const url: string = decodeURI(this.router.url);

        if (url.indexOf(URL_PATH_ROOM) >= 0) {
          const substringPath: string = url.substring(url.indexOf(URL_PATH_ROOM), url.length);
          const replaceURL: string = substringPath.replace(URL_PATH_ROOM, '');
          const replaceCommentURL: string = replaceURL.replace("/comment/post", '');
          const splitText = replaceCommentURL.split('/');
          const splitIdText = splitText[1].split('-');

          let topicId: string = '';
          if (splitIdText.length > 0) {
            // [0] must be id
            const splitRoomNameText = splitText[0].split('-');
            topicId = splitIdText[0];
            this.roomIdName = splitText[0];
            this.roomName = splitRoomNameText[1];
            const splitProposalIdName = splitText[1].split('-');
            const splitProposalName = splitProposalIdName[1].split('?');
            this.proposalIdName = splitText[1];
            this.proposalName = splitProposalName[0];
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
        } else if (url.indexOf(URL_PATH) >= 0) {
          const substringPath: string = url.substring(url.indexOf(URL_PATH), url.length);
          const replaceURL: string = substringPath.replace(URL_PATH, '');
          const splitText = replaceURL.split('-');
          const splitProposalName = splitText[1].split('?');
          this.proposalName = splitProposalName[0];
          this.proposalIdName = replaceURL;
          let topicId: string = '';
          if (splitText.length > 0) {
            // [0] must be id
            topicId = splitText[0];
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

    // subscribe observ when authen check
    this.observManager.subscribe('authen.check', () => {
      this.reloadProposalComment();
      if (this.getCurrentUser() !== undefined) {
        this.reloadProposalSupport();
      }
    });
  }

  public ngOnInit() {
    super.ngOnInit();
    this.comment = sessionStorage.getItem("proposal_" + this.proposalId + "_comment");
    this.shareLinkToFacebook();
  }

  public shareLinkToFacebook(): any {
    this.linkUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href);
  }

  private initProposal(proposalId: string): void {
    this.proposalId = proposalId;
    this.proposal = {};
    this.proposalcomments = [];

    let userId = this.getCurrentUserId();

    this.proposalFacade.find(this.proposalId, userId).then((result: any) => {
      this.proposal = result;
      this.pageUserInfo.addPageUser(this.proposal.pageUser);

      this.actionLogFacade.createActionLog(this.proposalId, 'proposal'); // add log
    }).catch((error: any) => {
      this.router.navigateByUrl("/main/proposal");
      // console.log(error);
    });
  }

  private initPage(proposalId: string): void {
    this.initProposal(proposalId);
    this.reloadProposalComment();
    if (this.getCurrentUser() !== undefined) {
      this.reloadProposalSupport();
    }
  }

  private isShowAction(itemUserId: string): boolean {
    const userId = this.getCurrentUserId() + "";

    return userId === itemUserId + "";
  }

  private reloadProposalComment(): void {
    this.proposalcomments = [];

    let filter = new SearchFilter();


    this.cacheConfigInfo.getConfig(PROPOSAL_COMMENT_APPROVE).then((config: any) => {
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


        let userId = this.getCurrentUserId();

        this.proposalCommentFacade.search(this.proposalId, filter, true, userId).then((result: any) => {
          this.proposalcomments = result;
          if (result && result.length < 10) {
            this.isShowLoadMore = false;
          }
          for (let index = 0; index < this.proposalcomments.length; index++) {
            if (this.proposalcomments[index].pageUser) {
              this.pageUserInfo.addPageUser(this.proposalcomments[index].pageUser);
            }
          }
        }).catch((error: any) => {
          // console.log(error);
        });

      }
    }).catch((error: any) => {
    });
  }

  private reloadProposalSupport(): void {
    this.proposalFacade.getCurrentUserSupportProposal(this.proposalId).then(() => {
      this.isUserPPSupport = true;
    }).catch(() => {
      this.isUserPPSupport = false;
    });
  }

  private updateCommentLike(commnetData: any, index: number, isLike: boolean) {
    if (index === undefined) {
      return;
    }

    if (this.proposalcomments && index < this.proposalcomments.length) {
      this.proposalcomments[index].isUserLike = isLike;
      this.proposalcomments[index].likeCount = commnetData.likeCount;
      this.proposalcomments[index].dislikeCount = commnetData.dislikeCount;
    }
  }

  private updateComment(commentData: any, index: number) {
    if (index === undefined) {
      return;
    }

    if (this.proposalcomments && index < this.proposalcomments.length) {
      this.proposalcomments[index].comment = commentData.comment;
    }
  }

  private removeComment(index: number) {
    if (index === undefined) {
      return;
    }

    if (this.proposalcomments && index < this.proposalcomments.length) {
      this.proposalcomments.splice(index, 1);
    }
  }

  private updateProposalLike(proposal: any): void {
    if (proposal === null || proposal === undefined) {
      return;
    }

    if (this.proposal !== undefined) {
      this.proposal.likeCount = proposal.likeCount;
      this.proposal.dislikeCount = proposal.dislikeCount;
    }
  }

  public getTopicHeaderLabel(): string {
    if (this.mode === 'hot') {
      return "ข้อเสนอยอดนิยม";
    } else if (this.mode === 'suggest') {
      return "ข้อเสนอแนะนำ";
    }

    return "ข้อเสนอทั้งหมด";
  }

  public onSubmitClicked(): void {
    if (this.isSending) {
      return;
    }

    if (!this.isLogin()) {
      this.showAlertLoginDialog(this.roomIdName ? "/main/proposal/room/" + this.roomIdName + "comment/post/" + this.proposalIdName : "/main/proposal/comment/post/" + this.proposalIdName);
      return;
    }

    if (this.proposal !== undefined && this.proposal !== null) {
      if (this.proposal.approveUserId === undefined || this.proposal.approveUserId === null) {
        this.showAlertDialog('ข้อเสนอยังไม่ถูกอนุมัติโดยผู้ดูแลระบบ');
        return;
      }
    }

    if (this.proposalId === undefined || this.proposalId === null || this.proposalId === '') {
      this.showAlertDialog('ไม่พบรหัสข้อเสนอ กรุณารีเฟรชหน้าใหม่');
      return;
    }

    if (this.comment === undefined || this.comment === null || this.comment === '') {
      this.showAlertDialog('กรุณาใส่ Comment');
      return;
    }

    let comment = new ProposalComment();

    // filter
    this.comment = BadWordUtils.clean(this.comment);

    comment.comment = this.comment;
    this.isSending = true;

    this.proposalCommentFacade.create(this.proposalId, comment).then((res) => {
      this.comment = '';
      this.isSending = false;
      if (this.proposalcomments.length < 10) {
        this.reloadProposalComment();
      }
      sessionStorage.removeItem("proposal_" + this.proposalId + "_comment");
      this.showAlertDialog('ความคิดเห็นของคุณจะถูกแสดงเมื่อ Admin อนุมัติ');
    }).catch((error) => {
      this.isSending = false;
      sessionStorage.setItem("proposal_" + this.proposalId + "_comment", this.comment);
      this.showDialogError(error.error.name, this.router.url);
    });
  }

  public onCommentLikeBtnClicked(commentlId: string, index: number): void {
    if (!this.isLogin()) {
      this.showAlertLoginDialog(this.roomIdName ? "/main/proposal/room/" + this.roomIdName + "comment/post/" + this.proposalIdName : "/main/proposal/comment/post/" + this.proposalIdName);
      return;
    }

    if (this.proposal !== undefined && this.proposal !== null) {
      if (this.proposal.approveUserId === undefined || this.proposal.approveUserId === null || this.proposal.approveUserId === '') {
        this.showAlertDialog('ข้อเสนอยังไม่ถูกอนุมัติโดยผู้ดูแลระบบ');
        return;
      }
    }

    if (this.proposalId === undefined || this.proposalId === null || this.proposalId === '') {
      this.showAlertDialog('ไม่พบรหัสข้อเสนอ กรุณารีเฟรชหน้าใหม่');
      return;
    }

    this.proposalCommentFacade.like(this.proposalId, commentlId, true).then((result: any) => {
      // update comment
      this.updateCommentLike(result, index, this.proposalcomments[index].isUserLike === true ? undefined : true);
    }).catch((error) => {
      this.showAlertDialog('error: ' + JSON.stringify(error.error.name));
    });
  }

  public onCommentDislikeBtnClicked(commentlId: string, index: number): void {
    if (!this.isLogin()) {
      this.showAlertLoginDialog(this.roomIdName ? "/main/proposal/room/" + this.roomIdName + "comment/post/" + this.proposalIdName : "/main/proposal/comment/post/" + this.proposalIdName);
      return;
    }

    if (this.proposal !== undefined && this.proposal !== null) {
      if (this.proposal.approveUserId === undefined || this.proposal.approveUserId === null || this.proposal.approveUserId === '') {
        this.showAlertDialog('ข้อเสนอยังไม่ถูกอนุมัติโดยผู้ดูแลระบบ');
        return;
      }
    }

    if (this.proposalId === undefined || this.proposalId === null || this.proposalId === '') {
      this.showAlertDialog('ไม่พบรหัสข้อเสนอ กรุณารีเฟรชหน้าใหม่');
      return;
    }

    this.proposalCommentFacade.like(this.proposalId, commentlId, false).then((result: any) => {
      // update comment
      this.updateCommentLike(result, index, this.proposalcomments[index].isUserLike === false ? undefined : false);
    }).catch((error) => {
      this.showDialogError(error.error.name, this.router.url);
    });
  }

  public onSupportBtnClicked(): void {
    if (!this.isLogin()) {
      this.showAlertLoginDialog(this.roomIdName ? "/main/proposal/room/" + this.roomIdName + "comment/post/" + this.proposalIdName : "/main/proposal/comment/post/" + this.proposalIdName);
      return;
    }

    if (this.proposalId === undefined || this.proposalId === null || this.proposalId === '') {
      this.showAlertDialog('ไม่พบรหัสข้อเสนอ กรุณารีเฟรชหน้าใหม่');
      return;
    }

    if (this.proposal !== undefined && this.proposal !== null) {
      if (this.proposal.approveUserId === undefined || this.proposal.approveUserId === null) {
        this.showAlertDialog('ข้อเสนอยังไม่ถูกอนุมัติโดยผู้ดูแลระบบ');
        return;
      }
    }

    this.proposalFacade.supportProposal(this.proposalId).then((result: any) => {
      // update proposal
      this.proposal.supporterCount = result.supporterCount;
      this.isUserPPSupport = !this.isUserPPSupport;
    }).catch((error) => {
      this.showDialogError(error.error.name, this.router.url);
    });
  }

  public isProposalApprove(): boolean {
    if (this.proposal === undefined || this.proposal === null) {
      return false;
    }

    if (this.proposal.approveUserId === undefined || this.proposal.approveUserId === null) {
      return false;
    }
    return true;
  }

  public showEditCommentDialog(data: any, index: number): void {
    const confirmEventEmitter = new EventEmitter<any>();
    confirmEventEmitter.subscribe((result: any) => {
      const cloneData = JSON.parse(JSON.stringify(data));
      cloneData.comment = result.text;

      this.proposalCommentFacade.edit(this.proposalId, data.id, cloneData).then((result: any) => {
        // update comments
        this.updateComment(result, index);
      }).catch((error: any) => {
        this.showDialogError(error.error.name, this.router.url);
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
      this.proposalCommentFacade.delete(this.proposalId, commentId).then((result: any) => {
        this.removeComment(index);
      }).catch((error: any) => {
        this.showDialogError(error.error.name, this.router.url);
      });
    });

    this.showDialogWithOptions({
      text: MESSAGE.TEXT_DELETE_CONTENT,
      bottomText1: MESSAGE.TEXT_BUTTON_CANCEL,
      bottomText2: MESSAGE.TEXT_BUTTON_CONFIRM,
      bottomColorText2: "black",
      confirmClickedEvent: confirmEventEmitter,
    }
    );
  }

  public loadNextAllComment(): void {
    if (this.proposalId === undefined) {
      return;
    }

    this.isLoadingMore = true;
    this.currentOffset = this.currentOffset + SEARCH_LIMIT;

    if (this.proposalcomments === undefined) {
      this.proposalcomments = [];
    }

    let filter = new SearchFilter();
    filter.limit = SEARCH_LIMIT;
    filter.offset = this.currentOffset;
    filter.orderBy = {
      "id": "ASC"
    };

    let userId = this.getCurrentUserId();

    this.proposalCommentFacade.search(this.proposalId, filter, true, userId).then((result: any) => {
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
          this.proposalcomments = this.proposalcomments.concat(result.filter((item) => this.proposalcomments.indexOf(item) < 0));
        } else {
          this.isShowLoadMore = false;
        }
      }, 250);
    }).catch((error: any) => {
      this.showDialogError(error.error.name, this.router.url);
    });

  }

  public likeBtnClicked(): void {
    if (this.proposalId === undefined || this.proposalId === null) {
      return;
    }

    if (!this.isLogin()) {
      this.showAlertLoginDialog(this.roomIdName ? "/main/proposal/room/" + this.roomIdName + "comment/post/" + this.proposalIdName : "/main/proposal/comment/post/" + this.proposalIdName);
      return;
    }

    if (this.proposal !== undefined && this.proposal !== null) {
      if (this.proposal.approveUserId === undefined || this.proposal.approveUserId === null || this.proposal.approveUserId === '') {
        this.showAlertDialog('ข้อเสนอยังไม่ถูกอนุมัติโดยผู้ดูแลระบบ');
        return;
      }
    }

    this.proposalFacade.likeProposal(this.proposalId, true).then((result: any) => {
      this.updateProposalLike(result);
      if (this.proposal.isUserLike) {
        this.proposal.isUserLike = undefined;
      } else {
        this.proposal.isUserLike = true;
      }
    }).catch((error: any) => {
      this.showDialogError(error.error.name, this.router.url);
    });
  }

  public dislikeBtnClicked(): void {
    if (this.proposalId === undefined || this.proposalId === null) {
      return;
    }

    if (!this.isLogin()) {
      this.showAlertLoginDialog(this.roomIdName ? "/main/proposal/room/" + this.roomIdName + "comment/post/" + this.proposalIdName : "/main/proposal/comment/post/" + this.proposalIdName);
      return;
    }

    if (this.proposal !== undefined && this.proposal !== null) {
      if (this.proposal.approveUserId === undefined || this.proposal.approveUserId === null || this.proposal.approveUserId === '') {
        this.showAlertDialog('ข้อเสนอยังไม่ถูกอนุมัติโดยผู้ดูแลระบบ');
        return;
      }
    }

    this.proposalFacade.likeProposal(this.proposalId, false).then((result: any) => {
      this.updateProposalLike(result);
      if (this.proposal.isUserLike === false) {
        this.proposal.isUserLike = undefined;
      } else {
        this.proposal.isUserLike = false;
      }
    }).catch((error: any) => {
      this.showDialogError(error.error.name, this.router.url);
    });
  }


}
