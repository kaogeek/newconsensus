/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AbstractPage } from '../pages/AbstractPage';
import { AuthenManager, PageUserInfo } from '../../services/services';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
const PAGE_NAME: string = 'commentvote';

@Component({
  selector: 'comment-vote-item',
  templateUrl: './CommentVoteItem.component.html'
})
export class CommentVoteItem extends AbstractPage implements OnInit {

  public static readonly PAGE_NAME: string = PAGE_NAME;
  public isSeeMore: boolean = false;

  @Input()
  protected width: string = "100%";
  @Input()
  protected height: string = "130pt";
  @Input()
  protected class: string | [string];
  @Input()
  protected bgColor: string = "#ffffff";
  @Input()
  protected comment: string = "";
  @Input()
  protected createdName: string = "-";
  @Input()
  protected create: string = "10/12/2019 17:30:30";
  @Input()
  protected isUserLike: boolean;
  @Input()
  protected showAppove: boolean;
  @Input()
  protected likeTotal: number = 80;
  @Input()
  protected dislikeTotal: number = 20;
  @Input()
  protected pageUser: any;
  @Input()
  protected voteId: string;
  @Input()
  protected voteCommentId: string;
  @Input()
  protected voteData: any = [];
  @Input()
  protected showSubMenu: boolean;
  @Output()
  protected likeVoteCommentBtnClicked: EventEmitter<any> = new EventEmitter();
  @Output()
  protected dislikeVoteCommentBtnClicked: EventEmitter<any> = new EventEmitter();
  @Output()
  protected deleteActionBtnClicked: EventEmitter<any> = new EventEmitter();

  private pageUserInfo: PageUserInfo;

  public vote: any[];
  public voteComments: any[];

  constructor(authenManager: AuthenManager, router: Router, dialog: MatDialog, pageUserInfo: PageUserInfo) {
    super(PAGE_NAME, authenManager, dialog, router);
    this.pageUserInfo = pageUserInfo;
  }

  ngOnInit() {
    this.pageUserInfo.addPageUser(this.pageUser);
  }

  public isWordCountOver(): boolean {
    if (this.comment === undefined || this.comment === null) {
      return false;
    }

    return this.comment.length > 220;
  }

  public clickOpenDropDown(): void {
    this.isSeeMore = !this.isSeeMore;
  }

  public likeVoteCommentClicked(voteId: string, voteCommentId: string) {
    this.voteId = voteId;
    this.voteCommentId = voteCommentId;

    this.voteData.push(
      {
        voteId: this.voteId,
        voteCommentId: this.voteCommentId
      }
    );

    this.likeVoteCommentBtnClicked.emit(this.voteData);
  }

  public dislikeVoteCommentClicked(voteId: string, voteCommentId: string) {
    this.voteId = voteId;
    this.voteCommentId = voteCommentId;

    this.voteData.push(
      {
        voteId: this.voteId,
        voteCommentId: this.voteCommentId,
      }
    );

    this.dislikeVoteCommentBtnClicked.emit(this.voteData);
  }

  public deleteActionClicked(voteId: string, voteCommentId: string) {
    this.voteId = voteId;
    this.voteCommentId = voteCommentId;

    this.voteData.push(
      {
        voteId: this.voteId,
        voteCommentId: this.voteCommentId,
      }
    );

    this.deleteActionBtnClicked.emit(this.voteData);
  }
}
