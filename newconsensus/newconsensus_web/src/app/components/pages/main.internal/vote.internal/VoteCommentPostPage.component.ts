import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AbstractPage } from '../../AbstractPage';
import { AuthenManager, PageUserInfo } from '../../../../services/services';
import { VoteFacade } from '../../../../services/facade/VoteFacade.service';
import { VoteCommentFacade } from '../../../../services/facade/VoteCommentFacade.service';
import { ObservableManager } from '../../../../services/ObservableManager.service';
import { SearchFilter, VoteComment } from '../../../../models/models';
import { MatDialog } from '@angular/material/dialog';
import { MESSAGE } from '../../../../AlertMessage';
import { VideoForm } from '../../../shares/VideoView.component';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ActionLogFacade } from '../../../../services/facade/ActionLogFacade.service';
import { CacheConfigInfo } from '../../../../services/CacheConfigInfo.service';
import { VOTE_COMMENT_APPROVE } from '../../../../Constants';

const PAGE_NAME: string = 'comment';
const URL_PATH: string = '/main/vote/comment/'; 
const VOTE_NOT_FOUND_MSG = 'ไม่พบรหัสโหวตรัฐธรรมนูญ กรุณารีเฟรชหน้าใหม่';
const VOTE_COMMENT_NOT_FOUND_MSG = 'ไม่พบรหัสความคิดเห็น กรุณารีเฟรชหน้าใหม่';
const VOTE_COMMENT_REQUIRE_MSG = 'กรุณาใส่ Comment';

@Component({
  selector: 'newcon-vote-comment-post-page',
  templateUrl: './VoteCommentPostPage.component.html',
})
export class VoteCommentPostPage extends AbstractPage implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME; 
  private voteFacade: VoteFacade;
  private voteCommentFacade: VoteCommentFacade;

  public vote: any;
  public agreeVoteComments: any[];
  public disAgreeVoteComments: any[];
  public noVoteComments: any[];
  public videoForm: VideoForm;
  public linkUrl: string;
  public Editor = ClassicEditor;
  private agreeVoteComment: string;
  private disAgreeVoteComment: string;
  private noVoteComment: string; 
  private voteId: string;
  private voteCommentId: string; 
  private userVoteComment: any;
  private observManager: ObservableManager;
  private pageUserInfo: PageUserInfo;
  private actionLogFacade: ActionLogFacade;
  private cacheConfigInfo: CacheConfigInfo;

  public voteIdName: string;
  public isVoteingAree: boolean;
  public isVoteingDisaree: boolean;
  public isVoteingNocomment: boolean;
  public isCommentApprove: boolean;

  // constructor() {
  constructor(authenManager: AuthenManager, observManager: ObservableManager, router: Router,
    voteFacade: VoteFacade, voteCommentFacade: VoteCommentFacade, cacheConfigInfo: CacheConfigInfo, dialog: MatDialog, pageUserInfo: PageUserInfo, actionLogFacade: ActionLogFacade) {
    super(PAGE_NAME, authenManager, dialog, router);
    this.router = router;
    this.observManager = observManager;
    this.pageUserInfo = pageUserInfo;
    this.voteFacade = voteFacade;
    this.voteCommentFacade = voteCommentFacade;
    this.vote = {};
    this.agreeVoteComments = [];
    this.disAgreeVoteComments = [];
    this.noVoteComments = [];
    this.dialog = dialog;
    this.isVoteingAree = false;
    this.isVoteingDisaree = false;
    this.isVoteingNocomment = false;
    this.actionLogFacade = actionLogFacade;
    this.cacheConfigInfo = cacheConfigInfo;
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        const url: string = this.router.url;

        if (url.indexOf(URL_PATH) >= 0) {
          const replaceURL: string = url.replace(URL_PATH, '');
          const splitText = replaceURL.split('-');

          let voteId: string = '';
          if (splitText.length > 0) {
            // [0] must be id
            voteId = splitText[0];
            this.voteIdName = replaceURL;
          } else {
            voteId = replaceURL;
          }

          let regEx = /^\d+$/;
          if (!voteId.match(regEx)) {
            voteId = undefined;
          }

          if (voteId) {
            this.initPage(voteId);
          }
        }
      }
    });

    this.cacheConfigInfo.getConfig(VOTE_COMMENT_APPROVE).then((config: any) => {
      if (config.value !== undefined) {
        this.isCommentApprove = (config.value.toLowerCase() === 'true');
      }
    }).catch((error: any) => {
    });

    // subscribe observ when authen check
    this.observManager.subscribe('authen.check', (data: any) => {
      this.updateUserVoteComment();
    });
    this.videoForm = {
      width: "",
      height: "",
      class: "newcon-content-post-page-layout-video",
    }
  }

  ngOnInit() {
    super.ngOnInit();
    this.shareLinkToFacebook();
  }

  private initPage(voteId: string): void {
    this.voteId = voteId;
    this.vote = {};
    this.agreeVoteComments = [];
    this.disAgreeVoteComments = [];
    this.noVoteComments = [];

    this.updateUserVoteComment();
    this.reloadVoteComment();
  }

  private updateUserVoteComment(): Promise<any> {
    if (!this.isLogin()) {
      return Promise.resolve(false);
    }

    if (this.voteId === undefined) {
      return Promise.resolve(false);
    }

    return new Promise((resolve, reject) => {
      // let dateStmt: string = 'approve_user_id is null';
      let filter: SearchFilter = new SearchFilter();
      filter.whereConditions = [
        {
          voteId: this.voteId,
          createdBy: this.getCurrentUserId()
        }
      ];

      this.voteCommentFacade.search(this.voteId, filter, true).then((result: any) => {

        if (result !== undefined && result.length > 0) {
          this.userVoteComment = result[0];
        }

        resolve(true);
      }).catch(() => {
        this.userVoteComment = undefined;
        resolve(false);
      });
    });
  }
  public btnlikeVote(): void {
    if (this.voteId === undefined || this.voteId === null) {
      return;
    }
    if (!this.isLogin()) {
      this.showAlertLoginDialog("/main/vote/comment/post/"+this.voteIdName);
      return;
    }
    this.voteFacade.likeVote(this.voteId, 'true').then((result: any) => {
      this.updateVoteLike(result);
      if (this.vote.isUserLike) {
        this.vote.isUserLike = undefined;
      } else {
        this.vote.isUserLike = true;
      }
    }).catch((error: any) => {
      this.showAlertDialog('error: ' + JSON.stringify(error.error.name));
    });

    document.getElementById('textarea').innerHTML = '';
  }
  public btnDislikeVote(): void {
    if (this.voteId === undefined || this.voteId === null) {
      return;
    }
    if (!this.isLogin()) {
      this.showAlertLoginDialog("/main/vote/comment/post/"+this.voteIdName);
      return;
    }
    this.voteFacade.likeVote(this.voteId, 'false').then((result: any) => {
      this.updateVoteLike(result);
      if (this.vote.isUserLike === false) {
        this.vote.isUserLike = undefined;
      } else {
        this.vote.isUserLike = false;
      }
    }).catch((error: any) => {
      this.showAlertDialog('error: ' + JSON.stringify(error.error.name));
    });
  }

  private updateVoteLike(vote: any): void {
    if (vote === null || vote === undefined) {
      return;
    }

    if (this.vote !== undefined) {
      this.vote.vote.likeCount = vote.likeCount;
      this.vote.vote.dislikeCount = vote.dislikeCount;
    }
  }

  private reloadPercent(): void {
    let agreeCount = this.agreeVoteComments.length;
    let disagreeCount = this.disAgreeVoteComments.length;
    let noCommentCount = this.noVoteComments.length;
    let totalCount = agreeCount + disagreeCount + noCommentCount;

    this.vote.voteComment.agree.percent = totalCount === 0 ? 0 : (agreeCount / totalCount) * 100;
    this.vote.voteComment.disagree.percent = totalCount === 0 ? 0 : (disagreeCount / totalCount) * 100;
    this.vote.voteComment.noComment.percent = totalCount === 0 ? 0 : (noCommentCount / totalCount) * 100;
  }

  private createVoteComment(comment: string, value: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.updateUserVoteComment().then((result) => {
        if (result) {
          let voteComments = new VoteComment();
          voteComments.comment = comment;
          voteComments.value = value + '';
          voteComments.likeCount = 0;
          voteComments.dislikeCount = 0;

          if (this.userVoteComment !== undefined) {
            this.voteCommentFacade.update(this.voteId, this.userVoteComment.id, voteComments).then((updateRes) => {
              resolve(updateRes);
            }).catch((error: any) => {
              reject(error);
            });
          } else {
            this.voteCommentFacade.create(this.voteId, voteComments).then((createRes: any) => {
              resolve(createRes);
            }).catch((error: any) => {
              reject(error);
            });
          }
        } else {
          resolve(undefined);
        }
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  private removeVoteCommentFromArray(voteValue: number, voteComment: any): void {
    if (voteValue === 1) {
      // agree
      let index = this.agreeVoteComments.map(function (el) {
        return el.id;
      }).indexOf(voteComment.id);

      if (index >= 0) {
        this.agreeVoteComments.splice(index, 1);
      }
    } else if (voteValue === -1) {
      // disagree
      let index = this.disAgreeVoteComments.map(function (el) {
        return el.id;
      }).indexOf(voteComment.id);

      if (index >= 0) {
        this.disAgreeVoteComments.splice(index, 1);
      }
    } else {
      // no comment
      let index = this.noVoteComments.map(function (el) {
        return el.id;
      }).indexOf(voteComment.id);

      if (index >= 0) {
        this.noVoteComments.splice(index, 1);
      }
    }
  }

  private createAgreeVoteComment(): void {
    if (!this.isLogin()) {
      return;
    }

    if (this.voteId === undefined || this.voteId === null || this.voteId === '') {
      this.showAlertDialog(VOTE_NOT_FOUND_MSG);
      return;
    }

    if (this.agreeVoteComment === undefined || this.agreeVoteComment === null || this.agreeVoteComment === '' || this.agreeVoteComment.trim().length <= 0) {
      this.showAlertDialog(VOTE_COMMENT_REQUIRE_MSG);
      return;
    }

    this.isVoteingAree = true;
    this.createVoteComment(this.agreeVoteComment.trim(), 1).then((result: any) => {
      this.isVoteingAree = false;
      if (result !== undefined) {
        this.agreeVoteComment = '';

        if (this.userVoteComment !== undefined) {
          // this is edit mode remove old
          this.removeVoteCommentFromArray(this.userVoteComment.value, result);
        }
        this.pageUserInfo.addPageUser(result.pageUser);
      }

      this.agreeVoteComment = '';
      this.disAgreeVoteComment = '';
      this.noVoteComment = '';
      this.showAlertDialog('ความคิดเห็นของคุณจะถูกแสดงเมื่อ Admin อนุมัติ');
    }).catch((error: any) => {
      this.isVoteingAree = false;
      this.showAlertDialog('error: ' + JSON.stringify(error.error.name));
    });
  }

  private createDisAgreeVoteComment(): void {
    if (!this.isLogin()) {
      return;
    }

    if (this.voteId === undefined || this.voteId === null || this.voteId === '') {
      this.showAlertDialog(VOTE_NOT_FOUND_MSG);
      return;
    }

    if (this.disAgreeVoteComment === undefined || this.disAgreeVoteComment === null || this.disAgreeVoteComment === '' || this.disAgreeVoteComment.trim().length <= 0) {
      this.showAlertDialog(VOTE_COMMENT_REQUIRE_MSG);
      return;
    }

    this.isVoteingDisaree = true;

    this.createVoteComment(this.disAgreeVoteComment.trim(), -1).then((result: any) => {
      this.isVoteingDisaree = false;
      if (result !== undefined) {
        this.disAgreeVoteComment = '';

        if (this.userVoteComment !== undefined) {
          // this is edit mode remove old
          this.removeVoteCommentFromArray(this.userVoteComment.value, result);
        }
        this.pageUserInfo.addPageUser(result.pageUser);
      }

      this.agreeVoteComment = '';
      this.disAgreeVoteComment = '';
      this.noVoteComment = '';
      this.showAlertDialog('ความคิดเห็นของคุณจะถูกแสดงเมื่อ Admin อนุมัติ');
    }).catch((error: any) => {
      this.isVoteingDisaree = false;
      this.showAlertDialog('error: ' + JSON.stringify(error.error.name));
    });
  }

  private createNoVoteComment(): void {
    if (!this.isLogin()) {
      return;
    }

    if (this.voteId === undefined || this.voteId === null || this.voteId === '') {
      this.showAlertDialog(VOTE_NOT_FOUND_MSG);
      return;
    }

    if (this.noVoteComment === undefined || this.noVoteComment === null || this.noVoteComment === '' || this.noVoteComment.trim().length <= 0) {
      this.showAlertDialog(VOTE_COMMENT_REQUIRE_MSG);
      return;
    }

    this.isVoteingNocomment = true;
    this.createVoteComment(this.noVoteComment.trim(), 0).then((result: any) => {
      this.isVoteingNocomment = false;
      if (result !== undefined) {
        this.noVoteComment = '';

        if (this.userVoteComment !== undefined) {
          // this is edit mode remove old
          this.removeVoteCommentFromArray(this.userVoteComment.value, result);
        }
        this.pageUserInfo.addPageUser(result.pageUser);
      }

      this.agreeVoteComment = '';
      this.disAgreeVoteComment = '';
      this.noVoteComment = '';
      this.showAlertDialog('ความคิดเห็นของคุณจะถูกแสดงเมื่อ Admin อนุมัติ');
    }).catch((error: any) => {
      this.isVoteingNocomment = false;
      this.showAlertDialog('error: ' + JSON.stringify(error.error.name));
    });
  }

  public likeVoteComment(voteCommentId: string, index: number, status: number): void {
    if (!this.isLogin()) {
      this.showAlertLoginDialog("/main/vote/comment/post/"+this.voteIdName);
      return;
    }

    this.voteCommentId = voteCommentId;

    if (this.voteId === undefined || this.voteId === null || this.voteId === '') {
      this.showAlertDialog(VOTE_NOT_FOUND_MSG);
      return;
    }

    if (this.voteCommentId === undefined || this.voteCommentId === null || this.voteCommentId === '') {
      this.showAlertDialog(VOTE_COMMENT_NOT_FOUND_MSG);
      return;
    }

    this.voteCommentFacade.like(this.voteCommentId, this.voteId, 'true').then((result: any) => {
      this.updateVoteCommentLike(result, index, status);
      if (status === 1) {
        if (this.agreeVoteComments[index].isUserLike) {
          this.agreeVoteComments[index].isUserLike = undefined;
        } else {
          this.agreeVoteComments[index].isUserLike = true;
        }
      } else if (status === -1) {
        if (this.disAgreeVoteComments[index].isUserLike) {
          this.disAgreeVoteComments[index].isUserLike = undefined;
        } else {
          this.disAgreeVoteComments[index].isUserLike = true;
        }
      } else if (status === 0) {
        if (this.noVoteComments[index].isUserLike) {
          this.noVoteComments[index].isUserLike = undefined;
        } else {
          this.noVoteComments[index].isUserLike = true;
        }
      }
    }).catch((error: any) => {
      this.showAlertDialog('error: ' + JSON.stringify(error.error.name));
    });
  }

  public dislikeVoteComment(voteCommentId: string, index: number, status: number): void {
    if (!this.isLogin()) {
      this.showAlertLoginDialog("/main/vote/comment/post/"+this.voteIdName);
      return;
    }

    this.voteCommentId = voteCommentId;

    if (this.voteId === undefined || this.voteId === null || this.voteId === '') {
      this.showAlertDialog(VOTE_NOT_FOUND_MSG);
      return;
    }

    if (this.voteCommentId === undefined || this.voteCommentId === null || this.voteCommentId === '') {
      this.showAlertDialog(VOTE_COMMENT_NOT_FOUND_MSG);
      return;
    }

    this.voteCommentFacade.like(this.voteCommentId, this.voteId, 'false').then((result: any) => {
      this.updateVoteCommentLike(result, index, status);
      if (status === 1) {
        if (this.agreeVoteComments[index].isUserLike === false) {
          this.agreeVoteComments[index].isUserLike = undefined;
        } else {
          this.agreeVoteComments[index].isUserLike = false;
        }
      } else if (status === -1) {
        if (this.disAgreeVoteComments[index].isUserLike === false) {
          this.disAgreeVoteComments[index].isUserLike = undefined;
        } else {
          this.disAgreeVoteComments[index].isUserLike = false;
        }
      } else if (status === 0) {
        if (this.noVoteComments[index].isUserLike === false) {
          this.noVoteComments[index].isUserLike = undefined;
        } else {
          this.noVoteComments[index].isUserLike = false;
        }
      }
    }).catch((error: any) => {
      this.showAlertDialog('error: ' + JSON.stringify(error.error.name));
    });
  }

  public deleteVoteComment(voteCommentId: string, index: number, value: number): void {
    if (this.voteId === undefined || this.voteId === null || this.voteId === '') {
      this.showAlertDialog(VOTE_NOT_FOUND_MSG);
      return;
    }

    if (voteCommentId === undefined || voteCommentId === null || voteCommentId === '') {
      this.showAlertDialog(VOTE_COMMENT_NOT_FOUND_MSG);
      return;
    }

    const confirmEventEmitter = new EventEmitter<any>();
    confirmEventEmitter.subscribe(() => {
      this.voteCommentFacade.delete(this.voteId, voteCommentId).then((result: any) => {
        this.removeVoteCommentFromArray(value, { id: voteCommentId });
        this.userVoteComment = undefined;
        this.reloadPercent();
      }).catch((error: any) => {
        this.showAlertDialog('error: ' + JSON.stringify(error.error.name));
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

  public reloadVoteComment(): void {
    this.agreeVoteComments = [];
    this.disAgreeVoteComments = [];
    this.noVoteComments = [];

    let userId = this.getCurrentUserId();

    this.voteFacade.find(this.voteId, userId).then((result: any) => {
      this.vote = result;

      if (this.vote !== undefined) {
        if (this.vote.voteComment.agree.voteComments !== undefined && this.vote.voteComment.agree.voteComments.length > 0) {
          this.agreeVoteComments = this.agreeVoteComments.concat(this.vote.voteComment.agree.voteComments.map((item) => {
            return item;
          }));
        }
        if (this.vote.voteComment.disagree.voteComments !== undefined && this.vote.voteComment.disagree.voteComments.length > 0) {
          this.disAgreeVoteComments = this.disAgreeVoteComments.concat(this.vote.voteComment.disagree.voteComments.map((item) => {
            return item;
          }));
        }
        if (this.vote.voteComment.noComment.voteComments !== undefined && this.vote.voteComment.noComment.voteComments.length > 0) {
          this.noVoteComments = this.noVoteComments.concat(this.vote.voteComment.noComment.voteComments.map((item) => {
            return item;
          }));
        }
      }

      this.actionLogFacade.createActionLog(this.voteId, 'vote'); // add log

    }).catch((error: any) => {
      // console.log(error);
      this.router.navigateByUrl("/main/vote");
    });
  }
  public shareLinkToFacebook(): any {
    this.linkUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href);
  }

  private updateVoteCommentLike(commentData: any, index: number, status: number) {
    if (index === undefined) {
      return;
    }

    if (this.agreeVoteComments[index] && index < this.agreeVoteComments.length && status === 1) {
      this.agreeVoteComments[index].likeCount = commentData.likeCount;
      this.agreeVoteComments[index].dislikeCount = commentData.dislikeCount;
    } else if (this.disAgreeVoteComments[index] && index < this.disAgreeVoteComments.length && status === -1) {
      this.disAgreeVoteComments[index].likeCount = commentData.likeCount;
      this.disAgreeVoteComments[index].dislikeCount = commentData.dislikeCount;
    } else if (this.noVoteComments[index] && index < this.noVoteComments.length && status === 0) {
      this.noVoteComments[index].likeCount = commentData.likeCount;
      this.noVoteComments[index].dislikeCount = commentData.dislikeCount;
    }
  }
}
