/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import { Component, OnInit, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthenManager, ObservableManager, VoteCommentFacade, CacheConfigInfo } from '../../../../services/services';
import { SearchFilter, VoteComment } from '../../../../models/models';
import { AbstractPage } from '../../AbstractPage';
import { MESSAGE } from '../../../../AlertMessage';
import { DialogEditComment } from '../../../shares/dialog/dialog';
import { Router } from '@angular/router';
import { VOTE_MENU_ENABLE } from '../../../../Constants';

const PAGE_NAME: string = 'votecommentuser';
const SEARCH_LIMIT: number = 50;
const PAGE_SIZE: number = 5;
const PAGESIZE_OPTIONS: number[] = [5];

@Component({
  selector: 'newcon-vote-comment-user-page',
  templateUrl: './VoteCommentUserPage.component.html',
})
export class VoteCommentUserPage extends AbstractPage implements OnInit {

  private observManager: ObservableManager;
  private voteCommentFacade: VoteCommentFacade;
  private cacheConfigInfo: CacheConfigInfo;

  public static readonly PAGE_NAME: string = PAGE_NAME;
  public pageSizeOptions: number[] = PAGESIZE_OPTIONS;
  public pageSize: number = PAGE_SIZE;
  public resVoteComment: any;
  public isLoadingVote: boolean;
  public isShowVote: boolean;

  constructor(authenManager: AuthenManager, router: Router, observManager: ObservableManager, voteCommentFacade: VoteCommentFacade,
    dialog: MatDialog, cacheConfigInfo: CacheConfigInfo) {
    super(PAGE_NAME, authenManager, dialog, router);

    this.authenManager = authenManager;
    this.observManager = observManager;
    this.voteCommentFacade = voteCommentFacade;
    this.cacheConfigInfo = cacheConfigInfo;
    this.resVoteComment = [];
    this.isShowVote = false;

    this.observManager.subscribe('authen.check', (data: any) => {
      this.searchVoteComment();
    });
    this.checkAccountStatus().then((res)=>{
      if(!res){
        this.observManager.publish("authen.logout", true);
      }
    });

    this.cacheConfigInfo.getConfig(VOTE_MENU_ENABLE).then((config: any) => {
      if (config.value !== undefined) {
        this.isShowVote = (config.value.toLowerCase() === 'true');
        if (!this.isShowVote) {
          this.router.navigateByUrl("/main");
        }
      }
    }).catch((error: any) => {
      // console.log(error)
    });
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.searchVoteComment();
  }

  private stopLoading(): void {
    setTimeout(() => {
      this.isLoadingVote = false;
    }, 500);
  }

  private removeComment(data: any) {
    if (data === undefined) {
      return;
    }

    if (this.resVoteComment && this.resVoteComment.length > 0) {
      let index = this.resVoteComment.map((item: any) => {
        return item.voteId + ':' + item.id;
      }).indexOf(data.voteId + ':' + data.id);

      if (index < this.resVoteComment.length) {
        this.resVoteComment.splice(index, 1);
      }
    }
  }

  private updateComment(data: any) {
    if (data === undefined) {
      return;
    }

    if (this.resVoteComment && this.resVoteComment.length > 0) {
      let index = this.resVoteComment.map((item: any) => {
        return item.voteId + ':' + item.id;
      }).indexOf(data.voteId + ':' + data.id);

      if (index < this.resVoteComment.length) {
        this.resVoteComment[index].comment = data.comment;
      }
    }
  }

  public searchVoteComment(): void {
    let user = this.authenManager.getCurrentUser();
    if (user != null && user != undefined) {
      let userId = user.id;
      let filter = new SearchFilter();
      filter.limit = SEARCH_LIMIT;
      filter.offset = this.resVoteComment.length;
      filter.whereConditions = [{
        'createdBy': userId
      }];
      filter.orderBy = {
        'createdDate': 'DESC'
      };
      filter.count = false;
      this.isLoadingVote = true;

      this.voteCommentFacade.searchUserVoteComment(filter, true).then((res: any) => {
        for (let voteComment of res) {

          this.resVoteComment.push(voteComment);
        }
        this.stopLoading();
      }).catch((error: any) => {
        this.stopLoading();
        // console.log('error :> ', error.error.message);
      })
    }
  }

  public deleteCardVoteComment(data: any) {
    const confirmEventEmitter = new EventEmitter<any>();
    confirmEventEmitter.subscribe(() => {
      this.isLoadingVote = true;
      this.voteCommentFacade.delete(data.voteId, data.id).then((result: any) => {
        this.removeComment(data);
        this.stopLoading();
      }).catch((error: any) => {
        this.showAlertDialog('Error : ' + JSON.stringify(error));
        this.stopLoading();
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

  public editCardVoteComment(data: any) {
    const confirmEventEmitter = new EventEmitter<any>();
    confirmEventEmitter.subscribe((result: any) => {

      let voteComments = new VoteComment();
      voteComments.comment = result.text;
      voteComments.value = data.value + '';
      voteComments.likeCount = data.likeCount;
      voteComments.dislikeCount = data.dislikeCount;

      this.isLoadingVote = true;
      this.voteCommentFacade.update(data.voteId, data.id, voteComments).then((result: any) => {
        // update comments
        this.updateComment(result);
        this.stopLoading();
      }).catch((error: any) => {
        this.showAlertDialog('Error : ' + JSON.stringify(error));
        this.stopLoading();
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

}
