import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { PageUserInfo } from '../../../services/services';

@Component({
  selector: 'user-comment-card',
  templateUrl: './UserCommentCard.component.html'
})
export class UserCommentCard implements OnInit {

  @Input()
  protected width: string = "100%";
  @Input()
  protected height: string = "80pt";
  @Input()
  protected data: any ;
  @Input()
  protected bgContent: string = "#ffffff";
  @Input()
  protected link: string;
  @Input()
  protected imageUser: string = "../../../assets/components/pages/icons8-female-profile-128.png";
  @Input()
  protected class: string | [string];
  @Input()
  protected colorTab: string = "#968d81";
  @Input()
  protected isVoteTab: boolean = false;
  @Output()
  protected clickEditCardComment: EventEmitter<any> = new EventEmitter();
  @Output()
  protected clickDeleteCardComment: EventEmitter<any> = new EventEmitter();

  private pageUserInfo: PageUserInfo;

  constructor(pageUserInfo: PageUserInfo) {
    this.pageUserInfo = pageUserInfo;
  }

  public ngOnInit(): void {
    this.pageUserInfo.addPageUser(this.data.pageUser); 
  }


}
