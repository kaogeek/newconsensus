import { Component, Input, Output, EventEmitter,OnInit } from '@angular/core';
import { AbstractPage } from '../pages/AbstractPage';
import { MatDialog } from '@angular/material/dialog';
import { AuthenManager, PageUserInfo } from '../../services/services'; 
import { Router } from '@angular/router';
const PAGE_NAME: string = 'Content';


@Component({
  selector: 'content',
  templateUrl: './Content.component.html'
})
export class Content extends AbstractPage implements OnInit {
 
  public static readonly PAGE_NAME: string = PAGE_NAME;

  @Input()
  protected title: string = "-";
  @Input()
  protected createdBy: string = "-";
  @Input()
  protected content: string = "";
  @Input()
  protected textLink: string = "อ่านต่อ...";
  @Input()
  protected video: string = "-";
  @Input()
  protected image: string = "-";
  @Input()
  protected user: string = "-";
  @Input()
  protected width: string = "100%";
  @Input()
  protected height: string = "";
  @Input()
  protected colorTitle: string = "#000";
  @Input()
  protected colorContent: string = "#6c757d";
  @Input()
  protected bgContent: string = "#ffffff";
  @Input()
  protected colorLink: string = "blue";
  @Input()
  protected class: string | [string];
  @Input()
  protected display: string = "none";
  @Input()
  protected supportCount: number = 0;
  @Input()
  protected supportRequest: number = 0;
  @Input()
  protected facebookLink: string;
  @Input()
  protected likeCount: number;
  @Input()
  protected dislikeCount: number;
  @Input()
  protected isUserLike: boolean;
  @Input()
  protected options: any; // free data transfer if u want to use.
  @Output()
  protected likeClickedEvent: EventEmitter<any>;
  @Output()
  protected dislikeClickedEvent: EventEmitter<any>;
  @Input()
  protected pageUser: any; 
  
  private pageUserInfo: PageUserInfo;
  
  constructor(authenManager: AuthenManager,router: Router, dialog: MatDialog, pageUserInfo: PageUserInfo) {
    super(PAGE_NAME, authenManager, dialog, router);

    this.likeClickedEvent = new EventEmitter();
    this.dislikeClickedEvent = new EventEmitter();  
    this.pageUserInfo = pageUserInfo; 
  }

  public likeDebate(): void {
    if (this.likeClickedEvent !== undefined && this.likeClickedEvent !== null) {
      this.likeClickedEvent.emit(this.options);
    }
  }

  public dislikeDebate(): void {
    if (this.dislikeClickedEvent !== undefined && this.dislikeClickedEvent !== null) {
      this.dislikeClickedEvent.emit(this.options);
    }
  }

  public isShowAction(itemUserId: string): boolean {
    const userId = this.getCurrentUserId() + "";

    return userId === itemUserId + "";
  } 

  ngOnInit(): void {
    super.ngOnInit(); 
    this.pageUserInfo.addPageUser(this.pageUser);
  }

}
